import re

with open(r'D:\sih\pdf\database.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Add pgvector import conditionally
imports = '''from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum, JSON, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import os
import uuid
import enum

try:
    from pgvector.sqlalchemy import Vector
    HAS_PGVECTOR = True
except ImportError:
    HAS_PGVECTOR = False

DATABASE_URL = os.getenv("POSTGRES_URL", "sqlite:///./documind.db")
IS_POSTGRES = DATABASE_URL.startswith("postgresql")

'''
code = re.sub(r'from sqlalchemy import.*?\nimport enum\n', imports, code, flags=re.DOTALL)

# Modify DocumentChunkDB
old_chunk_db = '''class DocumentChunkDB(Base):
    __tablename__ = "document_chunks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"))
    version_id = Column(String)
    page = Column(Integer, nullable=True)
    text = Column(String)
    chunk_index = Column(Integer)
    embedding_model = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)'''

new_chunk_db = '''class DocumentChunkDB(Base):
    __tablename__ = "document_chunks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"))
    version_id = Column(String, nullable=True)
    page = Column(Integer, nullable=True)
    text = Column(Text)
    chunk_index = Column(Integer)
    embedding_model = Column(String, nullable=True)
    # Hybrid RAG embeddings
    if IS_POSTGRES and HAS_PGVECTOR:
        embedding = Column(Vector(384)) # typical for all-MiniLM-L6-v2
    else:
        embedding = Column(JSON, nullable=True) # Fallback for SQLite
    
    metadata_ = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)'''

code = code.replace(old_chunk_db, new_chunk_db)

with open(r'D:\sih\pdf\database.py', 'w', encoding='utf-8') as f:
    f.write(code)
