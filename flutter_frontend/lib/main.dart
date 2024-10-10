import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/header.dart';
import 'package:flutter_frontend/screens/notifications.dart';
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
import 'package:flutter_frontend/aws_auth.dart';

import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';
import 'dart:convert';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/response_handler.dart';

void main() {
  // Entry point of the application, launching the MyApp widget
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerStatefulWidget {
  const MyApp({super.key});

  @override
  ConsumerState<MyApp> createState() => _MyAppState();
}

class _MyAppState extends ConsumerState<MyApp> with TickerProviderStateMixin {
  bool _amplifyConfigured = false;
  final theme = OurTheme();
  String? userEmail;
  late String eemail;
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
  Widget build(BuildContext) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Hides the debug banner
      theme: OurTheme().buildTheme(),
      // Sets the app's theme
      home: _amplifyConfigured
          ? Consumer(builder: (context, ref, child) {
              final currentUser = ref.watch(authUserProvider);
              return currentUser.when(
                data: (userId) {
                  if (userId == null) {
                    return const OurLogin(); // Show login page if no user is logged in
                  } else {
                    return FutureBuilder<Widget>(
                      future:
                          redirectHome(), // Call redirectHome with non-null userEmail
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          // Loading state
                          return const Center(
                              child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          // Handle error state
                          return const OurHomeNewUser(); // Show an error page
                        } else {
                          // Successfully fetched the room name, return the widget
                          return snapshot.data ??
                              const OurHomeNewUser(); // Fallback if data is null
                        }
                      },
                    ); // Show home page if user is logged in
                  }
                },
                loading: () {
                  // You can either return a loading indicator or a placeholder here
                  return const Center(
                      child: CircularProgressIndicator()); // Loading state
                },
                error: (e, st) {
                  return const OurHomeNewUser(); // Show login page on error
                },
              );
            })
          : const Center(
              child:
                  CircularProgressIndicator()), // Show a loading indicator while checking configuration
      routes: {
        '/loginPage': (context) =>
            const OurLogin(), // Defines the route for the login page
        //'/homeNewPage': (context) =>const OurHomeNewUser(), // Defines the route for the home page
      },
    );
  }

  Future<Widget> redirectHome() async {
    try {
      userEmail = await getEmail();

      // Send a POST request to the backend to get the user's room information
      var response = await http.get(
        Uri.parse(
            "${url}user/$userEmail/get-room"), // Make sure 'url' is defined correctly
        headers: {"Content-Type": "application/json"},
      );
      //print("${url}user/$user/get-room");
      // Await the response and get the room name
      print("${url}user/$userEmail/get-room");

      String roomName =
          await getResponse(response, responseType: 'getUserRoom');

      // Display a toast message with the room name
      // Based on the roomName, return the appropriate widget
      if (roomName == "NA") {
        return const OurHomeNewUser();
      } else {
        return OurHome(roomID: roomName);
      }
    } on UserException catch (e) {}
    return OurLogin(); // Fallback in case of error
  }

  Future<String?> getEmail() async {
    final authAWSRepo = ref.read(authAWSRepositoryProvider);
    userEmail = await authAWSRepo.getUserEmail(ref);
    print(userEmail);
    return userEmail;
  }
}


  

/*
   @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: OurTheme().buildTheme(),
      home: OurHome(roomID: "OO"),
      routes: {
        '/loginPage': (context) => const OurLogin(),
        //'/homeNewPage': (context) => const OurHomeNewUser(),
      },
    );
  }

  // This widget is the root of your application.
 /* Widget build(BuildContext context) {
  return MaterialApp(
    debugShowCheckedModeBanner: false, // Hides the debug banner
    theme: OurTheme().buildTheme(), // Sets the app's theme
    home: _amplifyConfigured
        ? (userEmail == '') // Check if userEmail is null or empty
            ? const OurLogin() // Show login page if no user is logged in
            : FutureBuilder<Widget>(
                future: redirectHome(userEmail!), // Call redirectHome with non-null userEmail
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    // Loading state
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    // Handle error state
                    return const CreateRoom(); // Show an error page
                  } else {
                    // Successfully fetched the room name, return the widget
                    return snapshot.data ??
                        const OurHomeNewUser(); // Fallback if data is null
                  }
                },
              )
        : const Center(
            child: CircularProgressIndicator()), // Show a loading indicator while configuring Amplify
    routes: {
      '/loginPage': (context) => const OurLogin(), // Defines the route for the login page
      '/homeNewPage': (context) => const OurHomeNewUser(), // Defines the route for the home page
    },
  );
}

Future<Widget> redirectHome(String user) async {
  try{
      // Prepare the request body
      var regBody = {"id": user};
      // Send a POST request to the backend to get the user's room information
      var response = await http.post(
        Uri.parse("${url}user/$user/get-room"), // Make sure 'url' is defined correctly
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(regBody),
      );
      // Await the response and get the room name
      String roomName = await getResponse(response, responseType: 'getUserRoom');
      // Display a toast message with the room name
      theme.buildToastMessage(roomName);
      // Based on the roomName, return the appropriate widget
      if (roomName == "NA") {
        return const OurHomeNewUser();
      } else {
        return OurHome(roomID: roomName);
      }
  } on UserException catch (e) {
      // Handle any exceptions and display an error message
      theme.buildToastMessage(e.message);
  }
  return const OurLogin(); // Fallback in case of error
  }
}*/



 
}*/
