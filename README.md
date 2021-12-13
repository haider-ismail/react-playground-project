## Hello world!
I'm Haider, a front-end developer residing in Birmingham, UK.

Welcome to my React playground, which I created to experiment with the latest React features, including the features released in React 18 beta! Feel free to clone, break and experiment with it yourself! 

### Prerequisites
- [Yarn](https://yarnpkg.com/en/docs/install)

### Installation
If you don't already have yarn installed, install using the above link.

Install dependencies in the root of the project

`yarn`

Once dependancies are installed, run

`yarn start`

Runs on port :3000 (http://localhost:3000)

#### Creating and adding API for OMDAPI

- In order to make requests to the movie database service http://www.omdbapi.com/, you will need to first create an API key at http://www.omdbapi.com/
- Once you have the API key, copy the `sample.env` file and rename it to `.env` and add the API key for ENV variable `REACT_APP_OMDB_API_KEY`

That's it! :)


### Examples of ReactJs features used in components:

#### Portals ([Docs](https://reactjs.org/docs/portals.html))
-  `<Modal />` [Go to file](./src/components/Modal/Modal.tsx)


#### useEffect hook ([Docs](https://reactjs.org/docs/hooks-reference.html#useeffect))
- `<Header />` [Go to file](./src/components/Header/Header.tsx)

#### React.lazy & React.Suspense ([Docs](https://reactjs.org/docs/react-api.html#reactlazy))
- `<Results />` [Go to file](./src/views/Results/Results.tsx)

### Context ([Docs](https://reactjs.org/docs/context.html))
