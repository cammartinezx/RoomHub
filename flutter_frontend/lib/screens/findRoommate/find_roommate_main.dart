import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/providers.dart';
import 'package:flutter_frontend/screens/home/user_home.dart';
import 'package:flutter_frontend/screens/userProfile/profile.dart';
import 'package:flutter_frontend/config.dart';
import 'package:flutter_frontend/widgets/profile_card.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FindRoommateMain extends ConsumerStatefulWidget {
  const FindRoommateMain({super.key});

  @override
  _FindRoommateMainState createState() => _FindRoommateMainState();
}

class _FindRoommateMainState extends ConsumerState<FindRoommateMain> {
  final List<List<Color>> gradients = [
    [const Color(0xFFFFD700), const Color(0xFFFFB6C1)], // Yellow to Pink
    [const Color(0xFF0D47A1), const Color(0xFF80CBC4)], // Lavender to Sky Blue
    [const Color(0xFF98FF98), const Color(0xFFC8A2C8)], // Mint Green to Lilac
    [const Color(0xFF006064), const Color(0xFF00BCD4)], // Peach to Rose Pink
    [
      const Color(0xFF3F51B5),
      const Color.fromARGB(255, 140, 154, 243)
    ], // Seafoam Green to Aqua
    [
      const Color(0xFFDAA520),
      const Color(0xFFFF7F50)
    ], // Goldenrod to Pale Coral
    [const Color(0xFF40E0D0), const Color(0xFFFF69B4)], // Turquoise to Hot Pink
    [
      const Color(0xFFCCCCFF),
      const Color.fromARGB(255, 113, 16, 166)
    ], // Periwinkle to Lemon Yellow
    [
      const Color.fromARGB(255, 70, 160, 193),
      const Color.fromARGB(255, 253, 102, 117)
    ], // Pastel Blue to Soft Pink
    [
      const Color(0xFF00FF7F),
      const Color(0xFFD8BFD8)
    ], // Spring Green to Lilac Purple
    [
      const Color(0xFFFFA500),
      const Color.fromARGB(255, 91, 174, 174)
    ], // Bright Orange to Light Cyan
    [
      const Color(0xFFFF00FF),
      const Color(0xFFFFFF00)
    ], // Magenta to Bright Yellow
    [
      const Color.fromARGB(255, 35, 228, 238),
      const Color.fromARGB(255, 249, 103, 171)
    ], // Electric Blue to Lavender Pink
    [
      const Color(0xFFFF6347),
      const Color(0xFF20B2AA)
    ], // Tangerine to Soft Teal
    [
      const Color.fromARGB(255, 246, 134, 30),
      const Color.fromARGB(255, 239, 209, 13)
    ], // Powder Blue to Honeydew
    [const Color(0xFFFF7F50), const Color(0xFF4682B4)], // Coral to Sea Blue
    [
      const Color(0xFFFFC1CC),
      const Color(0xFF32CD32)
    ], // Candy Pink to Lime Green
    [const Color(0xFF7FFF00), const Color(0xFF8A2BE2)], // Chartreuse to Violet
    [
      const Color(0xFFFFA07A),
      const Color(0xFF00CCCC)
    ], // Soft Orange to Robin's Egg Blue
    [
      const Color.fromARGB(255, 216, 200, 57),
      const Color.fromARGB(255, 76, 147, 118)
    ], // Pastel Yellow to Minty Green
  ];
  List<Profile>? profiles;
  List<ProfileCard> cards = [];
  late String userId;
    final theme = OurTheme();
  @override
  void initState() {
    super.initState();
    _loadNewMatches();
  }

  Future<void> _loadNewMatches() async {
    userId = ref.read(emailProvider);

    profiles = await getNewMatches(userId);

    // Pre-assign a random gradient to each profile
    final random = Random();
    setState(() {
      cards = profiles!.map((profile) {
        final assignedColor = gradients[random.nextInt(gradients.length)];
        return ProfileCard(
          profile: profile,
          gradient: assignedColor, // Pass the assigned gradient
        );
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
  
    return Scaffold(
      backgroundColor: Colors.grey.shade300,
      body: Stack(
        children: [
          // Main content below the back button
          profiles == null
              ? const Center(
                  child: CircularProgressIndicator(), // Show a loader
                )
              : profiles!.isEmpty
                  ? const Center(
                      child: Text(
                        'No profiles for this location',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(height: 45),
                        Expanded(
                          child: CardSwiper(
                            onEnd:_showEnd ,
                            isLoop: false,
                            cardsCount: cards.length,
                            numberOfCardsDisplayed:
                                cards.length < 2 ? cards.length : 2,
                            allowedSwipeDirection: AllowedSwipeDirection.only(
                                left: true, right: true),
                            onSwipe:
                                (previousIndex, currentIndex, direction) async {
                              // Ensure that currentIndex is valid before using it
                                  print(currentIndex);
                              if (currentIndex != null &&
                                  currentIndex >= 0 &&
                                  currentIndex < cards.length) {
                                if (direction == CardSwiperDirection.right) {
                                  await checkMatch(
                                      userId, profiles![currentIndex-1].userId);
                            
                                }
                              }
                              return true;
                            },
                            cardBuilder: (context, index, percentThresholdX,
                                percentThresholdY) {
                              return cards[index]; // Ensure index is valid
                            },
                          ),
                        ),
                      ],
                    ),

          // Back button at the top-left corner
          Positioned(
            top: 50.0,
            left: 10.0,
            child: IconButton(
              iconSize: 30.0,
              icon: const Icon(Icons.arrow_back, color: Colors.black),
              onPressed: () {
                Navigator.pop(context); // Navigate back to the previous screen
              },
            ),
          ),
        ],
      ),
    );
  }
 
void _showEnd() {
  // Show a message when no more profiles are available
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        content: Text(
          'No more profiles for this location.',
          style: TextStyle(
            fontSize: 18, 
            fontWeight: FontWeight.bold, 
            color: Colors.indigo.shade900,
          ),
        ),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pushReplacement(
                              MaterialPageRoute(
                                builder: (context) =>
                                   UserHome(email: userId)
                              ),
                            );
            },
            child: const Text('OK'),
          ),
        ],
      );
    },
  );
}
  
  Future<List<Profile>> getNewMatches(String userId) async {
    List<Profile> result = [];
    try {
      var response = await http.get(
        Uri.parse("$user/$userId/$getMatchesPth"),
        headers: {"Content-Type": "application/json"},
      );
      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        print("$user/$userId/$getMatchesPth");
        print(jsonData);

        List<Profile> profiles = Profile.parseProfileList(jsonData);
        for (var profile in profiles) {
          print(profile); // This will call the toString method
        }
        result = profiles;
      } else {
        await getResponse(response, responseType: 'getNewMatches');
      }
    } on UserException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    } on Exception catch (e) {
      print(e.toString());
    }
    return result;
  }

  Future<bool> checkMatch(String userId, String likedId) async {
    print(userId);
    print(likedId);
    bool usersMatch = false;
    try {
      var reqBody = {
        "id": likedId,
      };
      var response = await http.post(
          Uri.parse("$profile/$userId/$checkMatchPth"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode(reqBody));
      print(response.statusCode);
      print(response.body);
      if (response.statusCode == 200) {
        usersMatch = true;
      } else {
        await getResponse(response, responseType: 'checkMatch');
      }
    } on UserException catch (e) {
      print(e.toString());
    }
    return usersMatch;
  }
}
