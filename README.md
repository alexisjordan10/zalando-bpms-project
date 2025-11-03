# 🛍️ Zalando - BPMN Process Automation

Ce projet simule le **processus de commande Zalando** en utilisant **Camunda 8**, de la création de commande jusqu’à la livraison au client.  
Il comprend les processus BPMN, les formulaires utilisateur et les workers automatisés (Python).

---

## 📦 Structure du projet
alando-bpms-project/
│
├── bpmn/
│ ├── OrderProcessing.bpmn # Processus principal
│ ├── PaymentProcessing.bpmn # Sous-processus : Paiement
│ ├── Fulfillment.bpmn # Sous-processus : Préparation en entrepôt
│ └── Delivery.bpmn # Sous-processus : Livraison
│
├── forms/
│ └── CreateOrderForm.form # Formulaire Camunda pour "Create Order"
│
├── workers/
│ └── payment_worker.py # Worker Python pour simuler le paiement
│
└── README.md

---

## 🧠 Vue d’ensemble du processus

### 🎯 Processus principal : `zalando.order`
1. **Create Order** → Tâche utilisateur (formulaire)
2. **Is order valid?** → Gateway de validation
3. **Send payment request** → Tâche de service (type `payment-request-service`)
4. **Call PaymentProcessing subprocess**
5. **Payment successful?**
   - ✅ Oui → `Warehouse Fulfillment` → `Delivery` → ✅ *Order completed*
   - ❌ Non → 🛑 *Order cancelled*

### 🔁 Sous-processus
- **`zalando.payment`** → Vérification du paiement (accepté/refusé)  
- **`zalando.fulfillment`** → Préparation de la commande en entrepôt  
- **`zalando.delivery`** → Livraison au client final  

---

## 🧰 Prérequis

- [Camunda Modeler 5+](https://camunda.com/download/modeler/)
- [Camunda 8 SaaS](https://camunda.io/)
- Python 3.10+
- Bibliothèque [`pyzeebe`](https://pypi.org/project/pyzeebe/) pour les workers

---

## ⚙️ Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/<votre-utilisateur>/zalando-bpms-project.git
cd zalando-bpms-project
2️⃣ Installer les dépendances Python
pip install pyzeebe

3️⃣ Créer un fichier .env

Crée un fichier .env à la racine du projet avec tes identifiants Camunda :

ZEEBE_CLIENT_ID=<ton_client_id>
ZEEBE_CLIENT_SECRET=<ton_client_secret>
ZEEBE_CLUSTER_ID=<ton_cluster_id>
ZEEBE_REGION=bru-2

🚀 Lancer le worker de paiement

Dans le dossier du projet :

python workers/payment_worker.py


Ce script :

Écoute les tâches de type payment-request-service

Simule un statut de paiement (APPROVED ou DECLINED)

Renvoie la variable paymentStatus à Camunda

Fait avancer le token vers Fulfillment ou Cancel

🧩 Intégration Camunda
Élément	Type	Détails
Create Order	Tâche utilisateur	Formulaire CreateOrderForm.form
Send payment request	Tâche de service	Type = payment-request-service
Subprocesses	BPMN	Déployés séparément (payment, fulfillment, delivery)
📈 Visualisation du processus

(Ajoute un export PNG depuis ton Modeler ici)

👥 Auteurs

Alexis Jordan
Romain Mariotti

HES-SO Valais / Wallis — Filière Informatique
🎓 BPMS Project – Zalando Simulation (Camunda 8)
