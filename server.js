const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { format, isBefore, isAfter, subDays } = require('date-fns');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
require('dotenv').config();

const app = express();

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  description: 'This represents a movie',
  fields: () => ({
    Title: { type: new GraphQLNonNull(GraphQLString) },
    Poster: { type: GraphQLString },
    imdbID: { type: GraphQLString },
  }),
});

const JobType = new GraphQLObjectType({
  name: 'Job',
  description: 'This represents a job',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    website: { type: GraphQLString },
    url: { type: GraphQLString },
    updated: { type: GraphQLString },
    image: { type: GraphQLString },
  }),
});

// Dummy response
const movies = [
  {
    Title: 'Haider',
    Year: '2014',
    imdbID: 'tt3390572',
    Type: 'movie',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjA1NTEwMDMxMF5BMl5BanBnXkFtZTgwODkzMzI0MjE@._V1_SX300.jpg',
  },
  {
    Title: 'Haider lebt - 1. April 2021',
    Year: '2002',
    imdbID: 'tt0339098',
    Type: 'movie',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZTU4NDk1ODgtYjRmZC00OTU4LTk5ZDEtOTgxODUwMzRlNDNhXkEyXkFqcGdeQXVyMTQ0MzMwNQ@@._V1_SX300.jpg',
  },
  {
    Title: 'Catching Haider',
    Year: '2015',
    imdbID: 'tt4714240',
    Type: 'movie',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjg5NjlkZDktOTVlMS00YzEzLWE0MjItMjBhYTM2ZmZlYjBjXkEyXkFqcGdeQXVyNzEwMTEzMDY@._V1_SX300.jpg',
  },
  {
    Title: 'Haider Ali',
    Year: '1978',
    imdbID: 'tt0249562',
    Type: 'movie',
    Poster: 'N/A',
  },
  {
    Title: 'Von Haider zu Hader',
    Year: '2005',
    imdbID: 'tt2602674',
    Type: 'movie',
    Poster: 'N/A',
  },
  {
    Title: 'Haider',
    Year: '2016',
    imdbID: 'tt6262766',
    Type: 'movie',
    Poster:
      'https://ia.media-imdb.com/images/M/MV5BNDU1NjFiOWEtM2YzNy00ZTFiLTlhNjEtZjJkMGM4MjZjNzc5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNDI5NzUxODU@._V1_SX300.jpg',
  },
  {
    Title: 'Nishan e Haider: Captain Mohammad Sarwar Shaheed',
    Year: '1980',
    imdbID: 'tt9260976',
    Type: 'movie',
    Poster: 'N/A',
  },
  {
    Title: 'Jörg Haider - Der letzte Tag',
    Year: '2018',
    imdbID: 'tt11591570',
    Type: 'movie',
    Poster: 'N/A',
  },
  {
    Title: 'Jörg Haider - Politiker, Populist, Popstar',
    Year: '2009',
    imdbID: 'tt11698034',
    Type: 'movie',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZGEyMDYyY2QtNTJjMi00ODZkLTgwOTAtZDM2YjUzNjYxZjA0XkEyXkFqcGdeQXVyMjA2NzE1OQ@@._V1_SX300.jpg',
  },
  {
    Title: 'Haider Khan',
    Year: '2000',
    imdbID: 'tt14223648',
    Type: 'movie',
    Poster: 'N/A',
  },
  {
    Title: 'Haider Daler',
    Year: '1978',
    imdbID: 'tt14223656',
    Type: 'movie',
    Poster: 'N/A',
  },
  {
    Title: 'The Haider Rifaat Show',
    Year: '2016–2021',
    imdbID: 'tt15851822',
    Type: 'series',
    Poster: 'N/A',
  },
];

// Setting up custom endpoint to retrieve movies
app.get('/api/v1/jobs/:keyword', async (req, res) => {
  console.log('req.params', req.params);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  console.log('custom endpint');
  if (req.params.keyword) {
    const data = await fetchData(req.params.keyword);
    // return setTimeout(() => {
    return res.end(JSON.stringify(data));
    // }, 5000)
  }

  res.end(JSON.stringify({ message: 'Error' }));
});

// Construct a schema, using GraphQL schema language
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    jobs: {
      type: new GraphQLList(JobType),
      args: {
        Keyword: { type: GraphQLString },
      },
      description: 'List of jobs',
      resolve: async (parent, args) => await fetchData(args.Keyword),
    },
    job: {
      type: JobType,
      description: 'A single job item',
      args: {
        title: { type: GraphQLString },
      },
      resolve: () => (jobs, args) =>
        jobs.find(
          (job) => job.title.includes(args.title) || job.title === args.title
        ),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

var corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(
  '/graphql',
  cors(corsOptions),
  graphqlHTTP({
    schema: schema,
    rootValue: RootQueryType,
    graphiql: true,
  })
);

const fetchData = async (keyword = null) => {
  const pages = 50;
  let data = {
    Search: [],
  };

  // Loop over certain number of pages to get more results than the API allows at any one time
  for (let index = 0; index < pages; index++) {
    console.log('for: index:', index);
    try {
      const workableResponse = await fetch(
        `https://jobs.workable.com/api/v1/jobs?query=${keyword}&location=united%20kingdom&remote=false&offset=${index +
          1}0`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((response) => response);

      // const response = await fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}&page=${index+1}`, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // .then(response => response.json())
      // .then(response => response)

      // if (index === 0 && !response.Search) {
      //   data.Error = response
      //   break
      // }

      // data.Search = [...data.Search, ...response.Search]
      // console.log('workableResponse:', workableResponse);
      if (workableResponse?.jobs)
        data.Search = [...data.Search, ...workableResponse.jobs];
    } catch (error) {}
  }

  // console.log('data.Search:', data.Search);
  data.Search = data.Search.filter(
    (_) =>
      _.employmentType === 'Contract' &&
      isAfter(new Date(_.updated), subDays(new Date(), 30))
  ).sort((a, b) => {
    if (isBefore(new Date(a.updated), new Date(b.updated))) {
      return 1;
    }
    if (isAfter(new Date(a.updated), new Date(b.updated))) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  return data.Search;
};

app.listen(3001);
