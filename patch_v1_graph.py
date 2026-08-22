with open(r'D:\sih\pdf\routes\v1.py', 'r', encoding='utf-8') as f:
    code = f.read()

imports = '''from database import get_db, DocumentDB, ProcessingJobDB, DocumentStatusEnum, JobStageEnum, EntityDB, RelationshipDB'''
code = code.replace('from database import get_db, DocumentDB, ProcessingJobDB, DocumentStatusEnum, JobStageEnum', imports)

graph_route = '''
@router.get("/documents/{document_id}/graph")
async def get_document_graph(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(DocumentDB).filter(DocumentDB.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    entities = db.query(EntityDB).filter(EntityDB.document_id == document_id).all()
    
    # Get relationships where either source or target is in the entities
    # A simple way for a single doc is just grab relationships for these entities
    ent_ids = [e.id for e in entities]
    relationships = db.query(RelationshipDB).filter(
        RelationshipDB.source_entity_id.in_(ent_ids) | RelationshipDB.target_entity_id.in_(ent_ids)
    ).all()
    
    nodes = []
    for e in entities:
        nodes.append({
            "id": e.id,
            "label": e.name,
            "type": e.type,
            "confidence": e.confidence
        })
        
    edges = []
    for r in relationships:
        edges.append({
            "id": r.id,
            "source": r.source_entity_id,
            "target": r.target_entity_id,
            "label": r.type,
            "confidence": r.confidence
        })
        
    return {
        "nodes": nodes,
        "edges": edges
    }
'''

code += graph_route

with open(r'D:\sih\pdf\routes\v1.py', 'w', encoding='utf-8') as f:
    f.write(code)
