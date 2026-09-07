# 🎮 QuestMe

> Maak van verstandige keuzes een RPG.

QuestMe is een persoonlijke gamification-app waarin je jezelf **quests** geeft voor verstandige keuzes.

Iedere quest kan twee soorten beloningen opleveren:

- ⭐ **XP** — permanente character progression
- 🪙 **Y-bucks** — spendable in-game currency

Y-bucks kunnen later in de Store worden gebruikt om rewards te kopen. Gekochte rewards komen in de Inventory terecht en kunnen vervolgens worden **Consumed** wanneer je de echte beloning gebruikt.

---

# 🚀 Project

QuestMe wordt gebouwd met:

- React
- Vite
- JavaScript / JSX
- CSS
- GitHub Actions
- GitHub Pages
- Firebase / Firestore (later)

De app wordt ontwikkeld zonder lokale terminal-workflow.

De broncode wordt via de GitHub-webinterface geüpload. GitHub Actions verzorgt vervolgens automatisch de build en deployment.

---

# 📁 Repository

De repository krijgt uiteindelijk ongeveer deze structuur:

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

Later komen hier vanzelf meer bestanden en mappen bij.

---

# 🌐 GitHub Pages

QuestMe wordt gehost op GitHub Pages.

De deployment werkt als volgt:

    Jij uploadt/wijzigt bestanden
             ↓
        GitHub repository
             ↓
        GitHub Actions
             ↓
          npm install
             ↓
          Vite build
             ↓
          productie-build
             ↓
        GitHub Pages
             ↓
          QuestMe

Er is geen Vercel nodig.

---

# ⚙️ GitHub Actions

De workflow staat in:

    .github/workflows/deploy.yml

Iedere push naar de `main` branch start automatisch een deployment.

De workflow:

1. haalt de repository op
2. start Node.js
3. installeert de dependencies
4. voert `npm run build` uit
5. maakt de productieversie
6. publiceert deze naar GitHub Pages

---

# 📤 Bestanden uploaden

Bestanden kunnen via de GitHub-webinterface worden toegevoegd.

Gebruik:

**Add file → Upload files**

Bestanden moeten hun mapstructuur behouden.

Bijvoorbeeld:

    src/App.jsx

moet in:

    src/App.jsx

terechtkomen en niet als:

    App.jsx

in de root van de repository.

---

# 🎮 Het concept

QuestMe maakt van dagelijkse verstandige keuzes een RPG.

De basisgedachte:

    Quest
      ↓
    Voltooien
      ↓
    XP + Y-bucks
      ↓
    XP → Level
    Y  → Wallet
      ↓
    Y → Store
      ↓
    Reward → Inventory
      ↓
    Consume
      ↓
    Consumed History

---

# ⭐ XP

XP is de permanente progressie van de speler.

XP wordt nooit uitgegeven.

Voorbeeld:

    Quest: 8.000 stappen

    +75 XP
    +30 Y

De speler houdt de 75 XP permanent.

XP bepaalt het level.

Bijvoorbeeld:

    LEVEL 12

    ██████████████░░░░░░

    1.450 / 2.000 XP

Wanneer een reward wordt gekocht, verandert de XP niet.

---

# 🪙 Y-bucks

Y-bucks zijn de in-game valuta.

De naam is afgeleid van de voornaam van de speler.

Voorbeeld:

    🪙 1.275 Y

Iedere quest kan zowel XP als Y-bucks opleveren.

Bijvoorbeeld:

    💧 2 liter water drinken

    +50 XP
    +25 Y

Y-bucks kunnen later worden uitgegeven in de Store.

---

# ⚔️ Quests

De speler maakt uiteindelijk zelf zijn quests.

Een quest bevat onder andere:

- naam
- beschrijving
- categorie
- type
- XP-beloning
- Y-bucks-beloning
- moeilijkheid
- actieve/inactieve status

Voorbeeld:

    🚶 8.000 stappen

    Categorie:
    Gezondheid

    Type:
    Dagelijks

    XP:
    75

    Y-bucks:
    30

---

# 🔄 Quest types

QuestMe moet uiteindelijk verschillende soorten quests ondersteunen.

## Daily

Dagelijkse quests.

Voorbeelden:

    💧 Water drinken
    🚶 Stappen halen
    💇 Haargroeispray gebruiken

## Weekly

Quests die bijvoorbeeld meerdere keren per week voltooid moeten worden.

Voorbeeld:

    🏋️ 3x sporten deze week

## One-time

Eenmalige quests.

Voorbeelden:

    🧹 Kamer opruimen
    🏍️ Motoronderhoud uitvoeren

Meer questtypes kunnen later worden toegevoegd.

---

# 🏆 Quest rewards

Elke quest kan afzonderlijk instellen hoeveel XP en Y-bucks hij oplevert.

Voorbeeld:

    Quest:
    🧹 Kamer opruimen

    XP:
    300

    Y-bucks:
    250

