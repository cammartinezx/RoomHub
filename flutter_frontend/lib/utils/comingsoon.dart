import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
// ignore: unused_import
import 'package:lottie/lottie.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';

class ComingSoonPage extends StatelessWidget {
  const ComingSoonPage({super.key});
  get splash => null;

  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
        splash: const Column(
          children: [
            Center(
              child:  Text("COMING SOON" , selectionColor: Colors.white,),
            )
          ],
        ),
        nextScreen: const OurHomeNewUser(),
        splashIconSize: 400,
        backgroundColor: const Color.fromARGB(255, 22, 31, 42));
  }
}
