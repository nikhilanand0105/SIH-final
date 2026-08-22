import re
with open(r'D:\sih\pdf\rag\engine.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Change default to postgres
code = re.sub(r'vector_db = create_vector_database\(dimension=embedder.dimension\)', 'vector_db = create_vector_database(db_type="postgres", dimension=embedder.dimension)', code)

with open(r'D:\sih\pdf\rag\engine.py', 'w', encoding='utf-8') as f:
    f.write(code)
