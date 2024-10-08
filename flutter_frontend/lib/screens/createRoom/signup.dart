import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/signup/signup_form.dart';


class OurSignUp extends StatelessWidget {
  const OurSignUp ({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20.0),
              children: 
             const <Widget>[
                Row(
                  mainAxisAlignment:MainAxisAlignment.start,
                  children:  [
                  Padding(
                    padding: EdgeInsets.only(top: 40.0, left: 10.0), // Adjust padding values here
                    child: BackButton(),
                  ),
                ],
                ),
                SignUpForm()
              ],
            ),
          )
        ],
      ),
    );
  }
}


/*import 'package:flutter/material.dart';
import 'package:flutter_frontend/config.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/screens/signup/localwidgets/signupform.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;



class OurSignUp extends StatefulWidget {
  const OurSignUp({super.key});

  @override
  _SignUpState createState() => _SignUpState();
}


class _SignUpState extends State<OurSignUp> {

  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  // ignore: unused_field
  bool _isNotValidate = false;


  void registerUser() async{
    if(emailController.text.isNotEmpty && passwordController.text.isNotEmpty){
      var regBody = {
        "email":emailController.text,
        "password":passwordController.text
      };
      var response = await http.post(Uri.parse(signup),
      headers: {"Content-Type":"application/json"},
      body: jsonEncode(regBody)
      );

      var jsonResponse = jsonDecode(response.body);

      //print(jsonResponse['status']);

      if(jsonResponse['status']){
        Navigator.push(context, MaterialPageRoute(builder: (context)=>const OurHomeNewUser()));
      }
    }else{
      setState(() {
        _isNotValidate = true;
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20.0),
              children: 
             const <Widget>[
                Row(
                  mainAxisAlignment:MainAxisAlignment.start,
                  children:  [
                  Padding(
                    padding: EdgeInsets.only(top: 40.0, left: 10.0), // Adjust padding values here
                    child: BackButton(),
                  ),
                ],
                ),
                SignUpForm()
              ],
            ),
          )
        ],
      ),
    );
  }
}*/

