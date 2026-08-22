with open(r'D:\sih\documind-ai\services\ingestionService.ts', 'r', encoding='utf-8') as f:
    code = f.read()

new_code = '''import { DocumentInput, DocumentRecord } from '@/types';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
    return \http://\:8000/api/v1\;
};

export class IngestionService {
  static async uploadDocument(input: DocumentInput): Promise<DocumentRecord> {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: input.file.uri,
          name: input.file.name, // React Native FormData uses 'name' not 'filename' natively
          type: input.file.mimeType || 'application/pdf',
        } as any);

        const response = await fetch(\\/documents/upload\, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        
        const record: DocumentRecord = {
          id: data.document_id, // The backend upload route returns document_id, job_id, status
          filename: input.file.name,
          status: 'QUEUED',
          created_at: new Date().toISOString(),
        };
        resolve(record);
      } catch (error) {
        reject(error);
      }
    });
  }
}
'''
with open(r'D:\sih\documind-ai\services\ingestionService.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)
