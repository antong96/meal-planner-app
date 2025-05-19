import { useState } from 'react';

function MealPlanner() {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ day: '', meal: '', recipe: '' });

  const handleAddMeal = () => {
    if (newMeal.day && newMeal.meal && newMeal.recipe) {
      setMeals([...meals, newMeal]);
      setNewMeal({ day: '', meal: '', recipe: '' });
    }
  };

  return (
    <div className="meal-planner-container">
      <div className="add-meal-form">
        <h3>Bæta við máltíð</h3>
        <select 
          value={newMeal.day} 
          onChange={(e) => setNewMeal({...newMeal, day: e.target.value})}
        >
          <option value="">Veldu dag</option>
          <option value="Mánudagur">Mánudagur</option>
          <option value="Þriðjudagur">Þriðjudagur</option>
          <option value="Miðvikudagur">Miðvikudagur</option>
          <option value="Fimmtudagur">Fimmtudagur</option>
          <option value="Föstudagur">Föstudagur</option>
          <option value="Laugardagur">Laugardagur</option>
          <option value="Sunnudagur">Sunnudagur</option>
        </select>

        <select 
          value={newMeal.meal} 
          onChange={(e) => setNewMeal({...newMeal, meal: e.target.value})}
        >
          <option value="">Veldu máltíð</option>
          <option value="Morgunmatur">Morgunmatur</option>
          <option value="Hádegismatur">Hádegismatur</option>
          <option value="Kvöldmatur">Kvöldmatur</option>
        </select>

        <input
          type="text"
          placeholder="Uppskrift"
          value={newMeal.recipe}
          onChange={(e) => setNewMeal({...newMeal, recipe: e.target.value})}
        />

        <button onClick={handleAddMeal}>Bæta við</button>
      </div>

      <div className="meal-list">
        <h3>Mataræðisáætlun</h3>
        {meals.length === 0 ? (
          <p>Engin máltíð bætt við enn</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Dagur</th>
                <th>Máltíð</th>
                <th>Uppskrift</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.day}</td>
                  <td>{meal.meal}</td>
                  <td>{meal.recipe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MealPlanner; 