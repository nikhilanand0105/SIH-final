with open(r'D:\sih\pdf\storage\pgvector_db.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_method = '''
    def add_documents(self, documents: List[Document]) -> List[str]:
        db = SessionLocal()
        ids = []
        try:
            for doc in documents:
                embedding_val = doc.embedding.tolist() if doc.embedding is not None else None
                chunk = DocumentChunkDB(
                    id=doc.id,
                    document_id=doc.metadata.get("document_id"),
                    text=doc.text,
                    chunk_index=doc.metadata.get("chunk_id", 0),
                    embedding=embedding_val,
                    metadata_=doc.metadata
                )
                db.add(chunk)
                ids.append(doc.id)
                if chunk.text:
                    self._bm25_docs.append(chunk)
                    self._bm25_corpus.append(chunk.text.split())
            db.commit()
            if self._bm25_corpus:
                self._bm25 = BM25Okapi(self._bm25_corpus)
            return ids
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to add documents to Postgres DB: {e}")
            raise
        finally:
            db.close()
'''

if 'def add_documents' not in code:
    code += new_method

with open(r'D:\sih\pdf\storage\pgvector_db.py', 'w', encoding='utf-8') as f:
    f.write(code)
