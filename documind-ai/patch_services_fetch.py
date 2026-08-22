import os

SERVICES_DIR = "d:/sih/documind-ai/services"

def patch_services():
    for filename in os.listdir(SERVICES_DIR):
        if not filename.endswith("Service.ts") or filename == "apiClient.ts" or filename == "mockServices.ts":
            continue
            
        filepath = os.path.join(SERVICES_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace await fetch with await fetchApi
        content = content.replace("await fetch(", "await fetchApi(")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
if __name__ == "__main__":
    patch_services()
    print("Patched all services (fetch -> fetchApi).")
