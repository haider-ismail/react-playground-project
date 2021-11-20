import React, { Component, Suspense } from 'react';

import { inject, observer } from 'mobx-react';

import ResultStore from '../../stores/resultsStore';
import UIStore from '../../stores/uiStore';

import SearchListingHeader from '../../components/Search/SearchListingHeader';
import SearchListing from '../../components/Search/SearchListing';
import Modal from '../../components/Modal';

const SearchResultModalContent = React.lazy(() => import('../../components/Search/SearchResultModalContent'));

interface IProps {
  resultsStore: ResultStore;
  uiStore: UIStore
}

class Results extends Component<IProps> {
  componentDidMount() {
    console.log('componentDidMount');
    
    const { resultsStore } = this.props

    resultsStore.getSearchTerms()
  }

  openModal = () => {
    const { uiStore } = this.props;

    if(uiStore) uiStore.toggleModal()
  }

  render() {
    const { uiStore } = this.props;

    const { resultsStore } = this.props;
    const { resultModalOpen } = uiStore
    const { keyword, results, loading, errorMessage, selectedItem, getPaginatedResults, recommendedListing } = resultsStore

  
    return (
      <main className="home">
        
        {resultModalOpen && <Modal>
          <Suspense fallback={
            <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
              <h2 className="text-white text-2xl mb-4">Loading information</h2>
            </div>}>

            <SearchResultModalContent selectedItem={selectedItem} />
          </Suspense>
        </Modal>}
  
        <section className="container mx-auto">
          {
            !loading && results.length ? (
              <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
                <SearchListingHeader />
                <SearchListing resultItems={getPaginatedResults}  clickHandler={() => this.openModal()} />
              </div>
  
            ) : (

              <div>
                { keyword && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
                  <h3 className="text-2xl mb-4">No results matching "{resultsStore.keyword}" found</h3>
                  { errorMessage && <p className="text-lg">{errorMessage}</p> }
                </div> }
                

                { !keyword && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
                  <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                    <h2 className="text-3xl">Recommended</h2>
                  </div>

                  <SearchListing resultItems={recommendedListing}  clickHandler={() => this.openModal()} />
                </div> }
              </div>
            )
          }
        </section>
      </main>
    )
  }
};

export default inject('resultsStore', 'uiStore')(observer(Results));