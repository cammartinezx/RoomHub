/*import 'package:flutter/material.dart';

class Homenewuser extends StatelessWidget {
  const Homenewuser({super.key});

  @override
  Widget build(BuildContext context){
    return Scaffold(   
        body: Container(
        decoration: const BoxDecoration (
          gradient: LinearGradient(
          colors: [ Color.fromARGB(255, 29, 52, 83), ],
          begin: FractionalOffset(0.0, 0.4), 
          end: Alignment. topRight,
        )
        )
    )
    );
  }
}*/
import 'package:flutter/material.dart';
import 'package:flutter_frontend/widgets/button.dart';
import 'package:flutter_frontend/widgets/our_container.dart';

class OurHomeNewUser extends StatelessWidget {
  const OurHomeNewUser({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey[300],
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: Icon(Icons.menu, color: Theme.of(context).primaryColorDark),
          title: Text('RoomHub', style: TextStyle(color: Theme.of(context).primaryColorDark, fontSize: 25.0, fontWeight: FontWeight.bold)),
          ),
        body:Column(
          children:
          <Widget>[
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20.0),
              children: 
              <Widget>[
  //CREATE ROOM CONTAINER
                OurContainer(
                  child: Row( 
                    children: [
                      Expanded(
                        flex: 6,
                        child:Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children:[
                            const Text ("Create a Room",style: TextStyle( color: Color.fromARGB(255, 29, 52, 83),fontSize: 23.0,fontWeight: FontWeight.bold)),
                            const Text('If is your first time in the app', softWrap: true),
                            const SizedBox(height: 10),
                            MyButton(text: "Continue", onTap: (){ Navigator.pushNamed(context, '/loginPage');} )
                          ]
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset('assets/bed.png'),//,width: 150.0, height: 150.0)
                      )
                    ],),
                ),
                const SizedBox(height: 10),

//JOIN ROOM 
              OurContainer(
                  child: Row( 
                    children: [
                      Expanded(
                        flex: 6,
                        child:Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children:[
                            const Text ("Join a Room",style: TextStyle( color: Color.fromARGB(255, 29, 52, 83),fontSize: 23.0,fontWeight: FontWeight.bold)),
                            const Text('If the room has already been created by your roommates', softWrap: true),
                            const SizedBox(height: 10),
                            MyButton(text: "Continue", onTap: (){ Navigator.pushNamed(context, '/loginPage');} )
                          ]
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset('assets/find_room.png'),//,width: 150.0, height: 150.0)
                      )
                    ],),
                ),
                const SizedBox(height: 10),
//FIND ROOMMATES

                OurContainer(
                  child: Row( 
                    children: [
                      Expanded(
                        flex: 6,
                        child:Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children:[
                            const Text ("Find Roommates",style: TextStyle( color: Color.fromARGB(255, 29, 52, 83),fontSize: 23.0,fontWeight: FontWeight.bold)),
                            const Text('If you are looking for your perfect match', softWrap: true),
                            const SizedBox(height: 10),
                            MyButton(text: "Continue", onTap: (){ Navigator.pushNamed(context, '/loginPage');} )
                          ]
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset('assets/find_roommate.png'),//,width: 150.0, height: 150.0)
                      )
                    ],),
                ),
                const SizedBox(height: 10),
              ],
            ),
          )],
      

        ),
        );
  }
}
