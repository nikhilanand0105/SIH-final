import os

with open(r'D:\sih\pdf\document\processor.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Add parsers import at the top
if 'from .parsers' not in code:
    code = code.replace('import uuid\n', 'import uuid\nfrom .parsers import ExistingTextParser, DoclingParser, CanonicalDocument\n')

# Modify process_file signature slightly to accept document_id, but make it optional
code = code.replace(
    'def process_file(\n        self,\n        file_path: str,\n        metadata: Optional[Dict[str, Any]] = None,\n        task_type: Optional[str] = None\n    ) -> Tuple[List[str], List[Dict[str, Any]]]:',
    'def process_file(\n        self,\n        file_path: str,\n        metadata: Optional[Dict[str, Any]] = None,\n        task_type: Optional[str] = None,\n        document_id: Optional[str] = None,\n        use_docling: bool = False\n    ) -> Tuple[List[str], List[Dict[str, Any]]]:'
)

# Modify extraction in process_file
old_extract = '''        # Extract text from document
        logger.info(f"Processing document: {file_path}")
        text = self._extract_text(file_path)'''

new_extract = '''        # Extract text from document
        logger.info(f"Processing document: {file_path}")
        doc_id = document_id or str(uuid.uuid4())
        
        canonical_doc = None
        if use_docling or (metadata and metadata.get('force_docling')):
            try:
                parser = DoclingParser()
                canonical_doc = parser.parse(file_path, doc_id)
                text = canonical_doc.text
            except Exception as e:
                logger.error(f"Docling parser failed: {e}")
                text = self._extract_text(file_path)
        else:
            parser = ExistingTextParser()
            canonical_doc = parser.parse(file_path, doc_id)
            text = canonical_doc.text'''

code = code.replace(old_extract, new_extract)

with open(r'D:\sih\pdf\document\processor.py', 'w', encoding='utf-8') as f:
    f.write(code)
