import requests
import sys
import urllib3
from datetime import datetime

# Desactive les avertissements SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration de base
URL_BASE = "http://10.0.200.78:8000"
USERNAME_TOKEN = "rasp1"
PASS_TOKEN = "b8c95e1a-18a6-11f1-a5d2-423b83e4d33c"

# La valeur corrigee attendue par l'API et la BDD
VALEUR_RASP_API = 1 

def get_token():
    url = f"{URL_BASE}/token"
    data = {"username": USERNAME_TOKEN, "password": PASS_TOKEN}
    
    try:
        response = requests.post(url, data=data, timeout=5, verify=False)
        if response.status_code in [200, 201]:
            token = response.json().get("access_token")
            # Affichage du token en console
            print(f"=== TOKEN RECUPERE ===")
            print(f"{token}\n")
            return token
        else:
            print(f"Erreur lors de la recuperation du token ({response.status_code}) : {response.text}")
    except Exception as e:
        print(f"Erreur de connexion : {e}")
    return None

def envoyer_gaspillage(poid, ingredient_id):
    token = get_token()
    if not token:
        print("Erreur : Impossible d'obtenir le token, arret du script.")
        return

    url = f"{URL_BASE}/insertAnalyse"
    
    # Parametres stricts pour l'URL
    parametres = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type_dechet": int(ingredient_id),
        "poid": float(poid),
        "rasp": VALEUR_RASP_API, 
        "token": token
    }
    
    try:
        response = requests.post(url, params=parametres, timeout=5, verify=False)
        if response.status_code in [200, 201]:
            print(f"Succes ! Dechet ID {ingredient_id} pese a {poid} kg (rasp={VALEUR_RASP_API}).")
        else:
            print(f"Erreur API ({response.status_code}) : {response.text}")
    except Exception as e:
        print(f"Erreur de connexion a l'API : {e}")

if __name__ == "__main__":
    # Valeurs par defaut
    poid_test = 0.5
    ingredient_test = 3 

    # Gestion des arguments de la ligne de commande
    if "--poid" in sys.argv:
        try:
            poid_test = float(sys.argv[sys.argv.index("--poid") + 1])
        except (ValueError, IndexError):
            print("Erreur : --poid doit etre suivi d'un nombre (ex: --poid 1.5).")
            sys.exit(1)
    
    if "--ingredients" in sys.argv:
        try:
            ingredient_test = int(sys.argv[sys.argv.index("--ingredients") + 1])
        except (ValueError, IndexError):
            print("Erreur : --ingredients doit etre suivi d'un nombre entier (ex: --ingredients 4).")
            sys.exit(1)

    # Lancement de l'envoi
    envoyer_gaspillage(poid_test, ingredient_test)