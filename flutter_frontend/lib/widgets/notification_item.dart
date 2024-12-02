class NotificationItem {
  final String type;
  final String msg;
  final String from;
  final String notificationid;
  NotificationItem(
      {required this.type,
      required this.msg,
      required this.from,
      required this.notificationid});

  // Factory constructor to create a NotificationItem from JSON
  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      from: json['from'],
      type: json['type'],
      msg: json['msg'],
      notificationid: json['notification_id'],
    );
  }

  static List<NotificationItem> parseNotificationList(
      Map<String, dynamic> json) {
    // Access the 'All_Notifications' array
    final notifications = json['All_Notifications'] as List<dynamic>;

    // Map the list of JSON objects to NotificationItem objects
    return notifications.map((item) {
      return NotificationItem.fromJson(item as Map<String, dynamic>);
    }).toList();
  }
  // Override toString method to provide a string representation
  @override
  String toString() {
    return 'NotificationItem{'
        'type: $type, '
        'msg: $msg, '
        'from: $from, '
        'notificationid: $notificationid'
        '}';
  }
}
