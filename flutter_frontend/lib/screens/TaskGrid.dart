import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_frontend/config.dart';
import 'package:http/http.dart' as http;

import '../utils/custom_exceptions.dart';
import '../utils/our_theme.dart';
import '../utils/response_handler.dart';

class TaskGrid extends StatefulWidget {
  // Sample data array
  final String userId;
  final bool isPending;
  const TaskGrid({super.key, required this.isPending, required this.userId});

  @override
  State<TaskGrid> createState() => _TaskGridState();
}

class _TaskGridState extends State<TaskGrid> {
  late Future<List<Task>> futureTasks;

  @override
  void initState() {
    super.initState();
    futureTasks = getTasks(widget.isPending, widget.userId); // Call the async function here
  }


  @override
  Widget build(BuildContext context) {
  final theme = OurTheme();
  return FutureBuilder(
    future: futureTasks,
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const Center(child: SizedBox( width:40, height:40, child: CircularProgressIndicator()));
      } else if (snapshot.hasError) {
        return Text('Weird error: ${snapshot.error}');
      } else {
        final tasks = snapshot.data!;
        if(tasks.isEmpty) {
          return const Center(child: Text("No Tasks at the moment"));
        }
        return GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 1, // Number of columns
              childAspectRatio: 2.6, // Aspect ratio of each grid item
              crossAxisSpacing: 10, // Horizontal spacing between items
              mainAxisSpacing: 10, // Vertical spacing between items
            )
            , padding: const EdgeInsets.all(10),// Padding around the grid
            itemCount: tasks.length, // Total number of items
            itemBuilder: (context, index) {
              return IntrinsicWidth(
                child: IntrinsicHeight(
                  child: Card(
                    color: theme.lightgrey,
                    child: Padding(
                      padding: const EdgeInsets.all(5.0),
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center, // Aligns text to the center
                          mainAxisSize: MainAxisSize.min, // Ensures the card only wraps its contents
                          children: [
                            Text(
                              tasks[index].taskName,
                              style: TextStyle(
                                  color: theme.darkblue, fontSize: 20, fontWeight: FontWeight.bold
                              ),
                              overflow: TextOverflow.ellipsis,
                              maxLines: 1, // Limits to 1 line, so it only shows the ellipsis after the first line
                            ),
                            Text(
                              tasks[index].assignedTo,
                              style: TextStyle(color: theme.darkgrey, fontSize: 15),
                            ),
                            Text(
                              tasks[index].dueDate,
                              style: TextStyle(color: theme.darkgrey, fontSize: 15),
                            ),
                            const SizedBox(height: 10),
                            // is pending task type then return reuse and delete else return completed
                            widget.isPending ?
                            ElevatedButton(onPressed: () { debugPrint("pressed");},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: theme.darkblue,
                                fixedSize: const Size(200, 30), // Minimum width and height
                                padding: const EdgeInsets.all(5.0), // Padding
                              ), child: const Text("Completed",
                                style: TextStyle(color: Colors.white, fontSize: 15),
                              ),
                            )
                                :
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ElevatedButton(onPressed: () { debugPrint("pressed");},

                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: theme.darkblue,
                                    fixedSize: const Size(100, 30), // Minimum width and height
                                    padding: EdgeInsets.all(5.0), // Padding
                                  ), child: const Text("Reuse",
                                    style: TextStyle(color: Colors.white, fontSize: 15),
                                  ),
                                ),
                                const SizedBox(width: 15,),
                                ElevatedButton(onPressed: () { debugPrint("pressed");},
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: theme.darkblue,
                                    fixedSize: const Size(100, 30), // Minimum width and height
                                    padding: EdgeInsets.all(5.0), // Padding
                                  ), child: const Text("Delete",
                                    style: TextStyle(color: Colors.white, fontSize: 15),
                                  ),
                                )
                              ],
                            )
                          ]
                      ),
                    ),
                  ),
                ),
              );
            }
        );
        }
    }
  );
}

  Future<List<Task>> getTasks(bool isPendingTask, String userId) async {
    List<Task> result = [];
    try {
      var response = await http.get(
        isPendingTask ? Uri.parse("$getPendingTasks?frm=$userId") : Uri.parse("$getCompletedTasks?frm=$userId"),
        headers: {"Content-Type": "application/json"},
      );
      print(response.statusCode);
      print(response.body);
      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        List<Task> tasks =
        Task.parseTaskList(jsonData, isPendingTask);
        for (var task in tasks) {
          print(task); // This will call the toString method
        }
        result = tasks;
      } else {
        await getResponse(response, responseType: 'getTasks');
      }
    } on UserException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    }
    return result;
  }
}

class Task{
  final String taskId;
  final String dueDate;
  final String assignedTo;
  final String taskName;
  Task(
      {required this.taskId,
        required this.dueDate,
        required this.taskName,
        required this.assignedTo
        });

  // Factory constructor to create a NotificationItem from JSON
  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      taskId: json['task_id'],
      dueDate: json['due_date'],
      taskName: json['task_description'],
      assignedTo: json['asignee'],
    );
  }

  static List<Task> parseTaskList(
      Map<String, dynamic> json, bool isPending) {
    // Access the 'pending/complete tasks' array
    List<dynamic> tasks;
    if(isPending){
      tasks = json['pending_tasks'] as List<dynamic>;
    }
    else{
      tasks = json['complete_tasks'] as List<dynamic>;
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

