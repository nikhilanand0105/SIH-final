with open(r'D:\sih\documind-ai\app\document\[id].tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("import { demoDocuments } from '@/mockData';", "import { documentService } from '@/services/documentService';\nimport { useState, useEffect } from 'react';\nimport { DocumentRecord } from '@/types';")

# Find 'const document = demoDocuments.find...'
old_find = "const document = demoDocuments.find((d) => d.id === id);"
new_find = '''const [document, setDocument] = useState<DocumentRecord | undefined>(undefined);
  useEffect(() => {
    if (id) {
      documentService.getById(id as string).then(setDocument).catch(console.error);
    }
  }, [id]);'''
  
code = code.replace(old_find, new_find)

with open(r'D:\sih\documind-ai\app\document\[id].tsx', 'w', encoding='utf-8') as f:
    f.write(code)
