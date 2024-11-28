class Profile {
  final String userId,name, dob, gender,location, contact, contactType, ethnicity, description;

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
  });

  // Factory constructor to create a Profile from JSON
  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      userId: json['userId'],
      name: json['name'],
      dob: json['dob'],
      gender: json['gender'],
      location: json['location'],
      contact: json['contact'],
      contactType: json['contactType'],
      ethnicity: json['ethnicity'],
      description: json['description'],
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

  // Override toString method to provide a string representation
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
        '}';
  }
}
