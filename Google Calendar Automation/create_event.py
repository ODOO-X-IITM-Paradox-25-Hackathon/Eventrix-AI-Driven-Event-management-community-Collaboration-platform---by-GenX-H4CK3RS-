import datetime as dt
import os.path 
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


SCOPES=['https://www.googleapis.com/auth/calendar']

def main():
    creds=None
    if(os.path.exists('token.json')):
        creds=Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow=InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds=flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        service=build('calendar', 'v3', credentials=creds)
        event={
            'summary': 'Going to the gym',
            'location': '123 Test St, Test City, TX 12345',
            "colorId": 1,
            'description': 'This is a test event created by the Rex the Great.',
            'start': {
                'dateTime': '2023-10-01T10:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
            },
            'end': {
                'dateTime': '2023-10-01T11:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=3'
            ],
            "attendees": [
                {'email': 'rexjosondeva@gmail.com'},
                {"email": 'rexjosondeva123@gmail.com'},
                {'email': '23f2002424@ds.study.iitm.ac.in'}]
        }
        event=service.events().insert(calendarId='primary', body=event).execute()
        print("Event created: %s" % (event.get('htmlLink')))
    except HttpError as error:
        print(f'An error occurred: {error}')
        creds=None        

if __name__=='__main__':
    main()
