with open(r'D:\sih\pdf\worker.py', 'r', encoding='utf-8') as f:
    code = f.read()

imports = '''from document.processor import DocumentProcessor
from celery_app import celery_app
from rag.engine import create_rag_engine'''
code = code.replace('from document.processor import DocumentProcessor\nfrom celery_app import celery_app', imports)

old_emb = '''        # 3. EMBEDDING
        job.stage = JobStageEnum.EMBEDDING
        job.progress = 0.7
        job.message = "Generating embeddings (simulated)..."
        db.commit()
        time.sleep(1)'''

new_emb = '''        # 3. EMBEDDING
        job.stage = JobStageEnum.EMBEDDING
        job.progress = 0.7
        job.message = f"Generating dense and sparse embeddings for {len(chunks)} chunks..."
        db.commit()
        
        # Initialize the Hybrid RAG Engine and add documents to pgvector/bm25 store
        rag = create_rag_engine()
        rag.add_documents(chunks, chunk_metadata)'''

code = code.replace(old_emb, new_emb)

with open(r'D:\sih\pdf\worker.py', 'w', encoding='utf-8') as f:
    f.write(code)
