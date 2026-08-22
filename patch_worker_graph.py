with open(r'D:\sih\pdf\worker.py', 'r', encoding='utf-8') as f:
    code = f.read()

imports = '''from rag.engine import create_rag_engine
from document.graph_builder import SimpleGraphBuilder
from database import EntityDB, RelationshipDB'''

code = code.replace('from rag.engine import create_rag_engine', imports)

old_graph = '''        # 4. GRAPH_BUILDING
        job.stage = JobStageEnum.GRAPH_BUILDING
        job.progress = 0.85
        job.message = "Extracting entities (simulated)..."
        db.commit()
        time.sleep(1)'''

new_graph = '''        # 4. GRAPH_BUILDING
        job.stage = JobStageEnum.GRAPH_BUILDING
        job.progress = 0.85
        job.message = "Extracting entities and relationships..."
        db.commit()
        
        try:
            builder = SimpleGraphBuilder()
            graph_data = builder.extract(document_id, chunks, chunk_metadata)
            
            # Save to DB
            for ent in graph_data["entities"]:
                # Cast hash ID to string safely
                ent["id"] = str(ent["id"])
                db.merge(EntityDB(**ent))
                
            for rel in graph_data["relationships"]:
                rel["id"] = str(rel["id"])
                db.merge(RelationshipDB(**rel))
                
            db.commit()
        except Exception as ge:
            logger.error(f"Graph building failed: {ge}")
            db.rollback()'''

code = code.replace(old_graph, new_graph)

with open(r'D:\sih\pdf\worker.py', 'w', encoding='utf-8') as f:
    f.write(code)
