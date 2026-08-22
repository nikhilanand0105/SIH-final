/// Application exceptions
abstract class AppException implements Exception {
  final String message;
  AppException(this.message);

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  NetworkException(String message) : super(message);
}

class AuthException extends AppException {
  AuthException(String message) : super(message);
}

class StorageException extends AppException {
  StorageException(String message) : super(message);
}

class ProcessingException extends AppException {
  ProcessingException(String message) : super(message);
}

class NotFoundException extends AppException {
  NotFoundException(String message) : super(message);
}

class ValidationException extends AppException {
  ValidationException(String message) : super(message);
}
