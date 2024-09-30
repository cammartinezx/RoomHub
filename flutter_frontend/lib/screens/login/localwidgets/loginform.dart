import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/signup/signup.dart';
import 'package:flutter_frontend/widgets/our_container.dart';

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
          child: 
          const Text("Log In", style: TextStyle(
              color: Colors.white, 
              fontWeight: FontWeight.bold,
              fontSize: 20.0),),
          onPressed: () {/*
              _loginUser(
                  type: LoginType.email,
                  email: _emailController.text,
                  password: _passwordController.text,
                  context: context);*/
            },
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
}