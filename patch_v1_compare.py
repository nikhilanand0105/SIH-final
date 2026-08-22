with open(r'D:\sih\pdf\routes\v1.py', 'r', encoding='utf-8') as f:
    code = f.read()

imports = '''from models import HealthResponse, DocumentRecord, ProcessingJob, ChatRequest, ChatResponse, CitationResponse, CompareRequest, Comparison
from database import DocumentChunkDB'''
code = code.replace('from models import HealthResponse, DocumentRecord, ProcessingJob, ChatRequest, ChatResponse, CitationResponse', imports)

compare_route = '''
@router.post("/documents/compare", response_model=Comparison)
async def compare_documents(req: CompareRequest, db: Session = Depends(get_db)):
    doc_a = db.query(DocumentDB).filter(DocumentDB.id == req.document_a_id).first()
    doc_b = db.query(DocumentDB).filter(DocumentDB.id == req.document_b_id).first()
    
    if not doc_a or not doc_b:
        raise HTTPException(status_code=404, detail="One or both documents not found")
        
    chunks_a = db.query(DocumentChunkDB).filter(DocumentChunkDB.document_id == req.document_a_id).order_by(DocumentChunkDB.chunk_index).all()
    chunks_b = db.query(DocumentChunkDB).filter(DocumentChunkDB.document_id == req.document_b_id).order_by(DocumentChunkDB.chunk_index).all()
    
    text_a = "\\n".join([c.text for c in chunks_a if c.text])
    text_b = "\\n".join([c.text for c in chunks_b if c.text])
    
    # Trim for LLM context limits roughly
    text_a = text_a[:4000]
    text_b = text_b[:4000]
    
    rag = get_rag_engine()
    
    if rag.llm:
        prompt = f"Compare the following two documents and identify the key differences. Provide a concise summary of structural differences and semantic conflicts.\\n\\nDocument A:\\n{text_a}\\n\\nDocument B:\\n{text_b}\\n\\nComparison Summary:"
        if hasattr(rag.llm, "generate_openai_response"):
            summary = rag.llm.generate_openai_response(prompt, max_tokens=1000)
        elif hasattr(rag.llm, "generate_response"):
            summary = rag.llm.generate_response(prompt, max_tokens=1000)
        else:
            summary = "LLM not fully configured for comparison."
    else:
        summary = "LLM is disabled. A physical diff would show that Document A is {} chars and Document B is {} chars.".format(len(text_a), len(text_b))
        
    return Comparison(
        id=str(uuid.uuid4()),
        document_a_id=req.document_a_id,
        document_b_id=req.document_b_id,
        summary=summary,
        changes={"added": [], "removed": [], "modified": []}, # In a deep implementation, this would be structured via LLM JSON output
        created_at=datetime.utcnow()
    )
'''

code += compare_route

with open(r'D:\sih\pdf\routes\v1.py', 'w', encoding='utf-8') as f:
    f.write(code)
