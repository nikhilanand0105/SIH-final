with open(r'D:\sih\documind-ai\app\(tabs)\documents.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Need to replace demoDocuments with a state fetched from documentService
import re

# Add imports
code = code.replace("import { demoDocuments } from '@/mockData';", "import { documentService } from '@/services/documentService';\nimport { useEffect } from 'react';")

# Find the component function start
code = code.replace('export default function DocumentsScreen() {', 'export default function DocumentsScreen() {\n  const [demoDocuments, setDemoDocuments] = useState<DocumentRecord[]>([]);\n  useEffect(() => {\n    documentService.list().then(setDemoDocuments).catch(console.error);\n  }, []);')
code = code.replace('import { useState } from', 'import { useState, useEffect } from')

with open(r'D:\sih\documind-ai\app\(tabs)\documents.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
