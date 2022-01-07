const fetch = require('node-fetch');
const express = require('express');
const app = express();
require('dotenv').config();

// Setting up custom endpoint to retrieve movies
app.get('/api/v1/movies/:keyword', async (req, res) => {
  console.log('req.params', req.params)
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  if (req.params.keyword) {
    const data = await fetchData(req.params.keyword)

    return res.end(JSON.stringify(data));
  } 

  res.end(JSON.stringify({ message: 'Error' }));
})

app.listen(3001)

const fetchData = async (keyword = null) => {
  const pages = 10
  let data = {
    Search: []
  }

  // Loop over certain number of pages to get more results than the API allows at any one time
  for (let index = 0; index < pages; index++) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}&page=${index+1}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(response => response)

      if (index === 0 && !response.Search) {
        data.Error = response
        break
      }

      data.Search = [...data.Search, ...response.Search]
    } catch (error) { }
  }

  return data
  
}