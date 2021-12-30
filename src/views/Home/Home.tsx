import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';
import ResultStore from '../../stores/resultsStore';

import { History } from "history";

import SearchForm from '../../components/SearchForm'

interface IProps {
  resultsStore: ResultStore;
  history: History
}

class Home extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    console.log('constructor')
  }

  handleFormSubmit = () => {
    const { history, resultsStore } = this.props;

    console.log('[handleFormSubmit] -->');
    
    history.push({
      pathname: '/results',
      search: `?keyword=${resultsStore.keyword}`
    })
  }
  
  UNSAFE_componentDidMount() {    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    console.log(`[UNSAFE_componentDidMount]-->`);
    
  }


  render() {
    return (
      <main className="home">
        <section className="container mx-auto">
          <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center md:max-w-screen-md mx-auto">
            <h3 className="text-3xl mb-6">Search for movies and TV shows</h3>
            <SearchForm submitHandler={() => this.handleFormSubmit() } cssClasses={`mx-auto`} />
          </div>
        </section>
      </main>
    )
  }
};

export default inject('resultsStore', 'uiStore')(observer(Home));