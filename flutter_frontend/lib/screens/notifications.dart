import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/header.dart';
import 'package:flutter_frontend/widgets/action_notification.dart';

class Notifications extends StatelessWidget {
  final List<NotificationItem> notificationItems; 
  const Notifications({
    Key? key,
    required this.notificationItems, // Marking the list as required
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Stack(
          children: [
            SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 60), // Space for the back button
                    Text(
                      "New",
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 10),
                    // List of new notifications
                    
                    NotificationList(items: notificationItems),
                    
                  ],
                ),
              ),
            ),
            Positioned(
              top: 10,
              left: 10,
              child: BackButton(
                onPressed: () {
                  Navigator.of(context).pop(); // Go back to the previous screen
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
 
}

class NotificationList extends StatelessWidget {
  final List<NotificationItem> items;

  const NotificationList({Key? key, required this.items}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: items.length,
      itemBuilder: (context, index) {
        return ActionNotification(message: items[index].msg, id: items[index].notificationid );
      },
    );
  }
   void printNotificationList(List<NotificationItem> notifications) {
    for (var notification in notifications) {
      print(notification); // This will call the toString method
    }
  }
}
