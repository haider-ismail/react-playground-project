import React from 'react';

// Components
import SearchForm from '../../components/SearchForm'

const Home: React.FunctionComponent = () => (
  <main>
    <section className="container mx-auto">
      <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center md:max-w-screen-md mx-auto">
        <h3 className="text-3xl mb-6">Search for movies and TV shows</h3>
        <SearchForm submitHandler={() => {}} cssClasses={`mx-auto`} />
      </div>
    </section>
  </main>
)

export default Home;