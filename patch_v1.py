import re

with open(r'D:\sih\pdf\routes\v1.py', 'r', encoding='utf-8') as f:
    code = f.read()

if 'from worker import process_document_background' not in code:
    code = code.replace('from database import get_db', 'from worker import process_document_background\nfrom database import get_db')

# Use regex to inject the delay call if it's missing
if 'process_document_background.delay' not in code:
    code = re.sub(
        r'db\.refresh\(job\)\s+return \{',
        'db.refresh(job)\n    \n    # Spawn background task via Celery\n    process_document_background.delay(doc.id, job.id)\n    \n    return {',
        code
    )
    
    code = re.sub(
        r'db\.commit\(\)\s+return \{"status": "QUEUED"\}',
        'db.commit()\n    \n    process_document_background.delay(doc.id, job.id)\n    return {"status": "QUEUED"}',
        code
    )

with open(r'D:\sih\pdf\routes\v1.py', 'w', encoding='utf-8') as f:
    f.write(code)
