import requests
import random
import time
import sys
from datetime import datetime

# Configuration
RASP_ID = "1"
PASS_TOKEN = "b8c95e1a-18a6-11f1-a5d2-423b83e4d33c"
URL_BASE = "http://10.0.200.78:8000"

def get_token():
    url = f"{URL_BASE}/token"
    parametres = {
        "username": RASP_ID,
        "password": PASS_TOKEN
    }
    response = requests.post(url, data=parametres, timeout=5)
    if response.status_code in [200, 201]:
        return response.json().get("access_token")
    else:
        print(f"Erreur Token ({response.status_code}) : {response.text}")
        return None

def envoyer_log_test(nombre):
    token = get_token()
    if not token:
        return

    url = f"{URL_BASE}/insertLog"
    
    for i in range(nombre):
        # Format attendu par ton API (copié sur le code fonctionnel)
        parametres = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "level": random.choice(["DEBUG", "INFO", "WARNING", "ERROR"]),
            "message": f"Log de test numero {i+1}",
            "rasp": RASP_ID,
            "token": token
        }
        
        try:
            # Envoi via 'params' comme dans l'autre script
            response = requests.post(url, params=parametres, timeout=5)
            
            if response.status_code in [200, 201]:
                print(f"Log {i+1} envoye avec succes.")
            else:
                print(f"Erreur API ({response.status_code}) : {response.text}")
        except Exception as e:
            print(f"Erreur de connexion : {e}")
        
        time.sleep(0.5)

if __name__ == "__main__":
    # Permet de choisir le nombre de logs avec --valeur
    n = 10
    if "--valeur" in sys.argv:
        idx = sys.argv.index("--valeur")
        n = int(sys.argv[idx+1])
        
    envoyer_log_test(n)
