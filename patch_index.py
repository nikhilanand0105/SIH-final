with open(r'D:\sih\documind-ai\app\(tabs)\index.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("import { demoDocuments } from '@/mockData';", "import { documentService } from '@/services/documentService';\nimport { useEffect, useState } from 'react';\nimport { DocumentRecord } from '@/types';")

# Find where demoDocuments is sliced
old_recent = "const recentDocs = demoDocuments.slice(0, 3);"
new_recent = '''const [demoDocuments, setDemoDocuments] = useState<DocumentRecord[]>([]);
  useEffect(() => {
    documentService.list().then(setDemoDocuments).catch(console.error);
  }, []);
  const recentDocs = demoDocuments.slice(0, 3);'''
  
code = code.replace(old_recent, new_recent)

with open(r'D:\sih\documind-ai\app\(tabs)\index.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
