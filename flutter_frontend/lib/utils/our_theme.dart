import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class OurTheme {
  final Color yellow = const Color.fromARGB(255, 253, 193, 87);
  final Color mintgreen = const Color.fromARGB(255, 139, 191, 187);
  final Color darkblue = const Color.fromARGB(255, 29, 52, 83);
  final Color lightgrey = const Color.fromARGB(255, 213, 213, 206);
  final Color darkgrey = const Color.fromARGB(255, 89, 89, 94);

  ThemeData buildTheme() {
    return ThemeData(
        canvasColor: lightgrey,
        primaryColor: mintgreen,
        primaryColorDark: darkblue,
        primaryColorLight: yellow,
        secondaryHeaderColor: darkgrey,
        hintColor: lightgrey,
        inputDecorationTheme: InputDecorationTheme(
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
                borderSide: BorderSide(color: lightgrey, width: 1.0)),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: darkblue, width: 2.0),
            )),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            backgroundColor: WidgetStateProperty.all(darkblue),
            padding: WidgetStateProperty.all(
                const EdgeInsets.symmetric(horizontal: 100.0, vertical: 12.0)),
            shape: WidgetStateProperty.all(RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0))),
          ),
        ),
        buttonTheme: ButtonThemeData(
          buttonColor: darkblue,
          padding:
              const EdgeInsets.symmetric(horizontal: 100.0, vertical: 12.0),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
        ));
  }

  void buildToastMessage(String text) {
    Fluttertoast.showToast(
        msg: text,
        timeInSecForIosWeb: 2,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: darkgrey,
        textColor: Colors.white,
        fontSize: 14);
  }
}
