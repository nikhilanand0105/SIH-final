import os
import re

SERVICES_DIR = "d:/sih/documind-ai/services"

def fix_services():
    for filename in os.listdir(SERVICES_DIR):
        if not filename.endswith(".ts"):
            continue
            
        filepath = os.path.join(SERVICES_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Clean up any bad quotes and backslashes in fetchApi calls
        # We want to replace fetchApi('/\/... with fetchApi('/...
        content = content.replace("fetchApi('/\\/", "fetchApi('/")
        content = content.replace("fetchApi('/\\", "fetchApi('/")
        content = content.replace("fetchApi(\"/\/\",", "fetchApi('/',")
        
        # documentService might have `fetchApi('/documents/\\');`
        content = re.sub(r"fetchApi\('([^']+)\\+'\)", r"fetchApi('\1')", content)
        content = re.sub(r"fetchApi\('([^']+)\\+',", r"fetchApi('\1',", content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
if __name__ == "__main__":
    fix_services()
