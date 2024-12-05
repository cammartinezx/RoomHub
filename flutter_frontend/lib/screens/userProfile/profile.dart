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
  final List<String> tags;
  final String overall;
  final String noiseLevels;
  final String cleanliness;
  final String respect;
  final String communication;
  final String chores;
  final String payingRent;
  final List<String> matches;
  final List<String> potentialMatches;


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
    required this.tags,
    required this.overall,
    required this.noiseLevels,
    required this.cleanliness,
    required this.respect,
    required this.communication,
    required this.chores,
    required this.payingRent,
    required this.matches,
    required this.potentialMatches,
  });

  // Factory constructor to create a Profile from JSON
 factory Profile.fromJson(Map<String, dynamic> json) {
  return Profile(
    userId: json['user_id'] ?? '', // Fallback to an empty string
    name: json['name'] ?? '',
    dob: json['dob'] ?? '',
    gender: json['gender'] ?? '',
    location: json['location'] ?? '',
    contact: json['contact'] ?? '',
    contactType: json['contact_type'] ?? '',
    ethnicity: json['ethnicity'] ?? '', // Optional field
    description: json['bio'] ?? '', // Ensure bio is handled as optional
    tags: json['tags'] != null
        ? List<String>.from(json['tags'])
        : [], // Fallback to an empty list
    overall: json['overall'] ?? '-',
    noiseLevels: json['noise_levels'] ?? '-', // Fallback to a placeholder
    cleanliness: json['cleanliness'] ?? '-', // Fallback to a placeholder
    respect: json['respect'] ?? '-', // Fallback to a placeholder
    communication: json['communication'] ?? '-', // Fallback to a placeholder
    chores: json['chores'] ?? '-', // Fallback to a placeholder
    payingRent: json['paying_rent'] ?? '-', // Fallback to a placeholder
    matches: json['matches'] != null && json['matches'] is Map
        ? List<String>.from(json['matches'].keys) // Get keys as a list of strings
        : [], // Fallback to an empty list
    potentialMatches: json['potential_matches'] != null && json['potential_matches'] is Map
        ? List<String>.from(json['potential_matches'].keys) // Get keys as a list of strings
        : [], // Fallback to an empty list
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

