# Flutter Migration Mapping

## Expo Screens to Flutter Ports

### Tab Navigation (Bottom Tab Bar)
- `app/(tabs)/index.tsx` → Dashboard
  - Summary, recent documents, quick actions
  
- `app/(tabs)/documents.tsx` → Documents Screen
  - List of documents, filtering, search
  
- `app/(tabs)/scan.tsx` → Scanner Screen
  - Camera integration, document capture, upload
  
- `app/(tabs)/ai.tsx` → AI/Chat Screen
  - RAG queries, document QA
  
- `app/(tabs)/profile.tsx` → Profile Screen
  - User info, preferences, settings link

### Modal/Detail Screens
- `app/document/[id].tsx` → Document Detail
  - Document content, metadata, insights, linked documents
  
- `app/upload.tsx` → Upload Screen
  - File selection, metadata entry
  
- `app/compare.tsx` → Comparison Screen
  - Side-by-side document comparison
  
- `app/insights.tsx` → Insights/Intelligence Screen
  - Document insights, key findings
  
- `app/processing.tsx` → Processing Status
  - Upload progress, job status
  
- `app/reports.tsx` → Reports Screen
  - Generated reports, export options
  
- `app/knowledge-graph.tsx` → Knowledge Graph
  - Entity/relationship visualization
  
- `app/notifications.tsx` → Notifications
  - App notifications, alerts
  
- `app/settings.tsx` → Settings
  - App configuration, preferences

## Prince-Flutter Reusable Components

### Services to Port
- `api_service.dart` - HTTP client pattern
- `storage_service.dart` - Hive local storage
- `face_detector_service.dart` - Face detection (can adapt for document detection)

### Models to Reference
- `student.dart` - User model pattern
- `attendance.dart` - Job tracking pattern

### Screens/Patterns to Reference
- `login_screen.dart` - Auth pattern
- `teacher_dashboard.dart` - Dashboard layout
- `take_attendance_face.dart` - Camera UI pattern

### UI Patterns
- Face detection camera widget (can adapt for document scanning)
- Animated splash screen (nice UX pattern)
- Report/data display patterns (from charts)

## Expo Services to Port

### To Create in Flutter
- `DocumentService` → document_repository.dart
- `IngestionService` → ingestion_service.dart
- `ChatService` → ai_service.dart
- `ComparisonService` → comparison_service.dart
- `AuthService` → auth_repository.dart

### Types to Implement
- All 40+ types from `types.ts` → Dart models

### Mock Data Strategy
- Use `mockData/` from Expo as reference for Dart models
- Same data structure, same mock values

## State Management Decision

### Current Prince-Flutter
- Uses MaterialApp with Navigator (basic)
- No provider pattern observed
- LocalStorage via Hive

### Current Expo
- Uses React Context (Auth, Theme)
- No Redux/Zustand observed
- Services-based approach

### Recommendation
- **Use Riverpod** (recommended by user if no working solution)
- Provides: dependency injection, async state, caching
- Clean separation: providers for auth, documents, ai, etc.
- Better testability than Context

## Architecture Layers

```
lib/
├── core/          (platform-agnostic)
│   ├── config/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   ├── security/
│   ├── storage/
│   ├── theme/
│   └── utils/
├── features/      (feature modules)
│   ├── auth/
│   ├── dashboard/
│   ├── documents/
│   ├── scanner/
│   ├── ai/
│   ├── comparison/
│   ├── insights/
│   ├── reports/
│   └── ...
└── shared/        (cross-cutting)
    ├── models/
    ├── services/
    └── widgets/
```

## Dependencies to Keep/Add

### Keep from prince-flutter
- `camera: ^0.11.0+1` - For scanner
- `image_picker: ^0.8.7+4` - Document selection
- `flutter_secure_storage: ^9.0.0` - Credentials
- `hive: ^2.2.3` - Local caching
- `http: ^1.2.2` - API calls
- `permission_handler: ^12.0.1` - Camera/file permissions

### Add New
- `riverpod: ^2.x` - State management
- `go_router: ^12.x` - Navigation
- `dio: ^5.x` - Better HTTP client
- `firebase_core: ^24.x` - Analytics (already in prince)
- `google_mlkit_*` - ML Kit integration (already in prince)

## What NOT to Change

✅ Keep prince-flutter structure as is initially
✅ Keep existing screens where they work
✅ Keep Hive storage approach
✅ Keep Firebase integration (if working)
✅ Keep camera/image picking logic

## What TO Refactor

⏳ Extract prince-flutter screens → feature modules
⏳ Add Riverpod providers for state
⏳ Add GoRouter for navigation
⏳ Create repositories for API calls
⏳ Port Expo models → Dart models
⏳ Port Expo services → repositories
⏳ Create theme system
⏳ Standardize error handling

