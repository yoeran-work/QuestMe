# 🎮 QuestMe

> Maak van verstandige keuzes een RPG.

QuestMe is een persoonlijke gamification-app waarin je jezelf **quests** geeft voor verstandige keuzes.

Iedere quest kan twee soorten beloningen opleveren:

- ⭐ **XP** — permanente character progression
- 🪙 **Y-bucks** — spendable in-game currency

Y-bucks kunnen later in de Store worden gebruikt om rewards te kopen. Gekochte rewards komen in de Inventory terecht en kunnen vervolgens worden **Consumed** wanneer je de echte beloning gebruikt.

---

# 🚀 Project opzetten

QuestMe gebruikt:

- React
- Vite
- GitHub Actions
- GitHub Pages
- Firebase (later)
- Firestore (later)

Je hoeft voor dit project lokaal geen Node.js, npm, Vite of Git te installeren.

De GitHub Actions workflow bouwt de applicatie voor ons.

---

# 📁 Repository aanmaken

Maak op GitHub een nieuwe repository.

Aanbevolen naam:

`QuestMe`

Gebruik voorlopig:

- **Public repository**
- Geen README automatisch toevoegen
- Geen `.gitignore` automatisch toevoegen
- Geen license automatisch toevoegen

Daarna kunnen de projectbestanden handmatig worden geüpload.

---

# 📂 Bestandsstructuur

De repository moet uiteindelijk ongeveer deze structuur hebben:

```text
QuestMe/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
