const fetch = require('node-fetch');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { format, isBefore, isAfter, subDays } = require('date-fns');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
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
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjA1NTEwMDMxMF5BMl5BanBnXkFtZTgwODkzMzI0MjE@._V1_SX300.jpg',
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
      resolve: () => (jobs, args) => jobs.find((job) => job.title.includes(args.title) || job.title === args.title),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

var corsOptions = {
  origin: 'https://workable-contracts.netlify.app',
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

const makeApiCallWithBackoff = async (keyword, index, exponentialTimeoutIndex = 0) => {
  const waitTime = exponentialTimeoutIndex * 25; 

  return new Promise((resolve) => {
    setTimeout(async() => {
      const response = await fetch(
        `https://jobs.workable.com/api/v1/jobs?query=${keyword}&location=united%20kingdom&offset=${index +
          1}0`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json();
      resolve(data);
    }, waitTime);
  })
}

const fetchData = async (keyword = null) => {
  const MAX_DAYS_OLD = 14;
  const RESULTS_PER_PAGE = 10;
  let data = {
    Search: [],
    totalItems: 0
  };
  let exponentialTimeoutIndex = 0

  const initialReq = await makeApiCallWithBackoff(keyword, 0, exponentialTimeoutIndex)
  if (initialReq?.totalSize) {
    data.totalItems = initialReq?.totalSize

    const totalPages = data?.totalItems / RESULTS_PER_PAGE

    console.log('totalPages:', totalPages);

    // Loop over certain number of pages to get more results than the API allows at any one time
    for (let index = 0; index <= totalPages; index++) {
      exponentialTimeoutIndex = exponentialTimeoutIndex >= 50 ? 0 : exponentialTimeoutIndex
      exponentialTimeoutIndex++

      try {
      
        console.log('for: index:', index, 'totalItems:', data.totalItems);
        const workableResponse = await makeApiCallWithBackoff(keyword, index, exponentialTimeoutIndex)

        if (workableResponse?.error === 'rate_limit') break;
        if (workableResponse?.error === 'rate_limit') console.error('workable ERROR:', workableResponse?.error)

        if (workableResponse?.jobs) data.Search = [...data.Search, ...workableResponse.jobs];
        // if (!data?.totalItems) data.totalItems = workableResponse?.totalSize

        if (index + 1 > data?.totalItems || data?.totalItems === 0) break;
      } catch (error) {}
    }
  } 

  // console.log('data.Search:', data.Search);
  data.Search = data.Search.filter(
    (_) => (_.employmentType === 'Contract' || _.description.includes('contract') || _.description.includes('freelance')) && isAfter(new Date(_.updated), subDays(new Date(), MAX_DAYS_OLD))
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

export const handler = serverless(app);