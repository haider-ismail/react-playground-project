const fetch = require('node-fetch');
const express = require('express');
const { Router } = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { format, isBefore, isAfter, subDays } = require('date-fns');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
require('dotenv').config();

const app = express();
const router = Router();

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

// Setting up custom endpoint to retrieve movies
// router.get('/api/v1/jobs/:keyword', async (req, res) => {
//   console.log('req.params', req.params);
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   console.log('custom endpint');
//   if (req.params.keyword) {
//     const data = await fetchData(req.params.keyword);
//     // return setTimeout(() => {
//     return res.end(JSON.stringify(data));
//     // }, 5000)
//   }

//   res.end(JSON.stringify({ message: 'Error' }));
// });

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
  // origin: 'https://workable-contracts.netlify.app',
  origin: '*',
};

// changed from app.use('/api/graphql)
router.get(
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
  const MAX_DAYS_OLD = 60;
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

// app.listen(3001);

app.use("/api/", router);

export const handler = serverless(app);