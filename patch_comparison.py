with open(r'D:\sih\documind-ai\services\comparisonService.ts', 'r', encoding='utf-8') as f:
    code = f.read()

new_code = '''import Constants from 'expo-constants';

const getBaseUrl = () => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
    return \http://\:8000/api\;
};

export const comparisonService = {
  async compare(documentAId: string, documentBId: string) {
    const res = await fetch(\\/v1/documents/compare\, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_a_id: documentAId, document_b_id: documentBId }),
    });
    if (!res.ok) {
      throw new Error('Comparison failed');
    }
    return await res.json();
  },
};

export const reportService = {
  async list() {
    const res = await fetch(\\/v1/reports\);
    if (!res.ok) {
      throw new Error('Failed to fetch reports');
    }
    return await res.json();
  },
};
'''

with open(r'D:\sih\documind-ai\services\comparisonService.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)
