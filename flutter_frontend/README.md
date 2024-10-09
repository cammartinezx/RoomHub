# RoomHub: flutter_frontend

## Getting Started
Clone the Repository
```
git clone <repo-url>
```
After cloning, they should navigate to the project's root directory:
```
cd flutter_frontend
```

## Prerequisites

Step 1: Install Xcode

Open the App Store on your Mac.
Search for Xcode and click Get to download it.
Install Xcode by following the on-screen instructions.
Open Xcode after installation to complete the setup.
Step 2: Install Xcode Command-Line Tools

Open Terminal (found in Applications > Utilities).
Run the following command to set the Xcode developer directory:
bash
Copy code
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
Accept the Xcode License Agreement:
You can do this by opening Xcode, which will prompt you to accept the agreement, or by running the following command in Terminal:
bash
Copy code
sudo xcodebuild -license accept
Step 3: Install Homebrew

In the Terminal, run the following command to install Homebrew:
bash
Copy code
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Follow the on-screen instructions. You may need to enter your password.
Step 4: Install CocoaPods

After installing Homebrew, install CocoaPods by running:
bash
Copy code
brew install cocoapods
Step 5: Install Flutter

If you haven’t installed Flutter yet, download the Flutter SDK from the Flutter official website.
Extract the downloaded archive to a desired location (e.g., ~/flutter).
Add Flutter to your PATH by adding the following line to your .bash_profile, .zshrc, or .bashrc file (depending on your shell):
bash
Copy code
export PATH="$PATH:`pwd`/flutter/bin"
Run the following command to apply the changes:
bash
Copy code
source ~/.bash_profile   # or source ~/.zshrc
Step 6: Verify Flutter Installation

Run flutter doctor in the Terminal to check if Flutter is set up correctly:
bash
Copy code
flutter doctor
Follow any prompts to install missing dependencies or resolve issues.



 
Finally run in your vscode terminal:
```
flutter run
```



