import React from 'react';

import { observer } from 'mobx-react-lite';

import { useStores } from '../../hooks/useStores'

import { History } from "history";

import SearchForm from '../../components/SearchForm'

interface IProps {
  history: History
}



const Home: React.FunctionComponent<IProps> = ( { history } ) => {

  const { resultsStore } = useStores()

  const handleFormSubmit = () => {
    history.push({
      pathname: '/results',
      search: `?keyword=${resultsStore.keyword}`
    })
  }
  


  return (
    <main className="home">
      <section className="container mx-auto">
        <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center md:max-w-screen-md mx-auto">
          <h3 className="text-3xl mb-6">Search for movies and TV shows</h3>
          <SearchForm submitHandler={() => handleFormSubmit() } cssClasses={`mx-auto`} />
        </div>
      </section>
    </main>
  )

};

export default observer(Home);