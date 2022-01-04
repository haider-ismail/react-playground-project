import _get from 'lodash/get';
import axios from 'axios';


export const fetchResults = async (keyword: string = '') => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}`);
    return response
  } catch (e) {
    console.error(e);
  }
}

export const fetchRecommended = async () => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=christmas`)
    return response
  } catch (e) {
    console.error(e);
    return []
  }
}


export const fetchFullProgrammeDetails = async (id: string|null = null) => {
  if (!id) return

  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=6f575f76&&i=${id}`);
    
    if (_get(response, 'data')) {
      return _get(response, 'data')
    } else {
      return null
    }
  } catch (e) {
    console.error(e);
    return null
  }
}