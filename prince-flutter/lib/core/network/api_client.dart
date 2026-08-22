/// Network client for API communication
import 'package:dio/dio.dart';
import '../../shared/models/user.dart';
import '../config/app_config.dart';
import '../errors/exceptions.dart';

class ApiClient {
  late Dio _dio;

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        contentType: 'application/json',
      ),
    );

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // TODO: Add auth token from storage
          // final token = await _getAuthToken();
          // if (token != null) {
          //   options.headers['Authorization'] = 'Bearer $token';
          // }
          return handler.next(options);
        },
        onError: (error, handler) {
          return handler.next(_handleError(error));
        },
      ),
    );
  }

  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        path,
        queryParameters: queryParameters,
      );
      
      if (response.data != null && fromJson != null) {
        return fromJson(response.data!);
      }
      
      throw NetworkException('Invalid response data');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        path,
        data: data,
      );

      if (response.data != null && fromJson != null) {
        return fromJson(response.data!);
      }

      throw NetworkException('Invalid response data');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<void> delete(String path) async {
    try {
      await _dio.delete(path);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  AppException _handleDioError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout) {
      return NetworkException('Connection timeout');
    } else if (error.type == DioExceptionType.badResponse) {
      final statusCode = error.response?.statusCode;
      final message = error.response?.data?['message'] ?? 'Unknown error';
      
      if (statusCode == 401) {
        return AuthException(message);
      } else if (statusCode == 404) {
        return NotFoundException(message);
      }
      
      return NetworkException('Error: $statusCode - $message');
    }
    return NetworkException(error.message ?? 'Unknown error');
  }

  DioException _handleError(DioException error) {
    return error;
  }

  void close() {
    _dio.close();
  }
}
