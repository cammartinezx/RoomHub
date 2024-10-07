import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_frontend/aws_auth.dart';


final authUserProvider = FutureProvider<String?>((ref) {

  // Watch the authAWSRepositoryProvider
  final authAWSRepo = ref.watch(authAWSRepositoryProvider);
  return authAWSRepo.user.then((value)=>value);
  // If authAWSRepo is not null, retrieve the user
});




/*inal authUserProvider = FutureProvider<String>((ref) {
  final authAWSRepo = ref.watch(authAWSRepositoryProvider);
  return authAWSRepo.user.then((value)=>value);
});

final authUserProvider = FutureProvider<String?>((ref) {
  // Watch the auth repository provider to access user data
  final authAWSRepo = ref.watch(authAWSRepositoryProvider);

  // Return the user data, handling null values gracefully
  return authAWSRepo.user.then((user) {
    // Check if the user is null
    if (user != null) {
      return user; // Return the user if found
    } else {
      // Optionally log or handle the null case
      throw Exception('User not found'); // or return a default value
    }
  });
});*/
