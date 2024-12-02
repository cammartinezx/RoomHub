import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/userProfile/profile.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/widgets/numbers_widget.dart';
import 'package:percent_indicator/percent_indicator.dart';

class ProfileCard extends StatefulWidget {
  final Profile profile;
  final List<Color> gradient; // Gradient for the card
  const ProfileCard({super.key, required this.profile, required this.gradient});

  @override
  State<ProfileCard> createState() => _ProfileCardState();
}

class _ProfileCardState extends State<ProfileCard> {
  @override
  Widget build(BuildContext context) {
    final profile = widget.profile;
    final age = profile.calculateAge(widget.profile.dob);

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18),
        child: Container(
          height: 650,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Stack(
            children: [
              // Scrollable content
              Positioned.fill(
                child: Padding(
                  padding: const EdgeInsets.only(
                      top: 70), // Offset content below the header
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 14),
                          buildAbout(profile.description, profile.ethnicity,
                              profile.tags),
                          const SizedBox(height: 20),
                          NumbersWidget(
                              overallRating: profile.overall,
                              age: age.toString(),
                              gender: profile.gender),
                          const SizedBox(height: 20),
                          review(widget.gradient, profile.payingRent,
                              "Paying Rent/Utilities on Time"),
                          review(widget.gradient, profile.noiseLevels,
                              "Noise levels"),
                          review(widget.gradient, profile.cleanliness,
                              "Cleanliness"),
                          review(widget.gradient, profile.chores,
                              "Chores Participation"),
                          review(widget.gradient, profile.communication,
                              "Communication"),
                          review(widget.gradient, profile.respect,
                              "Respect for Privacy and Boundaries"),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              // Fixed header
              Container(
                height: 70,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: widget.gradient,
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(20),
                    topLeft: Radius.circular(20),
                  ),
                ),
                child: Center(
                  child: Text(
                    widget.profile.name,
                    style: const TextStyle(
                      color: Colors
                          .white, // Ensures text is visible on dark background
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildAbout(String bio, String ethnicity, List<String>? tags) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 5),
          Text(
            bio,
            style: const TextStyle(
              fontSize: 14,
              height: 1.4,
              color: Colors.black,
              fontWeight: FontWeight.normal,
            ),
          ),
          const SizedBox(height: 8), // Add spacing between ethnicity and bio
          RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 14, color: Colors.black),
              children: [
                const TextSpan(
                  text: 'Ethnicity: ',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                TextSpan(
                  text: ethnicity,
                  style: const TextStyle(fontWeight: FontWeight.normal),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          // Conditionally render tags only if they are non-null and non-empty
          if (tags != null && tags.isNotEmpty)
            Wrap(
              spacing: 8, // Space between chips
              runSpacing: 8, // Space between lines
              children: tags.map((tag) => _buildTagChip(tag)).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildTagChip(String tag) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.15), // Light grey transparent
        borderRadius: BorderRadius.circular(16), // Rounded edges
      ),
      child: Text(
        tag,
        style: const TextStyle(
            fontSize: 11, color: Colors.black, fontWeight: FontWeight.normal),
      ),
    );
  }

  Widget review(List<Color> gradients, String? avg, String type) {
    print(avg);
    final percent = calculatePercentage(avg);
    return Padding(
      padding: const EdgeInsets.symmetric(
          horizontal: 16.0, vertical: 8.0), // Adjust spacing
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start, // Align text and bar to the start
        children: [
          // The text above the progress bar
          Text(
            type,
            style: const TextStyle(
              color: Colors.black, // Ensures text is visible
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
          const SizedBox(
              height: 8), // Add spacing between text and progress bar
          // Layout for the progress bar
          LayoutBuilder(
            builder: (context, constraints) {
              double barWidth = constraints.maxWidth *
                  percent; // Calculate bar width based on percentage
              return Stack(
                children: [
                  // Background bar
                  Container(
                    width:
                        constraints.maxWidth, // Full width for the background
                    height: 5.0,
                    decoration: BoxDecoration(
                      color: Colors.grey[
                          300], // Background color for the unfilled portion
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  // Gradient-filled progress bar
                  Container(
                    width: barWidth, // Only fill up to the percentage width
                    height: 5.0,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: gradients,
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  double calculatePercentage(String? average) {
    // Attempt to parse the average as a double
    double? avg = double.tryParse(average ?? '');

    // If parsing fails or avg is null, default to a safe value (e.g., 1.0)
    avg ??= 5.0;

    // Ensure the value is between 1.0 and 5.0
    avg = avg.clamp(1.0, 5.0);

    // Calculate percentage
    double percent = avg / 5.0;

    // Round to a maximum of 2 decimal places
    return double.parse(percent.toStringAsFixed(2));
  }
}
