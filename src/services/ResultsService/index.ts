import { get } from 'lodash'
import axios from 'axios'


export const fetchResults = async (keyword: string = '') => {
  try {
    // const response = await axios.get(`http://localhost:3001/api/v1/movies/${keyword}`);
    // const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}`);

    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: `
        { 
          movies(Keyword: "${keyword}") { Title, Poster, imdbID } 
        }
      `})
    })
      .then(r => r.json())
      .then(data => data)
      
    //   axios.post('http://localhost:3001/graphql', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    //   body: JSON.stringify({query: `
    //     { 
    //       movies(Keyword: "${keyword}") { Title } 
    //     }
    //   `})
    // })
    
    return response
  } catch (e) {
    console.error(e);
  }
}

export const fetchFullProgrammeDetails = async (id: string|null = null) => {
  if (!id) return

  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=6f575f76&&i=${id}`)
    
    if (get(response, 'data')) return get(response, 'data')
    return null
  } catch (e) {
    console.error(e)
    return null
  }
}