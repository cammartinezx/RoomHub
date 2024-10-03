
import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/widgets/our_container.dart';

class SignUpForm extends StatelessWidget {
  const SignUpForm({super.key});
  @override
  Widget build(BuildContext context) {
    return OurContainer( 
      child: Column(
        children: <Widget>[
          const Padding( 
            padding: EdgeInsets. symmetric(vertical: 20.0, horizontal: 8.0),
            child: Text ("Sign Up", 
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
              prefixIcon: Icon(Icons.person_outline),
              hintText: "Full Name",
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

          TextFormField(
            cursorColor: Theme.of(context).primaryColorDark,
            decoration:  const InputDecoration(
              prefixIcon: Icon(Icons.lock_outline),
              hintText: "Confirm Password",
            ),
            obscureText: true,
          ),
           
          const SizedBox(
            height: 30.0,
          ),
        
        ElevatedButton(
          child: 
          const Text("Sign Up", style: TextStyle(
              color: Colors.white, 
              fontWeight: FontWeight.bold,
              fontSize: 20.0),),
          /*
              _loginUser(
                  type: LoginType.email,
                  email: _emailController.text,
                  password: _passwordController.text,
                  context: context);*/
          onPressed: () {
            Navigator.of(context).push(
            MaterialPageRoute(
            builder: (context) => const OurHomeNewUser()
                  ),
                );
              },
        ),
        const SizedBox(
            height: 25.0,
          ),
        ],
      ), 
    );
    
  }
}