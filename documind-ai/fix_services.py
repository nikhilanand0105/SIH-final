import os
import re

SERVICES_DIR = "d:/sih/documind-ai/services"

def fix_services():
    for filename in os.listdir(SERVICES_DIR):
        if not filename.endswith(".ts"):
            continue
            
        filepath = os.path.join(SERVICES_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace whatever `fetchApi(\\/v1/...\,` with `fetchApi('/v1/...',`
        content = re.sub(r'fetchApi\(\\\/([^,\)]+)\\,', r"fetchApi('/\1',", content)
        content = re.sub(r'fetchApi\(\\\/([^,\)]+)\\\)', r"fetchApi('/\1')", content)
        
        # Also fix documentService.ts which might have `\/documents\`
        content = re.sub(r'fetchApi\(\\\/documents\\', r"fetchApi('/documents'", content)
        content = re.sub(r"fetchApi\('/documents'/", r"fetchApi('/documents/", content)
        
        # Let's just do a brute-force regex for `fetchApi(\/something\)`
        content = re.sub(r'fetchApi\(\\\/?([^,\)]+)\\\)', r"fetchApi('/\1')", content)
        content = re.sub(r'fetchApi\(\\\/?([^,\)]+)\\', r"fetchApi('/\1'", content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
if __name__ == "__main__":
    fix_services()
