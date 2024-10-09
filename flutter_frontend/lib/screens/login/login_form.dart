import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/screens/home/home.dart';
import 'package:flutter_frontend/screens/signup/signup.dart';
import 'package:flutter_frontend/widgets/our_container.dart';
import 'package:flutter_frontend/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_frontend/aws_auth.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';

import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';
import 'dart:convert';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/response_handler.dart';

// ConsumerStatefulWidget is a widget that maintains state and works with Riverpod's providers
class OurLoginForm extends ConsumerStatefulWidget {
  const OurLoginForm({super.key});
  @override
  _LoginFormState createState() => _LoginFormState();
}

// State class for OurLoginForm, managing state and widget lifecycle
class _LoginFormState extends ConsumerState<OurLoginForm> {
  final theme = OurTheme();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(
    BuildContext context,
  ) {
    return OurContainer(
      child: Column(
        children: <Widget>[
          // Header for the login form
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 20.0, horizontal: 8.0),
            child: Text("Log In",
                style: TextStyle(
                  color: Color.fromARGB(
                      255, 29, 52, 83), //Theme.of(context).primaryColorDark,
                  fontSize: 25.0,
                  fontWeight: FontWeight.bold,
                )),
          ),
          // Text field for the email input
          TextFormField(
              controller: emailController,
              cursorColor: Theme.of(context).primaryColorDark,
              decoration: InputDecoration(
                  prefixIcon: Icon(Icons.alternate_email),
                  label: Text(
                    "Email",
                    style: TextStyle(color: theme.darkblue),
                  ))),

          const SizedBox(
            height: 30.0,
          ),
          // Text field for the password input
          TextFormField(
              controller: passwordController,
              obscureText: true,
              cursorColor: Theme.of(context).primaryColorDark,
              decoration: InputDecoration(
                  prefixIcon: Icon(Icons.lock_outline),
                  label: Text(
                    "Password",
                    style: TextStyle(color: theme.darkblue),
                  ))),
          const SizedBox(
            height: 30.0,
          ),
          // Login button to trigger sign-in operation
          ElevatedButton(
            onPressed: () async {
              if (await amplifyLogin()) {
                redirectHome();
              }
            },
            child: const Text(
              "Log In",
              style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20.0),
            ),
          ),
          const SizedBox(
            height: 25.0,
          ),

          ElevatedButton(
            onPressed: () async {
              logOut();
            },
            child: const Text(
              "Log Out",
              style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 8.0),
            ),
          ),
          const SizedBox(
            height: 10.0,
          ),

          // TextButton for navigating to the sign-up page
          TextButton(
              onPressed: () {
                // Navigate to the sign-up page when pressed
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const OurSignUp(),
                  ),
                );
              },
              style: const ButtonStyle(
                tapTargetSize:
                    MaterialTapTargetSize.shrinkWrap, // Correct usage
              ),
              child: RichText(
                text: TextSpan(
                  text: "Don't have an account?", // Normal text
                  style: TextStyle(
                    fontSize: 15.0,
                    color: Theme.of(context).primaryColor,
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text: 'Sign Up', // Bold part
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          decoration: TextDecoration.underline,
                          decorationColor: Theme.of(context).primaryColor),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Future<bool> amplifyLogin() async {
    bool loginSuccess = false;
    try {
      // Accessing AWS authentication repository using Riverpod provider
      final authAWSRepo = ref.read(authAWSRepositoryProvider);
      // Attempting to sign in with email and password
      await authAWSRepo.signIn(emailController.text, passwordController.text);
      // Refresh the auth user provider after signing in
      ref.refresh(authUserProvider);
      final email = emailController.text;
      ref.read(emailProvider.notifier).state = email;
      loginSuccess = true;
    } on AuthException catch (e) {
      print(e.toString());
      theme.buildToastMessage(e.message);
    }
    return loginSuccess;
  }

  void redirectHome() async {
    Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => OurHomeNewUser(),
          ),
        );
    try {
      var response = await http.get(
        Uri.parse(url+"user/" + emailController.text + "/get-room"),
        headers: {"Content-Type": "application/json"},
      );
      print(response.body);

      // Await the response from getResponse
      String roomName =
          await getResponse(response, responseType: 'getUserRoom');
      // After successful response, navigate to the next screen
      print(roomName);
      if (roomName == "NA") {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => OurHomeNewUser(),
          ),
        );
      } else {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => OurHome(roomID: roomName),
          ),
        );
      }
    } on UserException catch (e) {
      print(e.toString());
      theme
          .buildToastMessage(e.message); // Display error if an exception occurs
    }
  }

  void logOut() async {
    try {
      // Accessing AWS authentication repository using Riverpod provider
      final authAWSRepo = ref.read(authAWSRepositoryProvider);
      // Attempting to sign in with email and password
      await authAWSRepo.logOut(ref);
      // Refresh the auth user provider after signing in
      ref.refresh(authUserProvider);
    } on AuthException catch (e) {
      theme.buildToastMessage(e.message);
    }
  }
}



