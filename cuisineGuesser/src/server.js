import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;

const codeMap = {
  American: "us",
  British: "gb",
  Canadian: "ca",
  Chinese: "cn",
  Croatian: "hr",
  Dutch: "nl",
  Egyptian: "eg",
  Filipino: "ph",
  French: "fr",
  Greek: "gr",
  Indian: "in",
  Irish: "ie",
  Italian: "it",
  Jamaican: "jm",
  Japanese: "jp",
  Kenyan: "ke",
  Malaysian: "my",
  Mexican: "mx",
  Moroccan: "ma",
  Polish: "pl",
  Portuguese: "pt",
  Russian: "ru",
  Spanish: "es",
  Thai: "th",
  Tunisian: "tn",
  Turkish: "tr",
  Ukrainian: "ua",
  Vietnamese: "vn",
};
app.use(cors())

const getFlagUrl = (country) => {
  const code = codeMap[country];
  return code
    ? `https://flagcdn.com/w320/${code}.png`
    : "https://via.placeholder.com/100?text=Flag+Not+Found";
};

// New route to fetch a flag URL based on the country name
app.get('/api/flag', (req, res) => {
  const { country } = req.query;

  // Validate if the country parameter exists
  if (!country) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  // Generate the flag URL
  const flagUrl = getFlagUrl(country);

  res.json({
    country: country,
    flag: flagUrl
  });
});


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
      name: meal.strMeal
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
