with open(r'D:\sih\pdf\storage\vector_db.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    'db_type: str = "faiss",',
    'db_type: str = "postgres",'
)

old_init = '''    if db_type.lower() == "faiss":
        return FaissVectorDatabase(dimension=dimension, **kwargs)'''

new_init = '''    if db_type.lower() == "postgres":
        from storage.pgvector_db import PostgresVectorDatabase
        return PostgresVectorDatabase(dimension=dimension)
    elif db_type.lower() == "faiss":
        return FaissVectorDatabase(dimension=dimension, **kwargs)'''

code = code.replace(old_init, new_init)

with open(r'D:\sih\pdf\storage\vector_db.py', 'w', encoding='utf-8') as f:
    f.write(code)
