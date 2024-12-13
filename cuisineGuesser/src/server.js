import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors())

// Endpoint to fetch a random meal
app.get('/api/random-meal', async (req, res) => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    const meal = data.meals[0];

    // Skip meals where the area is unknown
    if (meal.strArea === 'Unknown') {
      return res.status(404).json({ error: 'Meal area is unknown, fetching skipped' });
    }

    res.json({
      image: meal.strMealThumb,
      country: meal.strArea,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random meal' });
  }
});

// Endpoint to fetch all country areas
app.get('/api/areas', async (req, res) => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data = await response.json();
    const areas = data.meals
      .map((area) => area.strArea)
      .filter((area) => area !== 'Unknown'); //When dynamically creating buttons, leave out "unknown". 
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
