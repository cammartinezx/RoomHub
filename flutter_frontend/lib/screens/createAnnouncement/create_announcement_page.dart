import "package:flutter/material.dart";
import "package:flutter_frontend/screens/createAnnouncement/ChipSelection.dart";
import 'package:flutter_frontend/utils/our_theme.dart';
import "../header.dart";

class CreateAnnouncement extends StatefulWidget {
  const CreateAnnouncement({super.key});

  @override
  State<CreateAnnouncement> createState() => _CreateAnnouncementState();
}

class _CreateAnnouncementState extends State<CreateAnnouncement> {
  final List<String> announcements = [
    "I forgot my keys—can someone let me in?",
    "Having friends over tonight, just a heads up",
    "Going to be late, don't stay up",
    "The Wi-Fi’s down—anyone else having issues?",
    "I have a package arriving today, could someone grab it?",
    "Keep it down. Music is too Loud"
  ];
  late List<bool> isSelected = List.filled(announcements.length, false);
  late int activeAnnouncement ;
  bool disableChips = false;
  TextEditingController _textController = TextEditingController();


  @override
  void initState() {
    super.initState();
    // Add listener to the TextField controller
    _textController.addListener(() {
      setState(() {
        disableChips = _textController.text.isNotEmpty;
      });
    });
  }

  // handle chip selection
  void handleChipSelected(int index){
    // update the index of the active announcement.
    activeAnnouncement = index;
    setState(() {
      for(int i =0; i< isSelected.length; i++){
        isSelected[i] = (i == index);
      }
    });
  }
  @override
  Widget build(BuildContext context) {
    final theme = OurTheme();
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            const Header(),
            Text("Create Announcement",
              style: TextStyle(
                color: theme.darkblue,
                fontSize: 30.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: ChipSelection(disableChips: this.disableChips, onChipSelected: this.handleChipSelected, isSelected: this.isSelected, announcements: this.announcements)
            ),
            const SizedBox(height: 10.0),
            Container(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Make your own announcement",
                      style: TextStyle(
                        color: theme.darkblue,
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,)
                  ),
                ]
              ),
            ),
            const SizedBox(
              height: 30.0,
            ),
            Padding(
              padding: const EdgeInsets.all(5.0),
              child: TextField(
                  controller: _textController,
                  cursorColor: Theme.of(context).primaryColorDark,
                  decoration: InputDecoration(
                      label: Text(
                        "Your Announcement",
                        style: TextStyle(color: theme.darkgrey),
                      )
                  )
              ),
            ),
            const SizedBox(
              height: 30.0,
            ),
           OutlinedButton(onPressed: () {debugPrint("Yolo");}, child:Text("Create Announcement")),
            const SizedBox(
              height: 100.0,
            ),
          ],
        ),
      ),
    );
  }
}


// I forgot my keys—can someone let me in?"
// "I'm having friends over tonight, just a heads-up."
// "I’ll be late coming home, don’t wait up!"
// "The Wi-Fi’s down—anyone else having issues?"
// "Left the stove on—could someone check?"
// "Package is arriving today, could someone grab it?"
// "Cleaning day tomorrow—let's remember to tidy up!"