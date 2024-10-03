import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/screens/login/login.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
void main() => runApp (const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});


  //• This widget-is-the-root of your application.
  @override
  Widget build(BuildContext context){
  return MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: OurTheme().buildTheme(),
    home: const OurLogin(),
    routes: {
      '/loginPage':(context)=> const OurLogin(),
      '/homeNewPage':(context)=> const OurHomeNewUser(),
    },
    
  );
}
}


