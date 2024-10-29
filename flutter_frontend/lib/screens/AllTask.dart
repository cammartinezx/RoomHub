import 'package:flutter/material.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';

class AllTasks extends StatefulWidget {
  const AllTasks({super.key});

  @override
  State<AllTasks> createState() => _AllTasksState();
}

class _AllTasksState extends State<AllTasks> {
  final theme = OurTheme();
  final List<String> pendingTasks = List.generate(10, (index) => 'Item $index');
  List<String> completedTasks = [];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background gradient container
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [
                theme.mintgreen, // Gradient starting color
                theme.darkblue,  // Gradient ending color
              ]),
            ),
          ),
          // Positioned header with back button and title
          Positioned(
            top: 40.0,
            left: 20.0,
            right: 20.0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Back button to return to the previous screen
                IconButton(
                  icon: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                    size: 30,
                  ),
                  onPressed: () {
                    Navigator.of(context).pop(); // Pop the current screen
                  },
                ),
                // Title text indicating the purpose of the screen
                const Text(
                  'Tasks Organizer',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 30,
                      color: Colors.white,
                      fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
          // Main content container for instructions and email input
          Padding(
            padding: const EdgeInsets.only(top: 120.0),
            child: Container(
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40),
                  topRight: Radius.circular(40),
                ),
                color: Colors.white, // Background color for the input area
              ),
              height: double.infinity,
              width: double.infinity,
              child: Padding(
                  padding: EdgeInsets.only(top:20.0),
                  child: Column(
                      children: [
                        Expanded(child: Column(
                          children: [
                            Text("New Tasks",
                              style: TextStyle(
                                color: theme.darkblue,
                                fontSize: 30.0,
                                fontWeight: FontWeight.bold,)
                          ),
                            Expanded(child: TaskGrid()),],
                        )
                      ),
                      Expanded(child: Column(
                          children: [
                            Text("Completed Tasks",
                                style: TextStyle(
                                  color: theme.darkblue,
                                  fontSize: 30.0,
                                  fontWeight: FontWeight.bold,)
                            ),
                            Expanded(child: TaskGrid()),],
                          )
                        ),
                        const SizedBox(height: 10.0),
                      ]
                  )
              )
            ),
          ),
        ],
      ),
    );
  }
}

class TaskGrid extends StatelessWidget {
  // Sample data array
  final List<String> pendingTasks = List.generate(10, (index) => 'Item $index');
  final isPending = true;
  TaskGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 1, // Number of columns
          childAspectRatio: 2.1, // Aspect ratio of each grid item
          crossAxisSpacing: 10, // Horizontal spacing between items
          mainAxisSpacing: 10, // Vertical spacing between items
        )
        , padding: const EdgeInsets.all(10),// Padding around the grid
        itemCount: pendingTasks.length, // Total number of items
        itemBuilder: (context, index) {
          return Card(
            color: Colors.black87,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center, // Aligns text to the start
                  children: [
                    Text(
                      "Task Name: Wash the dishes ",
                      style: TextStyle(
                          color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1, // Limits to 1 line, so it only shows the ellipsis after the first line
                    ),
                    Text(
                      "Assigned To: dan@gmail.com",
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      "Due Date: 22-10-2024",
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    // is pending task type then return reuse and delete else return completed
                    isPending ?
                    Row(
                      children: [
                        Expanded(child: GradientButton(text: "Reuse", onTap: () {debugPrint("Reuse button clicked");})),
                        SizedBox(width: 15,),
                        Expanded(child: GradientButton(text: "Delete", onTap: () {debugPrint("Delete button clicked");}))
                      ],
                    ) :
                    GradientButton(text: "Completed", onTap: () {debugPrint("Completed button clicked");})
                  ]
              ),
            ),
          );
        }
    );
  }
}
