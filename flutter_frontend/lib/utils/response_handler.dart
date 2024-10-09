

import 'package:http/http.dart' as http;
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'dart:convert';

Future<void> handlePost(http.Response response,
    {required String responseType}) async {
  switch (responseType) {
    case 'signup':
      switch (response.statusCode) {
        case 200:
          if (response.body == "This user name already exist") {
            throw UserException("This username already exists");
          }
          break;
        case 400:
          throw UserException("Error Creating User - Email is invalid");
        case 500:
          throw UserException("Something went wrong. Try again later");
        default:
          throw UserException("Something went wrong. Try again later");
      }
      break;

    case 'createRoom':
      switch (response.statusCode) {
        case 400:
          if (response.body.contains("Invalid Room Name")) {
            throw RoomException("Bad Request - Invalid Room Name");
          } else if (response.body.contains("Invalid User")) {
            throw RoomException("Bad Request - Invalid User");
          }
          break;
        case 500:
          throw RoomException("Something went wrong. Try again later");
        default:
          throw RoomException("Something went wrong. Try again later");
      }
      break;

    case 'addRoommate':
      switch (response.statusCode) {
        case 404:
          if (response.body.contains("Room not found")) {
            throw UserException("Room not found");
          } else if (response.body.contains("User not found")) {
            throw UserException("User not found");
          } else if (response.body.contains("New roommate not found")) {
            throw UserException("New roommate not found");
          } else if (response.body.contains("Old roommate not found")) {
            throw UserException("Old roommate not found");
          }
          break;
        case 500:
          print("Something went wrong. Try again later");
          break;
        default:
          print("Something went wrong. Try again later");
      }
      break;

    case 'getUserRoom':
      switch (response.statusCode) {
        case 400:
          if (response.body.contains("Invalid username")) {
            throw UserException('This username is invalid');
          }
          break;
        case 403:
          throw UserException(response.body);
        case 404:
          throw UserException('User not found');
        case 500:
          throw UserException('Something went wrong. Try again later');
      }
      break;

    case 'getUserNotification':
      switch (response.statusCode) {
        case 400:
          if (response.body.contains("Invalid username")) {
            throw UserException('Invalid username');
          }
          break;
        case 500:
          throw UserException('Something went wrong. Try again later');
      }
      break;

    case 'joinRoom':
      switch (response.statusCode) {
        case 404:
          if (response.body.contains("User not found")) {
            throw NotificationException(
                'Error Creating Notification - User not found');
          }
          break;
        case 400:
          if (response.body.contains("Message is empty")) {
            throw NotificationException(
                'Error Creating Notification - Message is empty');
          }
          break;
        case 500:
          throw NotificationException('Something went wrong. Try again later');
      }
      break;

    default:
      throw Exception('Something went wrong. Try again later');
  }
}

Future<String> getResponse(http.Response response,
    {required String responseType}) async {
  switch (responseType) {
    case 'getUserRoom':
      switch (response.statusCode) {
        case 200:
          // Assuming the response body is a JSON and contains "room_name" key
          var jsonResponse = jsonDecode(response.body);
          if (jsonResponse.containsKey('room_name')) {
            return jsonResponse['room_name'];
          } else {
            throw UserException('Room name not found in the response');
          }
        case 400:
          if (response.body.contains("Invalid username")) {
            throw UserException('This username is invalid');
          }
          throw UserException('Invalid request');
        case 404:
          throw UserException('User not found');
        case 500:
          throw UserException('Something went wrong. Try again later');
        default:
          throw UserException('Unexpected status code: ${response.statusCode}');
      }

    case 'getUserNotification':
      switch (response.statusCode) {
        case 400:
          if (response.body.contains("Invalid username")) {
            throw UserException('Invalid username');
          }
          throw UserException('Invalid request');
        case 500:
          throw UserException('Something went wrong. Try again later');
        default:
          throw UserException('Unexpected status code: ${response.statusCode}');
      }
    default:
      throw Exception('Something went wrong. Try again later');
  }
}

/*
Future<String> getResponse(http.Response response,
    {required String responseType}) async {

  // Helper function to handle common status codes
  void handleCommonErrors(int statusCode, String body) {
    switch (statusCode) {
      case 400:
        if (body.contains("Invalid username")) {
          throw UserException('This username is invalid');
        } else {
          throw UserException('Invalid request');
        }
      case 404:
        throw UserException('User not found');
      case 500:
        throw UserException('Something went wrong. Try again later');
      default:
        if (statusCode < 200 || statusCode >= 300) {
          throw UserException('Unexpected status code: $statusCode');
        }
    }
  }

  // Main logic based on responseType
  switch (responseType) {
    case 'getUserRoom':
    case 'getUserNotification':
      handleCommonErrors(response.statusCode, response.body);
      var jsonResponse = jsonDecode(response.body);
      
      // Dynamically check for the right key based on responseType
      String key = responseType == 'getUserRoom' ? 'room_name' : 'notification';
      
      if (jsonResponse.containsKey(key)) {
        return jsonResponse[key];
      } else {
        throw UserException('$key not found in the response');
      }

    default:
      throw Exception('Unknown response type');
  }
}
 */

