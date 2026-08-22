with open(r'D:\sih\pdf\models.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_models = '''
class ChatRequest(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None
    stream: Optional[bool] = False
    
class CitationResponse(BaseModel):
    id: str
    document_id: str
    text: str
    score: float

class ChatResponse(BaseModel):
    answer: str
    citations: List[CitationResponse]
'''

code += new_models

with open(r'D:\sih\pdf\models.py', 'w', encoding='utf-8') as f:
    f.write(code)
