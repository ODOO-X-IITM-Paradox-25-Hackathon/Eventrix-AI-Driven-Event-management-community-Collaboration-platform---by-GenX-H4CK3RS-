import random 
import smtplib
from email.message import EmailMessage

def generate_otp():
    """Generate a 6-digit OTP."""
    otp = ""
    for i in range(6):
        otp += str(random.randint(0, 9))
    return otp

server=smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()

server.login("rexjosondeva@gmail.com","yezj hfmw dakw zbot")
to_mail=input("enter receiving email address: ")

msg=EmailMessage()
msg["Subject"]="OTP Verification"
msg["From"]="rexjosondeva@gmail.com"
msg["To"]=to_mail
msg.set_content("Your OTP is: " + generate_otp())
server.send_message(msg)
print("OTP sent successfully!")


