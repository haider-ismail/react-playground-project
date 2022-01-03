import _get from 'lodash/get';
import axios from 'axios';


export const fetchResults = async (keyword: string = '') => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}`);
    // if (_get(response, 'data.Search')) {
    //   return _get(response, 'data.Search', []);
    //   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    //   // this.totalPages = Math.abs(<any>this.results.length / <any>this.perPage)
    // } else {
    //   if (_get(response, 'data.Error')) return _get(response, 'data.Error')
    //   return []
    // }
    return response
  } catch (e) {
    console.error(e);
  }
}

export const fetchRecommended = async () => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=christmas`)
    
    if (_get(response, 'data.Search')) {
      return _get(response, 'data.Search', [])        
    } else {
      return []
    }
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