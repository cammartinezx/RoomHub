class Profile {
  final String userId;
  final String name;
  final String dob;
  final String gender;
  final String location;
  final String contact;
  final String contactType;
  final String ethnicity;
  final String description;
  final List<String>? tags;
  final String? overall; // Optional tags field
  final String? bio;
  final String? noiseLevels;
  final String? cleanliness;
  final String? respect;
  final String? communication;
  final String? chores;
  final String? payingRent;

  Profile({
    required this.userId,
    required this.name,
    required this.dob,
    required this.gender,
    required this.location,
    required this.contact,
    required this.contactType,
    required this.ethnicity,
    required this.description,
    this.tags,
    this.overall,
    this.bio,
    this.noiseLevels,
    this.cleanliness,
    this.respect,
    this.communication,
    this.chores,
    this.payingRent,
  });

  // Factory constructor to create a Profile from JSON
  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      userId: json['user_id'],
      name: json['name'],
      dob: json['dob'],
      gender: json['gender'],
      location: json['location'],
      contact: json['contact'],
      contactType: json['contact_type'],
      ethnicity: json['ethnicity'] ?? '', // Make sure this is handled
      description: json['bio'] ?? '', // Ensure bio is handled as optional
      tags: json['tags'] != null
          ? List<String>.from(json['tags'])
          : null, // Parse if present
      overall: json['overall'] ?? '-',
      noiseLevels: json['noise_levels'], // Handle as string, you can cast later
      cleanliness: json['cleanliness'],
      respect: json['respect'],
      communication: json['communication'],
      chores: json['chores'],
      payingRent: json['paying_rent'],
    );
  }

  static Profile parseProfile(Map<String, dynamic> json) {
    return Profile.fromJson(json);
  }

  static List<Profile> parseProfileList(Map<String, dynamic> json) {
    // Access the 'profiles' array from the JSON
    List<dynamic> profiles = json['profiles'] as List<dynamic>;

    // Map the list of JSON objects to Profile objects
    return profiles.map((item) {
      return Profile.fromJson(item as Map<String, dynamic>);
    }).toList();
  }

  // Override toString method to include tags
  @override
  String toString() {
    return 'Profile{'
        'userId: $userId, '
        'name: $name, '
        'dob: $dob, '
        'gender: $gender, '
        'location: $location, '
        'contact: $contact, '
        'contactType: $contactType, '
        'ethnicity: $ethnicity, '
        'description: $description, '
        'tags: ${tags ?? 'None'}, '
        'noiseLevels: $noiseLevels, '
        'cleanliness: $cleanliness, '
        'respect: $respect, '
        'communication: $communication, '
        'chores: $chores, '
        'payingRent: $payingRent, '
        'overall: $overall'
        '}';
  }

  int calculateAge(String dob) {
    // Parse the DOB string to a DateTime object
    final birthDate = DateTime.parse(dob);

    // Get the current date
    final today = DateTime.now();

    // Calculate age in years
    int age = today.year - birthDate.year;

    // Adjust age if the current date is before the birthday in the current year
    if (today.month < birthDate.month ||
        (today.month == birthDate.month && today.day < birthDate.day)) {
      age--;
    }

    return age;
  }

  
}

