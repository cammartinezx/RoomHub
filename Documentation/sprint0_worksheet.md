# **Sprint-0 Worksheet**

## **Repository Link**
[RoomHub Repository Link](https://github.com/WilliamOdumah/RoomHub)

## **Slides and Presentation**
[Presentation Link](https://future-choice.my.canva.site/roomhub)

## **Summary and Vision**
Our project RoomHub aims to transform shared living by simplifying household organization and helping people find the perfect roommates.

The features we aim to have for this project and their corresponding user stories include:

**Feature: User Management**

* As a user I should be able to create an account
* As a user I should be able to login to my account
* As a user I should have access to my room after I’m logged in
* As a user I should be able to logout of my account
* As a user I should be able to add a short description of myself to my user profile

**Feature: Virtual Room Management**

* As a User I should be able to create a new room
    **Acceptance Criteria**
    * Given my role as a user, I should see a plus button to create a new room.
    After clicking on the button I should see a pop up text box to input the name of my room and a short description.
    I should see a save button. After clicking save the room should be added to my list of rooms
* As a user I should be able to invite other users to my room
    **Acceptance Criteria**
    * Given my role as a user, after clicking on an existing room, I should see a plus button beside the room name
      After clicking on the button I should see a text box to input the name of a new person I want to add to the room and a send invite button.
      After clicking the send invite button, I should see a "invite sent succesfully" toast on my screen
* As a user I should be able to reject room invites
   **Acceptance Criteria**
    * Given my role as a user, If I have received a new room invite it should pop up in my notifications bar as a card.
    On the card there should be an X or a tick. Onclick of the x the notification card disappears and onclick of the tick, the room is added to my list of rooms  
* As a user I should be able to accept room invites
    **Acceptance Criteria**
    * Given my role as a user, If I have received a new room invite it should pop up in my notifications bar as a card.
  On the card there should be an X or a tick. onclick of the tick, the room is added to my list of rooms and shows up under "My rooms"


**Feature : Task Split**

* As a User I should be able to create a new task
* As a User I should be able to assign a task to a roommate
* As a User I should be able to check/mark a task as completed
* As a User I should be able to add a date deadline to a task
* As a User I should be able to distinguish between tasks that have been completed and tasks that haven’t been completed.

**Feature: Shared Expenses**

* As a User I should be able to add a purchased item,price and roommate that purchased the product to the shared expenses tab
    **Acceptance Criteria**
    * Given my role as a user after clicking into the shared expenses tab. I should see a plus button to add a new expense. 
    On click of the plus button, a pop up should show up on the screen requiring me to input name of item, price, date and roommate that made the purchase into different text boxes.
    After adding all inputs on click of the add button the  expense shows up in the list of shared expenses
    And each roommates outstanding balance is updated accordingly with the new input.
* As a User I should be able to see how much my roommates owe me    
   **Acceptance Criteria**
    * Given my role as a user after clicking into the shared expenses tab. 
    I should see all of my roomates names and "owes you" a value representing how much they owe me.
    "Daniel owes you $500"
* As a User I should be able to see how much I owe my roomates
   **Acceptance Criteria**
    * Given my role as a user after clicking into the shared expenses tab. 
    I should see all of my roomates names and "You owe" a value representing how you owe that roommate.
    "You owe daniel $500"
* As a user if a roommate pays me an outstanding balance, I should be able to mark the roommates outstanding as settled.
  * **Acceptance Criteria**
    * Given my role as a user after clicking into the shared expenses tab. I should see a button that says "Settle"
    On click of the settle button, I should see the name of all my room mates
    On click of a roomates' name it should bring up a pop up card with the roommates name pre-loaded and the amount they owe me which can be modified based on the repayment they've made which I want to mark as settled.
    On click of the submit button, the roommates outstanding balance should change to lower value.
  


**Feature: Notification**

* As a User, I should be able to receive reminders for upcoming tasks.
* As a User, I should be able to receive reminders for upcoming shared expenses.
* As a User, I should be able to post important announcements or reminders for my roommates.
* As a User, I should receive a notification when a task is assigned to me.
* As a User, I should receive a notification when a roommate completes a task I assigned.
* As a User, I should be able to customize which notifications I receive (tasks, expenses, announcements).


**Feature: Tinder Roommates (Roommate Matching & Reviews)**

* As a User, I should be able to review my current roommates.
* As a User, I should be able to find new potential roommates.
* As a User, I should be able to send a connection request to a potential roommate.
* As a User, I should be able to receive and accept/reject connection requests from potential roommates.
* As a User, I should be able to view information about roommates who have accepted my connection request.
* As a User, I should be able to view reviews of potential roommates before connecting.
* As a User, I should receive a notification when a potential roommate sends me a connection request.

**Non-Functional Feature:The application will implement in-memory caching to reduce database query load by at least 50% for frequently accessed data, ensuring response times stay under 500 milliseconds for 90% of user requests, with a load of 100 concurrent users.**


## **Initial Architecture**

* For this project, we are going to use n-tier architecture for modern web and mobile application due to it's scalability, flexibility and performance 

        |     Front-end       |    Back-end     |  Database   |
        | ------------------- | --------------- | ----------- |
        | React (for Web app) | Node.js         | Amazon RDS  |
        | Flutter (for Moblie | Express.js      |             |
        | application)        |                 |             |

* For front-end, we choose to use **React** and **Flutter** since they both offer powerfuls framework for creating rich and interaction user interfaces for both web and mobile platforms.
* For back-end, **Node.js** and **Express.js** provide a robust and efficient platform for building the back-end. They are both well-suited for handling real-time applications and APIs
* For data storage, we prefer to use **Amazon RDS** since it provides a managed relational database service that is highly scalable and reliable, making it ideal for storing and managing application data
* This architecture allows for a clean separation of concerns between the front-end, back-end and storage layers, making it easier to maintain and develop the application.
* The architecture diagram for our project can be found [here](https://github.com/WilliamOdumah/RoomHub/blob/main/Documentation/Architecture_diagram.png)

## **Work Division**

For the project we aim to divide our team of 4 developers into 2 teams of 2 front end developers and 2 backend developers. Both teams handle all of the implementation and testing for their respective layers. To co-ordinate between teams we plan to have at least 1 stand-up at the beginning of every week, and from discussions in the group chat during the week we might decide to have another on Fridays to iron out details or assist eachother pair programming or try to resolve bugs.Secondary meetings may be earlier in the week depending on severity of bug or unclear requirements for a feature.
