import requests
import base64
from dotenv import load_dotenv
import os

load_dotenv()


def speech_to_text_translate(base64_audio):
    url = "https://api.sarvam.ai/speech-to-text-translate"

    data = {
        "model": "saaras:v1",
    }

    files = {
        "file": ("input.wav", base64.b64decode(base64_audio), "audio/wav")
    }

    headers = {
        'api-subscription-key': os.getenv('SARVAM_API_KEY')
    }

    try:
        response = requests.post(url, data=data, files=files, headers=headers)
        return response.json()['transcript']
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
