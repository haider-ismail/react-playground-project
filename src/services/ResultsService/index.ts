import _get from "lodash/get";
import axios from "axios";

export const fetchResults = async (keyword: string = "") => {
  try {
    // const response = await axios.get(`http://localhost:3001/api/v1/movies/${keyword}`);
    // const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}`);

    const response = await fetch(`/api/graphql?keyword=${keyword}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      // body: JSON.stringify({
      //   query: `
      //   { 
      //     jobs(Keyword: "${keyword}") { id, title, url, description, website, updated, image } 
      //   }
      // `
      // })
    })
      // .then(r => {
      //   console.log('r:', r);
      //   return r.json() 
      // })
      // .then(data => data);

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

    console.log("fetchResults: res:", response);

    return response;
  } catch (e) {
    console.log('[fetchResults] --> catch:', e);
  }
};

export const fetchFullProgrammeDetails = async (id: string | null = null) => {
  if (!id) {
    return;
  }

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=6f575f76&&i=${id}`
    );

    if (_get(response, "data")) {
      return _get(response, "data");
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
