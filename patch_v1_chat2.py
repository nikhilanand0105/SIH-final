with open(r'D:\sih\pdf\routes\v1.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_map = '''        citations.append(CitationResponse(
            id=res["id"],
            document_id=res["metadata"].get("document_id", "unknown"),
            text=res["text"],
            score=float(res["score"])
        ))'''

new_map = '''        citations.append(CitationResponse(
            id=str(uuid.uuid4()),
            answer_id="ans_" + str(uuid.uuid4())[:8],
            document_id=res["metadata"].get("document_id", "unknown"),
            chunk_id=res["id"],
            page=str(res["metadata"].get("page", "")),
            snippet=res["text"],
            retrieval_score=float(res["score"])
        ))'''

code = code.replace(old_map, new_map)

with open(r'D:\sih\pdf\routes\v1.py', 'w', encoding='utf-8') as f:
    f.write(code)
