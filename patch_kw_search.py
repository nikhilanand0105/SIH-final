with open(r'D:\sih\pdf\rag\engine.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_kw = '''    def _keyword_search(
        self,
        query: str,
        top_k: int,
        filter_func: Optional[Any] = None
    ) -> List[Tuple[Any, float]]:
        """Score documents by keyword overlap with the query."""
        if not hasattr(self.vector_db, "documents") or not self.vector_db.documents:
            return []

        query_terms = set(re.findall(r"\w+", query.lower()))
        if not query_terms:
            return []

        scored: List[Tuple[Any, float]] = []
        for doc in self.vector_db.documents.values():
            if filter_func and not filter_func(doc):
                continue
            doc_terms = set(re.findall(r"\w+", doc.text.lower()))
            overlap = len(query_terms.intersection(doc_terms))
            score = overlap / len(query_terms)
            if score > 0:
                scored.append((doc, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]'''

new_kw = '''    def _keyword_search(
        self,
        query: str,
        top_k: int,
        filter_func: Optional[Any] = None
    ) -> List[Tuple[Any, float]]:
        """Score documents by keyword overlap with the query."""
        if hasattr(self.vector_db, "keyword_search"):
            return self.vector_db.keyword_search(query, top_k)
            
        if not hasattr(self.vector_db, "documents") or not self.vector_db.documents:
            return []

        query_terms = set(re.findall(r"\w+", query.lower()))
        if not query_terms:
            return []

        scored: List[Tuple[Any, float]] = []
        for doc in self.vector_db.documents.values():
            if filter_func and not filter_func(doc):
                continue
            doc_terms = set(re.findall(r"\w+", doc.text.lower()))
            overlap = len(query_terms.intersection(doc_terms))
            score = overlap / len(query_terms)
            if score > 0:
                scored.append((doc, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]'''

code = code.replace(old_kw, new_kw)

with open(r'D:\sih\pdf\rag\engine.py', 'w', encoding='utf-8') as f:
    f.write(code)
