with open(r'D:\sih\pdf\models.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_cit = '''class CitationResponse(BaseModel):
    id: str
    document_id: str
    text: str
    score: float'''

new_cit = '''class CitationResponse(BaseModel):
    id: str
    answer_id: str
    document_id: str
    chunk_id: str
    page: Optional[str] = None
    snippet: str
    retrieval_score: float'''

code = code.replace(old_cit, new_cit)

with open(r'D:\sih\pdf\models.py', 'w', encoding='utf-8') as f:
    f.write(code)
