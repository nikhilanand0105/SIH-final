import os
import re

SERVICES_DIR = "d:/sih/documind-ai/services"

def patch_services():
    for filename in os.listdir(SERVICES_DIR):
        if not filename.endswith("Service.ts") or filename == "apiClient.ts" or filename == "mockServices.ts":
            continue
            
        filepath = os.path.join(SERVICES_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace getBaseUrl and fetch
        if "import { fetchApi } from './apiClient';" not in content:
            content = "import { fetchApi } from './apiClient';\n" + content
            
        # Remove getBaseUrl definition
        content = re.sub(r'const getBaseUrl = \(\) => \{[^}]+\};\n', '', content)
        content = re.sub(r"import Constants from 'expo-constants';\n", '', content)
        
        # Replace `fetch(`${getBaseUrl()}` with `fetchApi(`
        content = re.sub(r'fetch\(`\$\{getBaseUrl\(\)\}([^`]+)`', r'fetchApi(`\1`', content)
        # Handle cases where getBaseUrl might be removed but fetch remains
        content = re.sub(r'fetch\(`', r'fetchApi(`', content)
        # but wait, the URL was `${getBaseUrl()}/documents`. If it's already removed?
        # Let's just fix the endpoints to start with /
        content = content.replace("fetch(baseUrl + '", "fetchApi('")
        
        # If fetch is left with just path
        content = content.replace("await fetch(`/", "await fetchApi(`/")
        content = content.replace("await fetch('/", "await fetchApi('/")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
if __name__ == "__main__":
    patch_services()
    print("Patched all services.")
