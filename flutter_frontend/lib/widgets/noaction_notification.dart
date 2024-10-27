import 'package:flutter/material.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:flutter_frontend/providers.dart';


class NoActionNotification extends ConsumerStatefulWidget {
  final String message;
  final String id;

  const NoActionNotification(
      {super.key,
        required this.message,
        required this.id,
      });

  @override
  ConsumerState<NoActionNotification> createState() => _ActionNotificationState();
}

class _ActionNotificationState extends ConsumerState<NoActionNotification> {
  final theme = OurTheme();
  late String userEmail;

  @override
  void initState() {
    super.initState();
    // Store the email in initState
  }

  @override
  Widget build(BuildContext context) {
    userEmail = ref.read(emailProvider);
    return Container(
        padding: const EdgeInsets.only(bottom: 10.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              flex: 5,
              child: SizedBox(
                height: 70,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: <Widget>[
                        Expanded(
                            child: Wrap(
                              spacing: 8.0, // Space between the widgets horizontally
                              runSpacing: 4.0, // Space between the widgets vertically
                              children: [Text(
                                widget.message,
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontSize: 18,
                                ),
                              ),]
                            ),
                        ),
                        const Padding(
                          padding: EdgeInsets.only(right: 10),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {debugPrint("delete pressed");},
                        ),
                      ],
                    ),
                    Divider(
                      color: theme.lightgrey, // Color of the divider
                      thickness: 2, // Thickness of the line
                    ),
                  ],
                ),
              ),
            ),
          ],
        ));
  }
}
