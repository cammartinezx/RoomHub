import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/createRoom/create_room.dart';
import 'package:flutter_frontend/screens/joinRoom/join_room.dart';
import 'package:flutter_frontend/screens/home/home.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/screens/login/login.dart';
import 'package:flutter_frontend/utils/our_theme.dart';

// Amplify imports
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'amplifyconfiguration.dart';
import 'package:flutter_frontend/providers.dart';

void main() {
  // Entry point of the application, launching the MyApp widget
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with TickerProviderStateMixin{
  
  bool _amplifyConfigured = false;
  @override
  void initState() {
    super.initState();
    // Configure Amplify when the app initializes
    _configureAmplify();
  }

  /// Configures the Amplify libraries and adds the necessary plugins.
  Future<void> _configureAmplify() async {
    try {
      // Create an instance of the Cognito Auth plugin
      final auth = AmplifyAuthCognito();
      // Add the Auth plugin to Amplify
      await Amplify.addPlugin(auth);
      // Call Amplify.configure to use the initialized categories in your app
      await Amplify.configure(amplifyconfig);
      setState(() {
        _amplifyConfigured = true;
      });
    } on Exception catch (e) {
      // Print an error message if Amplify configuration fails
      safePrint('An error occurred configuring Amplify: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: OurTheme().buildTheme(),
      home: const JoinRoom(),
      routes: {
        '/loginPage': (context) => const OurLogin(),
        '/homeNewPage': (context) => const OurHomeNewUser(),
      },
    );
  }
}

  // This widget is the root of your application.

  /*
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Hides the debug banner
      theme: OurTheme().buildTheme(), // Sets the app's theme
      home: _amplifyConfigured
          ? Consumer(builder: (context, ref, child) {
              final currentUser = ref.watch(authUserProvider);
              return currentUser.when(
                data: (userId) {
                  if (userId == null) {
                    return const OurLogin(); // Show login page if no user is logged in
                  }
                  return const OurHome(
                      roomID:
                          "Onyx Baddies"); // Show home page if user is logged in
                },
                loading: () {
                  // You can either return a loading indicator or a placeholder here
                  return const Center(
                      child: CircularProgressIndicator()); // Loading state
                },
                error: (e, st) {
                  return const OurLogin(); // Show login page on error
                },
              );
            })
          : const Center(
              child:
                  CircularProgressIndicator()), // Show a loading indicator while checking configuration
      routes: {
        '/loginPage': (context) =>
            const OurLogin(), // Defines the route for the login page
        '/homeNewPage': (context) =>
            const OurHomeNewUser(), // Defines the route for the home page
      },
    );
  }
}*/
