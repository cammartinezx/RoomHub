import 'package:flutter/material.dart';

class OurTheme {
  final Color _yellow = const Color.fromARGB(255, 253, 193, 87);
  final Color _mintgreen = const Color.fromARGB(255, 139, 191, 187);
  final Color _darkblue = const Color.fromARGB(255, 29, 52, 83);
  final Color _lightgrey = const Color.fromARGB(255, 213, 213, 206);
  final Color _darkgrey = const Color.fromARGB(255, 89, 89, 94);

  ThemeData buildTheme() {
    return ThemeData(
      canvasColor: _lightgrey,
      primaryColor: _mintgreen,
      primaryColorDark: _darkblue,
      primaryColorLight: _yellow,
      secondaryHeaderColor: _darkgrey,
      hintColor: _lightgrey,
      inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10.0),
              borderSide: BorderSide(color: _lightgrey, width: 1.0)),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: _darkblue, width: 2.0),
          )),


      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.all(_darkblue),
          padding: WidgetStateProperty.all(
              const EdgeInsets.symmetric(horizontal: 100.0, vertical: 12.0)),
          shape: WidgetStateProperty.all(
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0))),
        ),
      ),


      buttonTheme: ButtonThemeData(
        buttonColor: _darkblue,
        padding: const EdgeInsets.symmetric(horizontal: 100.0, vertical: 12.0),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      )
    );
  }
}
