import React, { FormEvent, useState } from 'react';
import { History } from "history";

interface IProps {
  history: History
}

const Home: React.FC<IProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFormSubmit = (e: FormEvent) => {
    if (e) e.preventDefault()

    history.push({
      pathname: '/results',
      search: `?keyword=${searchTerm}`
    })
  }

  return (
    <main className="home">
      <section className="container mx-auto">
        <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center md:max-w-screen-md mx-auto">
          <h3 className="text-3xl mb-6">Search for movies and TV shows</h3>

          <form className="flex justify-center" onSubmit={handleFormSubmit}>
            <input onChange={ (e) => setSearchTerm(e.target.value) } className="md:w-80 border-white border-2 p-4" type="search" placeholder="Enter keywords or IMDB ID's"  />

            <button type="submit" className="bg-white p-4 text-black">Search</button>
          </form>      
        </div>
      </section>
    </main>
  )
};

export default Home;