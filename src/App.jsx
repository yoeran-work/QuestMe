import { useState } from 'react'

const starterQuests = [
  {
    id: 1,
    title: '2 liter water drinken',
    icon: '💧',
    xp: 50,
    y: 25,
  },
  {
    id: 2,
    title: 'Mijn stappen halen',
    icon: '🚶',
    xp: 75,
    y: 30,
  },
  {
    id: 3,
    title: 'Haargroeispray gebruiken',
    icon: '💇',
    xp: 15,
    y: 5,
  },
  {
    id: 4,
    title: 'Naar de sportschool',
    icon: '🏋️',
    xp: 150,
    y: 100,
  },
  {
    id: 5,
    title: 'Kamer opruimen',
    icon: '🧹',
    xp: 300,
    y: 250,
  },
]

function App() {
  const [xp, setXp] = useState(12450)
  const [yBucks, setYBucks] = useState(1275)
  const [completedQuests, setCompletedQuests] = useState([])

  const level = Math.floor(xp / 1000) + 1
  const currentLevelXp = xp % 1000
  const xpToNextLevel = 1000
  const progress = (currentLevelXp / xpToNextLevel) * 100

  const completeQuest = (quest) => {
    if (completedQuests.includes(quest.id)) {
      return
    }

    setXp((currentXp) => currentXp + quest.xp)
    setYBucks((currentY) => currentY + quest.y)
    setCompletedQuests((current) => [...current, quest.id])
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">⚔️</div>
          <div>
            <h1>QuestMe</h1>
            <span>Real life. RPG rules.</span>
          </div>
        </div>

        <div className="wallet">
          <span className="wallet-icon">🪙</span>
          <strong>{yBucks.toLocaleString('nl-NL')}</strong>
          <span>Y</span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div>
            <p className="eyebrow">WELCOME BACK, HERO</p>
            <h2>Time to complete<br />some quests.</h2>
            <p className="hero-text">
              Kleine keuzes. Grote progressie.
            </p>
          </div>

          <div className="hero-level">
            <span>LEVEL</span>
            <strong>{level}</strong>
          </div>
        </section>

        <section className="progress-card">
          <div className="progress-header">
            <div>
              <span className="card-label">CHARACTER XP</span>
              <div className="xp-value">
                {xp.toLocaleString('nl-NL')} <small>XP</small>
              </div>
            </div>

            <div className="next-level">
              <span>Next level</span>
              <strong>{1000 - currentLevelXp} XP</strong>
            </div>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-footer">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TODAY</p>
              <h3>Daily Quests</h3>
            </div>

            <span className="quest-count">
              {completedQuests.length}/{starterQuests.length}
            </span>
          </div>

          <div className="quest-list">
            {starterQuests.map((quest) => {
              const completed = completedQuests.includes(quest.id)

              return (
                <article
                  className={`quest-card ${completed ? 'completed' : ''}`}
                  key={quest.id}
                >
                  <div className="quest-icon">
                    {quest.icon}
                  </div>

                  <div className="quest-info">
                    <h4>{quest.title}</h4>
                    <div className="quest-rewards">
                      <span>⭐ +{quest.xp} XP</span>
                      <span>🪙 +{quest.y} Y</span>
                    </div>
                  </div>

                  <button
                    className="complete-button"
                    onClick={() => completeQuest(quest)}
                    disabled={completed}
                  >
                    {completed ? '✓ Done' : 'Complete'}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        <section className="feature-grid">
          <div className="feature-card">
            <span>🏪</span>
            <div>
              <strong>Store</strong>
              <p>Spend your Y-bucks on rewards.</p>
            </div>
            <small>COMING SOON</small>
          </div>

          <div className="feature-card">
            <span>🎒</span>
            <div>
              <strong>Inventory</strong>
              <p>Your purchased rewards.</p>
            </div>
            <small>COMING SOON</small>
          </div>

          <div className="feature-card">
            <span>📊</span>
            <div>
              <strong>Statistics</strong>
              <p>See how your character grows.</p>
            </div>
            <small>COMING SOON</small>
          </div>
        </section>
      </main>

      <footer>
        <span>QuestMe</span>
        <span>Build 0.1.0</span>
      </footer>
    </div>
  )
}

export default App
