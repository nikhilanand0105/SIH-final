with open(r'D:\sih\pdf\routes\v1.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace all problematic string concatenations
import re

code = code.replace('context_block = "\n\n".join(context_texts)', 'context_block = "\\n\\n".join(context_texts)')
code = code.replace('f"Answer the following question based ONLY on the provided context. When you use information from a citation, append [Citation X] to the end of the sentence.\n\nContext:\n{context_block}\n\nQuestion: {req.query}\n\nAnswer:"', 'f"Answer the following question based ONLY on the provided context. When you use information from a citation, append [Citation X] to the end of the sentence.\\n\\nContext:\\n{context_block}\\n\\nQuestion: {req.query}\\n\\nAnswer:"')

with open(r'D:\sih\pdf\routes\v1.py', 'w', encoding='utf-8') as f:
    f.write(code)
