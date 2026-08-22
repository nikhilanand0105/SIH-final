with open(r'D:\sih\pdf\models.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_models = '''
class CompareRequest(BaseModel):
    document_a_id: str
    document_b_id: str
'''

if 'class CompareRequest' not in code:
    code += new_models

with open(r'D:\sih\pdf\models.py', 'w', encoding='utf-8') as f:
    f.write(code)
