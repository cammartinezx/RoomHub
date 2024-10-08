import 'package:flutter/material.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';


class CreateRoomForm extends StatefulWidget {
  const CreateRoomForm({super.key});
  @override
  _CreateRoomFormState createState() => _CreateRoomFormState();
}

class _CreateRoomFormState extends State<CreateRoomForm> {
    final theme = OurTheme();
  TextEditingController nameController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(//thanks for watching
          children: [
            Container(
              height: double.infinity,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [
                  theme.mintgreen,
                  theme.darkblue,
                ]),
              ),
              child: const Padding(
                padding: EdgeInsets.only(top: 70.0, left: 22),
                child: Text(
                  'Create New\nRoom',
                  style: TextStyle(
                      fontSize: 30,
                      color: Colors.white,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 200.0),
              child: Container(
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(40), topRight: Radius.circular(40)),
                  color: Colors.white,
                ),
                height: double.infinity,
                width: double.infinity,
                child:  Padding(
                  padding: const EdgeInsets.only(left: 18.0,right: 18),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [ Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                            Text( '1 ', // Number 1
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 60,
                                color: theme.mintgreen, // Green color for the number
                              ),
                            ),
                            Text('\nAssign a name to your room\n\n', softWrap: true,// Instruction text
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                                color: theme.darkblue, // Blue color for the text
                              ),
                            ),
                        ]
                      ),
                    

                          SizedBox(width: 50),

                          Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                            Text( '2 ', // Number 1
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 60,
                                color: theme.mintgreen, // Green color for the number
                              ),
                            ),
                            Text('\nTell your roommates to join\n\n', softWrap: true, // Instruction text
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                                color: theme.darkblue, // Blue color for the text
                              ),
                            ),
                        ]
                      ),
                        
                         

                          SizedBox(width: 50), // Space between instructions

                          // Third instruction
                           Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                            Text( '3 ', // Number 1
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 60,
                                color: theme.mintgreen, // Green color for the number
                              ),
                            ),
                            Text('\nAccept their request', softWrap: true,// Instruction text
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                                color: theme.darkblue, // Blue color for the text
                              ),
                            ),
                        ]
                      ),
                         
                                
                      const SizedBox(height: 30),
                       
                      
                      TextField(
                        controller: nameController,
                        cursorColor: theme.darkblue,
                        decoration:  InputDecoration(
                            prefixIcon: const Icon(Icons.house_outlined ,color: Colors.grey,),
                            label: Text(' Name',style: TextStyle(
                              color: theme.darkblue
                            ),)
                        ),
                      ),
                      const SizedBox(height: 50,),
                      GradientButton(
                      text: 'Create Room',
                      onTap: () {
                        theme.buildToastMessage("Room succesfully created");
                        Future.delayed(const Duration(seconds: 1), () {
                          Navigator.pushNamed(context, '/homeNewPage');
                        });}
                        ),
                      
                      const SizedBox(height: 50,),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ));
  }
}