/// User model - mirrors DemoUser from types.ts
class User {
  final String? id;
  final String name;
  final String? email;
  final String? role;
  final String? avatar;
  final String? initials;
  final String? organization;
  final String? lastLogin;

  User({
    this.id,
    required this.name,
    this.email,
    this.role,
    this.avatar,
    this.initials,
    this.organization,
    this.lastLogin,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'] ?? '',
      email: json['email'],
      role: json['role'],
      avatar: json['avatar'],
      initials: json['initials'],
      organization: json['organization'],
      lastLogin: json['lastLogin'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'avatar': avatar,
      'initials': initials,
      'organization': organization,
      'lastLogin': lastLogin,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? role,
    String? avatar,
    String? initials,
    String? organization,
    String? lastLogin,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      avatar: avatar ?? this.avatar,
      initials: initials ?? this.initials,
      organization: organization ?? this.organization,
      lastLogin: lastLogin ?? this.lastLogin,
    );
  }
}
