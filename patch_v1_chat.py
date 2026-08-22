with open(r'D:\sih\pdf\routes\v1.py', 'r', encoding='utf-8') as f:
    code = f.read()

imports = '''from models import HealthResponse, DocumentRecord, ProcessingJob, ChatRequest, ChatResponse, CitationResponse
from rag.engine import create_rag_engine
'''
code = code.replace('from models import HealthResponse, DocumentRecord, ProcessingJob', imports)

chat_route = '''

# Singleton for RAG engine to avoid reloading models per request
rag_engine_instance = None
def get_rag_engine():
    global rag_engine_instance
    if rag_engine_instance is None:
        rag_engine_instance = create_rag_engine()
    return rag_engine_instance

@router.post("/chat", response_model=ChatResponse)
async def chat_with_documents(
    req: ChatRequest, 
    db: Session = Depends(get_db)
):
    rag = get_rag_engine()
    
    # Optional filtering by document
    filter_dict = {}
    
    # Use the RAG engine to search
    # For Phase 6 we need grounded citations
    search_results = rag.search(req.query, top_k=5, filter_dict=filter_dict)
    
    # In Phase 6, we must ground the LLM. 
    # Let's use the rag_engine to generate a response if LLM is attached, 
    # but the prompt requires returning JSON, or we can just format the context.
    
    context_texts = []
    citations = []
    
    # Make sure we only grab results belonging to document_ids if specified
    filtered_results = []
    for r in search_results:
        doc_id = r["metadata"].get("document_id")
        if req.document_ids and doc_id not in req.document_ids:
            continue
        filtered_results.append(r)
        
    for idx, res in enumerate(filtered_results):
        context_texts.append(f"[Citation {idx+1}] {res['text']}")
        citations.append(CitationResponse(
            id=res["id"],
            document_id=res["metadata"].get("document_id", "unknown"),
            text=res["text"],
            score=float(res["score"])
        ))
        
    if not context_texts:
        return ChatResponse(answer="I couldn't find any relevant information to answer your question.", citations=[])
        
    context_block = "\n\n".join(context_texts)
    
    # Let RAG Engine use its LLM to answer (if configured), otherwise mock it.
    if rag.llm:
        prompt = f"Answer the following question based ONLY on the provided context. When you use information from a citation, append [Citation X] to the end of the sentence.\n\nContext:\n{context_block}\n\nQuestion: {req.query}\n\nAnswer:"
        
        if hasattr(rag.llm, "generate_openai_response"):
            answer = rag.llm.generate_openai_response(prompt, max_tokens=1000)
        elif hasattr(rag.llm, "generate_response"):
            answer = rag.llm.generate_response(prompt, max_tokens=1000)
        else:
            answer = "I found relevant documents but the LLM is not fully configured."
    else:
        answer = f"I am running without an LLM. Based on the documents, here is the most relevant snippet: {citations[0].text}"
        
    return ChatResponse(answer=answer, citations=citations)
'''

code += chat_route

with open(r'D:\sih\pdf\routes\v1.py', 'w', encoding='utf-8') as f:
    f.write(code)
