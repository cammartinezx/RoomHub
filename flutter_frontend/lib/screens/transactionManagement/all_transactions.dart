import 'package:flutter/material.dart';
import 'package:flutter_frontend/utils/our_theme.dart';

class SharedExpensesPage extends StatefulWidget {
  @override
  _SharedExpensesPageState createState() => _SharedExpensesPageState();
}

class _SharedExpensesPageState extends State<SharedExpensesPage> {
  // Sample transaction data
  final List<Map<String, String>> transactions = [
    {'dateMonth': 'Aug', 'dateDay': '29', 'description': 'Groceries', 'amount': '\$40'},
    {'dateMonth': 'Sep', 'dateDay': '03', 'description': 'Utilities', 'amount': '\$75'},
    {'dateMonth': 'Sep', 'dateDay': '12', 'description': 'Internet Bill', 'amount': '\$30'},
    {'dateMonth': 'Aug', 'dateDay': '29', 'description': 'Groceries', 'amount': '\$40'},
    {'dateMonth': 'Sep', 'dateDay': '03', 'description': 'Utilities', 'amount': '\$75'},
    {'dateMonth': 'Sep', 'dateDay': '12', 'description': 'Internet Bill', 'amount': '\$30'},
    {'dateMonth': 'Aug', 'dateDay': '29', 'description': 'Groceries', 'amount': '\$40'},
    {'dateMonth': 'Sep', 'dateDay': '03', 'description': 'Utilities', 'amount': '\$75'},
    {'dateMonth': 'Sep', 'dateDay': '12', 'description': 'Internet Bill', 'amount': '\$30'},
    {'dateMonth': 'Aug', 'dateDay': '29', 'description': 'Groceries', 'amount': '\$40'},
    {'dateMonth': 'Sep', 'dateDay': '03', 'description': 'Utilities', 'amount': '\$75'},
    {'dateMonth': 'Sep', 'dateDay': '12', 'description': 'Internet Bill', 'amount': '\$30'}
    // Add more transactions as needed
  ];

  // List of dynamic text boxes for the summary section
  final List<String> summaryMessages = [
    "Bobby owes you \$20",
    "Bobby owes you \$20",
    "You owes Bobby \$20",
    // Add more summary messages as needed
  ];

  final theme = OurTheme();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Back button to return to the previous screen
          Padding(
            padding: const EdgeInsets.only(left:16.0,right:0.0 ,top: 70.0, bottom: 0.0),
            child: Stack(
              children: [
                IconButton(
                  icon: Icon(
                    Icons.arrow_back,
                    color: theme.darkblue,
                    size: 30,
                  ),
                  onPressed: () {
                    Navigator.of(context).pop(); // Pop the current screen
                  },
                ),
                Center(
                  child: Text(
                    "The Bois",
                    style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold, color: theme.darkblue),
                  ),
                )
              ]
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left:16.0,right:16.0 ,top: 10.0, bottom: 2.0),
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: LinearGradient(colors: [
                  theme.mintgreen, // Gradient starting color
                  theme.darkblue,  // Gradient ending color
                ]),
              ),
              child: Padding(
                padding: EdgeInsets.only(left :10.0, top: 15.0, bottom: 15.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      // crossAxisAligment: CrossAxisAlignment.
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Column(
                          children: [
                            Text(
                              "\$100", // e.g., "29"
                              style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            Text(
                              "You owe", // e.g., "Aug"
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ],
                        ),
                        SizedBox(width: 50),
                        Column(
                          children: [
                            Text(
                              "\$5000", // e.g., "29"
                              style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            Text(
                              "You are owed", // e.g., "Aug"
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    // Generate a Text widget for each summary message
                    ...summaryMessages.map((message) => Padding(
                      padding: const EdgeInsets.only(bottom: 2.0),
                      child: Center(
                        child: Text(
                          message,
                          style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                    )
                  ),
                    const SizedBox(height: 15),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          ElevatedButton(onPressed: () {debugPrint("Settle up clicked");},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.darkblue,
                              // fixedSize: const Size(100, 30), // Minimum width and height
                              padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 2.0), // Padding
                            ), child: const Text("Settle Up",
                              style: TextStyle(color: Colors.white, fontSize: 15),
                            ),
                          ),
                          SizedBox(width: 20,),
                          ElevatedButton(onPressed: () {debugPrint("Settle up clicked");},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.darkblue,
                              // fixedSize: const Size(100, 30), // Minimum width and height
                              padding: const EdgeInsets.symmetric(horizontal: 10.0), // Padding
                            ), child: const Text("Add Expense",
                              style: TextStyle(color: Colors.white, fontSize: 15),
                            ),
                          ),
                        ]
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Row(
          //   mainAxisAlignment: MainAxisAlignment.center,
          //     crossAxisAlignment: CrossAxisAlignment.center,
          //     children: [
          //       ElevatedButton(onPressed: () {debugPrint("Settle up clicked");},
          //         style: ElevatedButton.styleFrom(
          //           backgroundColor: theme.darkblue,
          //           // fixedSize: const Size(100, 30), // Minimum width and height
          //           padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 2.0), // Padding
          //         ), child: const Text("Settle Up",
          //           style: TextStyle(color: Colors.white, fontSize: 15),
          //         ),
          //       ),
          //       SizedBox(width: 20,),
          //       ElevatedButton(onPressed: () {debugPrint("Settle up clicked");},
          //         style: ElevatedButton.styleFrom(
          //           backgroundColor: theme.darkblue,
          //           // fixedSize: const Size(100, 30), // Minimum width and height
          //           padding: const EdgeInsets.symmetric(horizontal: 10.0), // Padding
          //         ), child: const Text("Add",
          //           style: TextStyle(color: Colors.white, fontSize: 15),
          //         ),
          //       ),
          //     ]
          // ),
          // Title Text Box
          const Padding(
            padding: EdgeInsets.only(top:5.0, right: 5.0, left: 5.0),
            child: Center(
              child: Text(
              'All Transactions',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                            ),
            ),
          ),
          // Transactions List
          Expanded(
            child: ListView.builder(
              itemCount: transactions.length,
              itemBuilder: (context, index) {
                final transaction = transactions[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2.0, vertical: 2.0),
                  child: Card(
                    elevation: 1,
                    child: Padding(
                      padding: const EdgeInsets.all(7.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Date Display (Month and Day)
                          Column(
                            children: [
                              Text(
                                transaction['dateMonth']!, // e.g., "Aug"
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                transaction['dateDay']!, // e.g., "29"
                                style: TextStyle(fontSize: 14),
                              ),
                            ],
                          ),
                          // Transaction Details
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                transaction['description']!, // e.g., "Groceries"
                                style: TextStyle(fontSize: 16),
                              ),
                              Text(
                                "Amount: ${transaction['amount']!}",
                                style: TextStyle(fontSize: 14, color: Colors.grey),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                transaction['description']!, // e.g., "Groceries"
                                style: TextStyle(fontSize: 16),
                              ),
                              Text(
                                "Amount: ${transaction['amount']!}",
                                style: TextStyle(fontSize: 14, color: Colors.grey),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
