import os

target_dir = r'D:\sih\documind-ai'
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except:
                continue
                
            if 'mockServices' in content:
                print(f"Found mockServices in {path}")
                # For auth, leave it or map it to authService (we can leave mockServices for Auth since Phase 9 is docs)
                if "AuthContext" not in path:
                    # Generic replace
                    content = content.replace("import { documentService } from '@/services/mockServices';", "import { documentService } from '@/services/documentService';")
                    content = content.replace("import { chatService } from '@/services/mockServices';", "import { chatService } from '@/services/chatService';")
                    content = content.replace("import { insightsService } from '@/services/mockServices';", "import { insightsService } from '@/services/insightsService';")
                    
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
