import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_frontend/config.dart';
import 'package:flutter_frontend/screens/TaskMgmt/edit_task_form.dart';
import 'package:http/http.dart' as http;

import '../utils/custom_exceptions.dart';
import '../utils/our_theme.dart';
import '../utils/response_handler.dart';

class TaskGrid extends StatefulWidget {
  // Sample data array
  final String userId;
  final bool isPending;
  final bool reload;
  final VoidCallback? onCompletePressed;
  const TaskGrid({super.key, required this.isPending, required this.userId, required this.reload, this.onCompletePressed});

  @override
  State<TaskGrid> createState() => _TaskGridState();
}

class _TaskGridState extends State<TaskGrid> {
  late Future<List<Task>> futureTasks;
  late List<Task> tasks;

  @override
  void initState() {
    super.initState();
    futureTasks = getTasks(widget.isPending, widget.userId); // Call the async function here
  }

  @override
  void didUpdateWidget(TaskGrid oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.reload != oldWidget.reload && widget.reload) {
      // Reload tasks if the reload flag has changed to true
      futureTasks = getTasks(widget.isPending, widget.userId);
    }
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
        tasks = snapshot.data!;
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
                            ElevatedButton(onPressed: () { markCompleted(tasks[index].taskId, widget.userId, index);},
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
                                ElevatedButton(onPressed: () { reuseTaskPressed(tasks[index].taskName, tasks[index].assignedTo, tasks[index].taskId, tasks[index].dueDate,);},
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: theme.darkblue,
                                    fixedSize: const Size(100, 30), // Minimum width and height
                                    padding: const EdgeInsets.all(5.0), // Padding
                                  ), child: const Text("Reuse",
                                    style: TextStyle(color: Colors.white, fontSize: 15),
                                  ),
                                ),
                                const SizedBox(width: 15,),
                                ElevatedButton(onPressed: () { deletePressed(tasks[index].taskId, widget.userId);},
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: theme.darkblue,
                                    fixedSize: const Size(100, 30), // Minimum width and height
                                    padding: const EdgeInsets.all(5.0), // Padding
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
        // for (var task in tasks) {
        //   print(task); // This will call the toString method
        // }
        result = tasks;
        if(isPendingTask == false){
          print(result);
        }
      } else {
        await getResponse(response, responseType: 'getTasks');
      }
    } on UserException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    }
    if(isPendingTask == false){
      print(result);
    }
    return result;
  }

  void markCompleted(String taskId, String userId, int taskIndex) async {
    try {
      print(taskId);
      print(userId);
      var reqBody = {
        "frm": userId,
        "id" : taskId
      };
      print(reqBody);
      var response = await http.patch(
         Uri.parse(markComplete),
         headers: {"Content-Type": "application/json"},
         body: jsonEncode(reqBody)
      );
      print(response.statusCode);
      print(response.body);
      await patchResponse(response, responseType: 'markComplete');
      //   reload state
      //   completedTasks state
      widget.onCompletePressed!();
      // New tasks state
      setState(() {
        tasks.removeAt(taskIndex);
      });
    } on TaskException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    } on UserException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    }
  }

  void reuseTaskPressed(String taskName, String assignedTo, String taskId, String dueDate) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => EditTaskForm(taskName: taskName, assignedTo: assignedTo, taskId: taskId, dueDate: dueDate, loggedInUser: widget.userId,),
      ),
    ); // Pop the current screen
  }

  void deletePressed(String taskId, String userId) async{
    try {
      print(taskId);
      print(userId);
      var reqBody = {
        "frm": taskId,
        "id":userId,
      };
      print(reqBody);
      var response = await http.delete(
          Uri.parse(deleteTask),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode(reqBody)
      );
      print(response.statusCode);
      print(response.body);
      await deleteResponse(response, responseType: 'deleteTask');
      //   reload state
      // widget.onCompletePressed!();
    } on TaskException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    } on UserException catch (e) {
      print(e.toString());
      OurTheme().buildToastMessage(e.message);
    }  }
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

