import React, { FormEvent, MouseEvent, useState } from 'react';
import { History, LocationState } from "history";

interface IProps {
  history: History
}

const Home: React.FC<IProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFormSubmit = (e: FormEvent) => {
    if (e) e.preventDefault()

    history.push({
      pathname: '/results',
      search: `?q=${searchTerm}`
    })
  }

  return (
    <main className="home">
      <section className="container mx-auto">
        <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
          <h3 className="text-3xl mb-6">Search for movies and TV shows</h3>

          <form onSubmit={handleFormSubmit}>
            <input onChange={ (e) => setSearchTerm(e.target.value) } className="border-white border-2 p-4" type="search"  />

            <button type="submit" className="bg-white p-4 text-black">Search</button>
          </form>      
        </div>
      </section>
    </main>
  )
};

export default Home;