# WebUntis to iCalendar connector

Access your WebUntis timetable via Google Calendar, Outlook, Apple Calendar...

## Setup

- Make sure the computer or server you want to run this on has Node.js installed. The software was tested using version 17.1.0
- Clone this repository into a new folder on the target system
- Open a command prompt in that folder and run `npm install` to download all necessary dependencies
- Copy the file `standard-config.json`, rename it to `config.json` and open it in the text editor of your choice

### Additional notes:

- This software does not use SSL by default. Consider placing it behind a reverse proxy to handle the secure connection if accessible over the internet

## Configuration

Each configuration parameter must be specified either in `config.json` or in the URL itself. URL parameters already set in `config.json` will be ignored. The user will receive an error if a parameter is missing.

Below you will find a list of all available parameters:

| config.json name | URL name | Usage | Example |
|---|---|---|---|
| forcedServer | server | WebUntis instance the request will be sent to | demo.webuntis.com |
| forcedSchool | school, s | WebUntis school id. Must have anonymous access enabled | demo-school |
| forcedClass | class, c | Class the timetable will be for | 10B |
| monthsBefore | monthsBefore | How many months prior will be included in the calendar | 2 |
| monthsAfter | monthsAfter | How many months after will be included in the calendar | 4 |