with open(r'D:\sih\documind-ai\app\(tabs)\ai.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("import { chatService } from '@/services/mockServices';", "import { chatService } from '@/services/chatService';")

with open(r'D:\sih\documind-ai\app\(tabs)\ai.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
