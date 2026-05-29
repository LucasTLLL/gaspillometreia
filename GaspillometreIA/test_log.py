import requests
import time
import random
import urllib3
from datetime import datetime

# Désactive les avertissements SSL pour le test local
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
URL_TOKEN = "http://10.0.200.78:8000/token"
URL_API_LOGS = "http://10.0.200.78:8000/logs"
USERNAME = "rasp1"
PASSWORD = "b8c95e1a-18a6-11f1-a5d2-423b83e4d33c"

# Variable globale pour stocker le token
TOKEN_GLOBAL = None

def recuperer_token():
    global TOKEN_GLOBAL
    print("Connexion en cours...")
    
    payload_auth = {
        "grant_type": "password",
        "username": USERNAME,
        "password": PASSWORD,
        "client_id": "string",
        "client_secret": "string"
    }
    
    try:
        reponse = requests.post(URL_TOKEN, data=payload_auth, verify=False)
        if reponse.status_code == 200:
            TOKEN_GLOBAL = reponse.json().get("access_token")
            print("Token recupere et stocke en global.")
            return True
        else:
            print(f"Erreur lors de la recuperation du token: {reponse.text}")
            return False
    except Exception as e:
        print(f"Erreur de connexion: {e}")
        return False

def envoyer_logs(nombre):
    global TOKEN_GLOBAL
    if not TOKEN_GLOBAL:
        print("Erreur: Aucun token disponible.")
        return

    print(f"Envoi de {nombre} logs...")
    
    for i in range(nombre):
        # Parametres dans l'URL comme exige par l'API
        url_api = f"{URL_API_LOGS}?token={TOKEN_GLOBAL}&rasp=rasp1"
        
        payload_log = {
            "level": random.choice(["DEBUG", "INFO", "WARNING", "ERROR"]),
            "message": f"[Test] Log n°{i+1}",
            "date": datetime.now().isoformat()
        }

        try:
            reponse = requests.post(url_api, json=payload_log, verify=False)
            
            if reponse.status_code in [200, 201]:
                print(f"Log {i+1} envoye.")
            else:
                print(f"Erreur {reponse.status_code}: {reponse.text}")
        except Exception as e:
            print(f"Erreur lors de l'envoi: {e}")
            break
        time.sleep(0.5)

if __name__ == "__main__":
    if recuperer_token():
        envoyer_logs(100)
    else:
        print("Le script s'arrete car l'authentification a echoue.")