Een kleine dagelijkse gewoonte kan bijvoorbeeld veel minder opleveren:

    Quest:
    💇 Haargroeispray

    XP:
    15

    Y-bucks:
    5

De speler bepaalt zelf de beloningen.

---

# 🏪 Store

De Store bevat rewards die met Y-bucks gekocht kunnen worden.

Voorbeelden:

    🍫 Chocoladereep
    150 Y

    ☕ Koffie halen
    250 Y

    🎮 Gaming Hour
    500 Y

    🍕 Pizza bestellen
    1.000 Y

    🏍️ Motorbudget
    2.500 Y

In eerste instantie is de Store alleen een intern beloningssysteem.

Later kan dit eventueel gekoppeld worden aan echte beloningen.

---

# 🎒 Inventory

Wanneer een reward wordt gekocht:

    STORE
      ↓
    PURCHASE
      ↓
    INVENTORY

Een gekochte reward komt in de actieve Inventory.

Voorbeeld:

    🎒 INVENTORY

    🍕 Pizza ×1
    🎮 Gaming Hour ×2
    ☕ Koffie ×3

Een gekocht item blijft beschikbaar totdat de speler het daadwerkelijk gebruikt.

---

# ☑️ Consume

Een belangrijk onderscheid:

    PURCHASED ≠ CONSUMED

Een reward wordt dus niet automatisch als gebruikt beschouwd zodra hij gekocht wordt.

Voorbeeld:

    Pizza gekocht
         ↓
    Pizza staat in Inventory
         ↓
    Pizza daadwerkelijk gegeten
         ↓
    Consume
         ↓
    Pizza uit actieve Inventory
         ↓
    Pizza naar Consumed History

Het Engelse woord dat we hiervoor gebruiken is:

**Consume**

---

# 📜 Purchase History

Aankopen worden afzonderlijk opgeslagen.

Voorbeeld:

    PURCHASE HISTORY

    🍕 Pizza
    1 september
    1.000 Y

    🎮 Gaming Hour
    3 september
    500 Y

Een purchase blijft historisch bestaan, ook wanneer de reward later wordt consumed.

---

# 📜 Consumed History

Wanneer een reward wordt consumed, wordt dat als afzonderlijke gebeurtenis opgeslagen.

Voorbeeld:

    CONSUMED HISTORY

    🍕 Pizza
    2 september

    🎮 Gaming Hour
    4 september

Hierdoor kunnen Purchase en Consume onafhankelijk van elkaar worden geanalyseerd.

---

# 📊 Statistieken

Statistieken worden later toegevoegd.

Mogelijke statistieken:

- totale XP verdiend
- huidige level
- totale Y-bucks verdiend
- totale Y-bucks uitgegeven
- aantal voltooide quests
- aantal gekochte rewards
- aantal consumed rewards
- dagelijkse activiteit
- wekelijkse activiteit
- streaks
- XP per dag
- XP per week
- Y-bucks per dag
- Y-bucks per week

Het datamodel wordt vanaf het begin ontworpen zodat historische gegevens later gebruikt kunnen worden.

---

# 🔥 Streaks

Streaks worden later toegevoegd.

Voorbeeld:

    💧 Water

    🔥 14 dagen streak

Streaks moeten motiveren en niet bestraffen.

Een gemiste dag mag daarom niet automatisch alle progressie vernietigen.

---

# 🏆 Achievements

Achievements worden later toegevoegd.

Voorbeelden:

    🏆 First Quest
    Voltooi je eerste quest.

    🏆 Week Warrior
    Voltooi quests op 7 verschillende dagen.

    🏆 Hydrated
    Voltooi je water-quest 30 keer.

    🏆 Veteran
    Bereik level 10.

---

# 🗃️ Dataopslag

De eerste pilot gebruikt lokale data.

Later wordt Firebase toegevoegd.

Gepland:

    Firebase
       ↓
    Firestore

Het uiteindelijke conceptuele datamodel:

    PLAYER
    │
    ├── profile
    │   ├── totalXP
    │   └── yBucks
    │
    ├── quests
    │   └── quest definitions
    │
    ├── questCompletions
    │   └── completion history
    │
    ├── rewards
    │   └── store definitions
    │
    ├── purchases
    │   └── purchased rewards
    │
    └── consumedRewards
        └── consumed rewards

Dit is een conceptueel model. De daadwerkelijke Firestore-structuur wordt later samen vastgesteld.

---

# 🔐 Firebase

Firebase wordt pas toegevoegd wanneer de basisfunctionaliteit goed werkt.

Mogelijke Firebase-functionaliteit:

- Firestore
- Authentication
- Security Rules
- synchronisatie tussen apparaten

Voor de eerste pilot is één speler voldoende.

---

# 📱 PWA

QuestMe wordt uiteindelijk een Progressive Web App.

Het doel is dat QuestMe op telefoon, tablet en desktop gebruikt kan worden alsof het een normale app is.

