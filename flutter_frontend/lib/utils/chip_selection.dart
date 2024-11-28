import 'package:flutter/material.dart';
import 'package:flutter_frontend/utils/our_theme.dart';

class ChipSelection extends StatefulWidget {
  final bool disableChips;
  final Function(List<int>)
      onChipSelected; // Returns a list of selected indices
  final List<bool> isSelected;
  final List<String> tags;
  final int
      maxSelections; // Set max selections (1 for single, 5 for multi-selection)

  ChipSelection({
    super.key,
    required this.disableChips,
    required this.onChipSelected,
    required this.isSelected,
    required this.tags,
    this.maxSelections = 1, // Default to single selection
  });

  @override
  _ChipSelectionState createState() => _ChipSelectionState();
}

class _ChipSelectionState extends State<ChipSelection> {
  final theme = OurTheme();
  List<int> selectedIndices = [];

  void toggleSelection(int index) {
    setState(() {
      if (widget.isSelected[index]) {
        // Unselect if already selected
        selectedIndices.remove(index);
        widget.isSelected[index] = false;
      } else {
        // Allow selection if under maxSelections limit
        if (selectedIndices.length < widget.maxSelections) {
          selectedIndices.add(index);
          widget.isSelected[index] = true;
        } else if (widget.maxSelections == 1) {
          // For single selection, clear other selections
          selectedIndices.clear();
          widget.isSelected.fillRange(0, widget.isSelected.length, false);
          selectedIndices.add(index);
          widget.isSelected[index] = true;
        }
      }
    });
    widget.onChipSelected(selectedIndices); // Return list of selected indices
  }

  @override
  Widget build(BuildContext context) {
    return Wrap(
      //alignment: WrapAlignment.center,
      spacing: 10.0,
      runSpacing: 8.0,
      children: List<Widget>.generate(widget.tags.length, (int index) {
        return GestureDetector(
          onTap: widget.disableChips
              ? null
              : () {
                  toggleSelection(index);
                },
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
            decoration: BoxDecoration(
              gradient: widget.isSelected[index]
                  ? LinearGradient(
                      colors: [
                        theme.mintgreen,
                        theme.darkblue
                      ], // Gradient colors when selected
                    )
                  : null, // No gradient when not selected
              color: widget.isSelected[index]
                  ? null
                  : Colors
                      .white, // Fallback to white background when not selected
              borderRadius: BorderRadius.circular(10),
              border: widget.isSelected[index]
                  ? null
                  : Border.all(
                      color: Colors.grey), // Optional border when not selected
            ),
            child: Text(
              widget.tags[index],
              style: TextStyle(
                color: widget.isSelected[index] ? Colors.white : Colors.black,
                fontWeight: widget.isSelected[index]
                    ? FontWeight.bold
                    : FontWeight.normal, // Bold when selected
              ),
            ),
          ),
        );
      }),
    );
  }
}

// import 'package:flutter/material.dart';
// class ChipSelection extends StatelessWidget {

//   final bool disableChips;
//   final Function(int) onChipSelected;
//   final List<bool> isSelected;
//   final List<String> announcements;

//   ChipSelection({super.key, required this.disableChips, required this.onChipSelected, required this.isSelected, required this.announcements });

//   @override
//   Widget build(BuildContext context) {
//     return Wrap(
//         spacing: 10.0,
//         runSpacing: 8.0,
//         children: List<Widget>.generate(announcements.length, (int index){
//           return ChoiceChip(label: Text(announcements[index]),
//               onSelected: disableChips ? null:
//                   (bool selected) {
//                     onChipSelected(index);
//               },
//               selected: isSelected[index],
//               selectedColor: Colors.grey,
//               backgroundColor: Colors.white);
//         })
//     );
//   }
// }
