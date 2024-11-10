const express = require('express');
const bodyParser = require('body-parser');
const db = require('./DB/database');
const dotenv = require('dotenv');
const cors = require('cors');
const NodeCache = require('node-cache');
const { getCache, setCache } = require('./Redis/cacheRedis.js');

const app = express();
const cache = new NodeCache({ stdTTL: 15 });
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const PORT = 5000;

const getFilmByName = async (req, res) => {
  try {
    console.log(req.params.filmName);
    const filmName = req.params.filmName.replaceAll('_', ' ');

    const cachedData = cache.get(filmName);

    if (cachedData) {
      console.log('requested to node cache');
      res.json({ data: cachedData });
      return res;
    }

    const cacheRedisData = await getCache(filmName);

    if (cacheRedisData) {
      console.log('requested to redis cache');
      res.json({ data: cacheRedisData });
      return res;
    }

    const response = {};

    requestToDB(filmName)
      .then((filmData) => {
        cache.set(filmName, filmData.rows);
        setCache(filmName, filmData.rows, 30);
        console.log('requested to db');
        res.json({ data: filmData.rows });
      })
      .catch((error) => {
        res.status(500).json({ errorType: 'Internal Server Error', errorMessadge: error });
      });
  } catch (error) {
    res.status(500).json({ errorType: 'Internal Server Error', errorMessadge: error });
  }
};

function requestToDB(filmName) {
  console.log('fetch from db');
  const result = db.query('SELECT * FROM film WHERE title = $1', [filmName]);
  return result;
}

app.get('/films/:filmName', (req, res) => getFilmByName(req, res));

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