/*

  @override
  Widget build(BuildContext context) {
    return Consumer(
      builder: (context, ref, child) {
        // Use ref.read to access the provider
        final authAWSRepo = ref.read(authAWSRepositoryProvider);

        return Form(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: const InputDecoration(hintText: "Email"),
                controller: emailController,
              ),
              TextField(
                decoration: const InputDecoration(hintText: "Password"),
                controller: passwordController,
              ),
              ElevatedButton(
                onPressed: () async {
                  // Signing in using the authAWSRepo
                  await authAWSRepo.signIn(emailController.text, passwordController.text);
                  ref.refresh(authUserProvider); // Use ref.refresh to refresh the provider
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text("Login"),
                    SizedBox(
                      width: 0,
                    ),
                    Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Icon(Icons.arrow_forward),
                    ),
                  ],
                ),
              ),
              TextButton(
                onPressed: () async {
                  // Signing up using the authAWSRepo
                  await authAWSRepo.signUp(emailController.text, passwordController.text);
                  ref.refresh(authUserProvider); // Use ref.refresh to refresh the provider
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text("Sign Up"),
                  ],
                ),
              ),
              const SizedBox(
                height: 100,
              ),
              TextField(
                decoration: const InputDecoration(hintText: "Confirmation Code"),
                controller: confirmationCodeController,
              ),
              TextButton(
                onPressed: () async {
                  // Confirming sign-up using the authAWSRepo
                  await authAWSRepo.confirmSignUp(emailController.text, confirmationCodeController.text);
                  ref.refresh(authUserProvider); // Use ref.refresh to refresh the provider
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text("Confirm Sign Up"),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}*/
/*
class LoginForm extends StatefulWidget {
  const LoginForm();

  @override
  _LoginFormState createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmationCodeController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return  Consumer(
      builder: (context, ref, child){
        // Here, we use ref.read to access the provider
        final authAWSRepo = ref.read(authAWSRepositoryProvider);
     Form(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            decoration: const InputDecoration(hintText: "Email"),
            controller: emailController,
          ),
          TextField(
            decoration: const InputDecoration(hintText: "Password"),
            controller: passwordController,
          ),
          ElevatedButton(
            onPressed: () async {
              final authAWSRepo = ref.read(authAWSRepositoryProvider);
              await authAWSRepo.signIn(emailController.text, passwordController.text);
              ref.refresh(authUserProvider);
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text("Login"),
                SizedBox(
                  width: 30,
                ),
                Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Icon(Icons.arrow_forward),
                )
              ],
            ),
          ),
          TextButton(
            onPressed: () async {
              final authAWSRepo = ref.read(authAWSRepositoryProvider);

              await authAWSRepo.signUp(emailController.text, passwordController.text);
              ref.refresh(authUserProvider);
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text("Sign Up"),
              ],
            ),
          ),
          const SizedBox(
            height: 100,
          ),
          TextField(
            decoration: const InputDecoration(hintText: "Confirmation Code"),
            controller: confirmationCodeController,
          ),
          TextButton(
            onPressed: () async {
              final authAWSRepo = ref.read(authAWSRepositoryProvider);
              await authAWSRepo.confirmSignUp(emailController.text, confirmationCodeController.text);
              ref.refresh(authUserProvider);
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text("Confirm Sign Up"),
              ],
            ),
          ),
        ],
      ),
    );
      });
  }
}

*/


/*

class OurLoginForm extends StatelessWidget {
  const OurLoginForm({super.key});




 
  @override
  Widget build(BuildContext context) {
    return OurContainer( 
      child: Column(
        children: <Widget>[
          const Padding( 
            padding: EdgeInsets. symmetric(vertical: 20.0, horizontal: 8.0),
            child: Text ("Log In", 
              style: TextStyle(
                color: Color.fromARGB(255, 29, 52, 83),//Theme.of(context).primaryColorDark,
                fontSize: 25.0,
                fontWeight: FontWeight.bold,
              )
            ),
          ),
          TextFormField(
            cursorColor: Theme.of(context).primaryColorDark,
            decoration:  const InputDecoration(
              prefixIcon: Icon(Icons.alternate_email),
              hintText: "Email",
            ),
          ),
          const SizedBox(
            height: 30.0,
          ),
          TextFormField(
            cursorColor: Theme.of(context).primaryColorDark,
            decoration:  const InputDecoration(
              prefixIcon: Icon(Icons.lock_outline),
              hintText: "Password",
            ),
            obscureText: true,
          ),
          const SizedBox(
            height: 30.0,
          ),
        
        ElevatedButton(
            onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const OurHome(roomID: "348")
                  ),
                );
              },
          child: 
          const Text("Log In", style: TextStyle(
              color: Colors.white, 
              fontWeight: FontWeight.bold,
              fontSize: 20.0),),
          /*
              _loginUser(
                  type: LoginType.email,
                  email: _emailController.text,
                  password: _passwordController.text,
                  context: context);*/
            
        ),


        const SizedBox(
            height: 25.0,
          ),

        TextButton(
            onPressed: (){
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) =>const OurSignUp(),
                ),
              );
            },
            style: const ButtonStyle(
               tapTargetSize: MaterialTapTargetSize.shrinkWrap, // Correct usage
            ),
            child:  
            RichText( text: TextSpan( text: "Don't have an account?",  // Normal text
              style: TextStyle(
                fontSize: 15.0,  // Set font size
                color: Theme.of(context).primaryColor,),
              children: <TextSpan>[ TextSpan(
                text: 'Sign Up',  // Bold part
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline,
                    decorationColor: Theme.of(context).primaryColor),
              ),
              ],
            ),
          )
        ),
        ],
      ), 
    );
    
  }
}*/