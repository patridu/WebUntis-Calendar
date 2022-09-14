# WebUntis to iCalendar connector

Access your WebUntis timetable via Google Calendar, Outlook, Apple Calendar...

## Setup

- Make sure the computer or server you want to run this on has Node.js installed. The software was tested using version 17.1.0
- Clone this repository into a new folder on the target system
- Open a command prompt in that folder and run `npm install` to download all necessary dependencies
- Copy the file `standard-config.json`, rename it to `config.json` and open it in the text editor of your choice

### Additional notes:

- This software does not use encryption by default. Consider placing it behind a reverse proxy like NGINX to handle this

## Configuration

Configure the software by editing `config.json`, the copy of `standard-config.json`.
You can obtain `server` and `school` by looking at the address bar when accessing WebUntis:

`https://test.webuntis.com/WebUntis/?school=Test+School#/basic/login`

In this case, the parameters would be `"test.webuntis.com"` and `"Test School"` respectively.

`monthsBefore` and `monthsAfter` specify the timespan the result covers based on the current date.

## Usage

Calling the server root with a parameter "c" or "class" will return either an iCalendar file or nothing at all.
Each request is logged to the console together with an error message, if necessary.

Run the software on your local machine and access the following URL via your browser:
`http://localhost:8081/?c=` + your class ID

To obtain a class ID, go to the timetable of your choice and click the 🖨 printer icon. Then look at the URL of the popup:

`.../printpreview/timetable?type=1&id=1234&date=...`

In this case, the class ID would be `1234`