import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
        const data = await response.json();
        setHealthStatus(data);
        setIsLoading(false);
      } catch (err) {
        setError('Villa kom upp við tengingu við þjónustuna');
        setIsLoading(false);
      }
    };

    checkBackendHealth();
  }, []);

  if (isLoading) {
    return <div>Hleð inn...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mataræðisáætlun</h1>
        {healthStatus && <p className="status">Þjónustan er virk: {healthStatus.status}</p>}
      </header>
      
      <main>
        <section className="meal-planner">
          <h2>Mataræðisáætlun</h2>
          <p>Hér kemur mataræðisáætlun þín</p>
        </section>

        <section className="recipes">
          <h2>Uppskriftir</h2>
          <p>Hér koma uppskriftirnar þínar</p>
        </section>

        <section className="shopping-list">
          <h2>Innkaupalisti</h2>
          <p>Hér kemur innkaupalistinn þinn</p>
        </section>
      </main>
    </div>
  );
}

export default App;
