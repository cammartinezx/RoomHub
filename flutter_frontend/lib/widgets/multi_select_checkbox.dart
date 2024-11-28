import 'package:flutter/material.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:multiselect/multiselect.dart';

class MultiSelectFormField extends FormField<List<String>> {
  MultiSelectFormField({
    super.key,
    required List<dynamic> options,//list of list
    required String? errorState,
    required void Function(List<dynamic>) updateChoices,
    super.onSaved,
    super.validator,
    List<String>? initialValue,
    required String hint,
  }) : super(
    initialValue: initialValue ?? [],
    builder: (FormFieldState<List<String>> state) {

      // Extract names and ids
      List<String> names = options.map((e) => e[1] as String).toList();
      List<String> ids = options.map((e) => e[0].toString()).toList();
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            // padding: const EdgeInsets.all(8.0),
            child: DropDownMultiSelect(
              decoration: InputDecoration(
                labelText: options.isEmpty? "No $hint" : hint,
                labelStyle: TextStyle(
                  color: OurTheme().darkblue // Normal state color
                ),
                fillColor: Theme.of(state.context).colorScheme.onPrimary,
                focusColor: Theme.of(state.context).colorScheme.onPrimary,
                enabledBorder: const OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(7)),
                  borderSide: BorderSide(color: Colors.grey, width: 1.5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: const BorderRadius.all(Radius.circular(7)),
                  borderSide: BorderSide(color: OurTheme().darkblue, width: 1.5),
                ),
                errorText: errorState, // Display error text if validation fails
              ),
              options: names, // Display the name (e[1]),
              selectedValues: state.value!,
              onChanged: (List<dynamic> newValue) {
                // Map the selected names to their corresponding ids using the index in the options list
                List<String> selectedIds = newValue.map((name) {
                  int index = names.indexOf(name as String);
                  return ids[index];  // Return the id at that index
                }).toList();

                updateChoices(selectedIds);
                // state.didChange(selectedIds);// Update FormField state
              },
            ),
          ),
          if (state.hasError)
            Padding(
              padding: const EdgeInsets.only(left: 8.0, top: 4.0),
              child: Text(
                errorState!,
                style: const TextStyle(color: Colors.red, fontSize: 12),
              ),
            ),
        ],
      );
    },
  );
}