---

# 🧠 Ontwerpprincipes

QuestMe moet:

1. leuk zijn
2. motiveren
3. overzichtelijk blijven
4. niet voelen als een strafsysteem
5. makkelijk uitbreidbaar zijn
6. historische gegevens niet onnodig vernietigen

Belangrijk:

    XP
    ↓
    Progression
    ↓
    Level

    Y-bucks
    ↓
    Currency
    ↓
    Store
    ↓
    Rewards

---

# 🔒 Historische gegevens

We willen gebeurtenissen niet onnodig overschrijven.

Bijvoorbeeld:

    Quest completed
         ↓
    Completion event

    Reward purchased
         ↓
    Purchase event

    Reward consumed
         ↓
    Consume event

Hierdoor kunnen later statistieken worden berekend op basis van echte historische gebeurtenissen.

---

# 📈 Terugwerkende statistieken

Terugwerkende statistieken zijn bewust onderdeel van het ontwerp.

Als we bijvoorbeeld later besluiten dat we willen weten:

    "Hoeveel XP heb ik in augustus verdiend?"

dan moet die informatie uit historische quest completions kunnen worden berekend.

Dit hoeft in de pilot nog niet zichtbaar te zijn.

---

# 🛣️ Roadmap

## Phase 0 — Infrastructure

- [x] Projectstructuur bepalen
- [x] React
- [x] Vite
- [x] GitHub Actions workflow
- [x] GitHub Pages configuratie
- [ ] Eerste deployment testen

## Phase 1 — Core Game

- [ ] Dashboard
- [ ] XP
- [ ] Levels
- [ ] XP progress bar
- [ ] Y-bucks
- [ ] Wallet
- [ ] Quest completion

## Phase 2 — Quest Management

- [ ] Quest toevoegen
- [ ] Quest bewerken
- [ ] Quest verwijderen
- [ ] XP instellen
- [ ] Y-bucks instellen
- [ ] Categorieën
- [ ] Daily quests
- [ ] Weekly quests
- [ ] One-time quests
- [ ] Quest moeilijkheid

## Phase 3 — Local Persistence

- [ ] Lokale opslag
- [ ] Quest completion history
- [ ] Persistente XP
- [ ] Persistente Y-bucks
- [ ] Dagelijkse reset
- [ ] Quest history

## Phase 4 — Store

- [ ] Rewards toevoegen
- [ ] Store
- [ ] Rewards kopen
- [ ] Y-bucks afschrijven
- [ ] Inventory
- [ ] Purchase history

## Phase 5 — Reward Lifecycle

- [ ] Consume
- [ ] Consumed history
- [ ] Inventory management
- [ ] Purchase/Consume timestamps

## Phase 6 — Firebase

- [ ] Firestore
- [ ] Datamodel implementeren
- [ ] Data synchroniseren
- [ ] Authentication
- [ ] Security Rules

## Phase 7 — Gameification

- [ ] Streaks
- [ ] Achievements
- [ ] Levelnamen
- [ ] Animaties
- [ ] Statistieken
- [ ] Grafieken
- [ ] Kalender

## Phase 8 — Integrations

- [ ] Automatische stappen
- [ ] Mogelijke activity/health-integraties
- [ ] Automatische quest-validatie

---

# 🧪 Pilot 0.1

De eerste pilot hoeft nog niet compleet te zijn.

Het doel van de eerste versie is controleren of de basis-game-loop goed voelt:

    QUEST
      ↓
    COMPLETE
      ↓
    +XP
    +Y
      ↓
    XP → LEVEL
    Y  → WALLET

Daarna kunnen we de Store en Inventory toevoegen.

---

# 🏷️ Werknaam

De huidige werknaam is:

**QuestMe**

Deze naam is niet definitief.

De naam kan later zonder problemen worden gewijzigd.

---

# 📌 Current Status

**Pilot 0.1 — Initial project setup**

Eerste doel:

1. Repository aanmaken.
2. Bestanden uploaden.
3. GitHub Pages instellen.
4. GitHub Actions laten bouwen.
5. Eerste versie online krijgen.
6. Daarna de Quest Manager bouwen.

---

# 🧑‍💻 Development workflow

QuestMe wordt samen ontwikkeld.

De gebruiker werkt voornamelijk via de GitHub-webinterface.

Nieuwe versies worden aangeleverd als losse bestanden.

Bestanden kunnen lokaal worden bewaard in afzonderlijke documenten en vervolgens als batch naar GitHub worden geüpload.

Er wordt niet uitgegaan van een lokale terminal-workflow.

---

# 🎯 Golden Rule

We bouwen niet meteen alles.

Iedere grote feature moet eerst:

1. ontworpen worden
2. gebouwd worden
3. getest worden
4. gecontroleerd worden
5. pas daarna onderdeel worden van de volgende laag

Zo blijft QuestMe uitbreidbaar en overzichtelijk.
