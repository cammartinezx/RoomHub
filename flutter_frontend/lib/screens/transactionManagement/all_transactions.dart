import 'package:flutter/material.dart';
import 'package:flutter_frontend/utils/our_theme.dart';

class SharedExpensesPage extends StatefulWidget {
  @override
  _SharedExpensesPageState createState() => _SharedExpensesPageState();
}

class _SharedExpensesPageState extends State<SharedExpensesPage> {
  // Sample transaction data
  final List<Map<String, String>> transactions = [
    {
      'dateMonth': 'Aug',
      'dateDay': '29',
      'description': 'Groceries',
      'amount': '\$40'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '03',
      'description': 'Utilities',
      'amount': '\$75'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '12',
      'description': 'Internet Bill',
      'amount': '\$30'
    },
    {
      'dateMonth': 'Aug',
      'dateDay': '29',
      'description': 'Groceries',
      'amount': '\$40'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '03',
      'description': 'Utilities',
      'amount': '\$75'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '12',
      'description': 'Internet Bill',
      'amount': '\$30'
    },
    {
      'dateMonth': 'Aug',
      'dateDay': '29',
      'description': 'Groceries',
      'amount': '\$40'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '03',
      'description': 'Utilities',
      'amount': '\$75'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '12',
      'description': 'Internet Bill',
      'amount': '\$30'
    },
    {
      'dateMonth': 'Aug',
      'dateDay': '29',
      'description': 'Groceries',
      'amount': '\$40'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '03',
      'description': 'Utilities',
      'amount': '\$75'
    },
    {
      'dateMonth': 'Sep',
      'dateDay': '12',
      'description': 'Internet Bill',
      'amount': '\$30'
    }
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
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          // Back button to return to the previous screen
          Padding(
            padding: const EdgeInsets.only(
                left: 16.0, right: 0.0, top: 70, bottom: 0.0),
            child: Stack(children: [
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
                  style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.bold,
                      color: theme.darkblue),
                ),
              )
            ]),
          ),
          Padding(
            padding: const EdgeInsets.only(
                left: 16.0, right: 16.0, top: 10.0, bottom: 2.0),
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: LinearGradient(colors: [
                  theme.mintgreen, // Gradient starting color
                  theme.darkblue, // Gradient ending color
                ]),
              ),
              child: Padding(
                padding: EdgeInsets.only(left: 10.0, top: 15.0, bottom: 15.0),
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
                              style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white),
                            ),
                            Text(
                              "You owe", // e.g., "Aug"
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white),
                            ),
                          ],
                        ),
                        SizedBox(width: 50),
                        Column(
                          children: [
                            Text(
                              "\$5000", // e.g., "29"
                              style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white),
                            ),
                            Text(
                              "You are owed", // e.g., "Aug"
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white),
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
                              style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        )),
                    const SizedBox(height: 15),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              debugPrint("Settle up clicked");
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.darkblue,
                              // fixedSize: const Size(100, 30), // Minimum width and height
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10.0, vertical: 2.0), // Padding
                            ),
                            child: const Text(
                              "Settle Up",
                              style:
                                  TextStyle(color: Colors.white, fontSize: 15),
                            ),
                          ),
                          SizedBox(
                            width: 20,
                          ),
                          ElevatedButton(
                            onPressed: () {
                              debugPrint("Settle up clicked");
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.darkblue,
                              // fixedSize: const Size(100, 30), // Minimum width and height
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10.0), // Padding
                            ),
                            child: const Text(
                              "Add Expense",
                              style:
                                  TextStyle(color: Colors.white, fontSize: 15),
                            ),
                          ),
                        ]),
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
            padding:
                EdgeInsets.only(top: 5.0, right: 5.0, left: 5.0, bottom: 5),
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
              padding: EdgeInsets.zero, // Removes default padding
              itemCount: transactions.length,
              itemBuilder: (context, index) {
                final transaction = transactions[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 2.0, vertical: 2.0),
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
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.bold),
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
                                transaction[
                                    'description']!, // e.g., "Groceries"
                                style: TextStyle(fontSize: 16),
                              ),
                              Text(
                                "Amount: ${transaction['amount']!}",
                                style:
                                    TextStyle(fontSize: 14, color: Colors.grey),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                transaction[
                                    'description']!, // e.g., "Groceries"
                                style: TextStyle(fontSize: 16),
                              ),
                              Text(
                                "Amount: ${transaction['amount']!}",
                                style:
                                    TextStyle(fontSize: 14, color: Colors.grey),
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

  Future<List<Task>> getTransactions(bool isPendingTask, String userId) async {
    List<Task> result = [];
    try {
      var response = await http.get(
        isPendingTask
            ? Uri.parse("$getPendingTasks?frm=$userId")
            : Uri.parse("$getCompletedTasks?frm=$userId"),
        headers: {"Content-Type": "application/json"},
      );
      print(response.statusCode);
      print(response.body);
      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        List<Task> tasks = Task.parseTaskList(jsonData, isPendingTask);
        // for (var task in tasks) {
        //   print(task); // This will call the toString method
        // }
        result = tasks;
        if (isPendingTask == false) {
          print(result);
        }
      } else {
        await getResponse(response, responseType: 'getTasks');
      }
    } on UserException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    }
    if (isPendingTask == false) {
      print(result);
    }
    return result;
  }
}


        {
            "transaction_amount": 10,
            "transaction_name": "Toilet Cleaner",
            "creator": "daohl@myumanitoba.ca",
            "paid_by_creator": 3.33,
            "transaction_date": "2024-11-14",
            "owed_to_creator": 6.67,
            "type": "expense",
            "summary": "You paid CAD 3.33 and lent CAD 6.67 for Toilet Cleaner"
        },
        {
            "transaction_date": "2024-11-12",
            "transaction_amount": 2,
            "transaction_name": "dan@gmail.com paid daohl@myumanitoba.ca CAD2",
            "creator": "dan@gmail.com",
            "type": "settle-up"
        },
        {
            "transaction_date": "2024-11-12",
            "transaction_amount": 0.33,
            "transaction_name": "dan@gmail.com paid daohl@myumanitoba.ca CAD 0.33",
            "creator": "dan@gmail.com",
            "type": "settle-up"
        }
class Transaction {
  final String transactionFullDate;
  final String transactionName;
  final String transactionType;
  final double amountPaid;
  final double amountLent;

  Tranasaction(
      required this.transactionFullDate,
      required this.transactionName,
      required this.transactionType,
      this.amountPaid,
      this.amountLent,
      }
    );

  // Factory constructor to create a NotificationItem from JSON
  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      transactionFullDate: json['transaction_date'],
      transactionName: json['transaction_name'],
      transactionType: json['type'],
      amountPaid: json['task_description'],
      assignedTo: json['asignee'],
    );
  }

  static List<Task> parseTaskList(Map<String, dynamic> json, bool isPending) {
    // Access the 'pending/complete tasks' array
    List<dynamic> tasks;
    if (isPending) {
      tasks = json['pending_tasks'] as List<dynamic>;
    } else {
      tasks = json['completed_tasks'] as List<dynamic>;
    }

    // Map the list of JSON objects to Task objects
    return tasks.map((item) {
      return Task.fromJson(item as Map<String, dynamic>);
    }).toList();
  }

  // Override toString method to provide a string representation
  @override
  String toString() {
    return 'Task{'
        'taskId: $taskId'
        'dueDate:$dueDate'
        'taskName: $taskName'
        'assignedTo: $assignedTo'
        '}';
  }
}
