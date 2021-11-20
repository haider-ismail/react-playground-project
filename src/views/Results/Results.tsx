import React, { Component, Suspense } from 'react';
import SearchListingHeader from '../../components/Search/SearchListingHeader';
import SearchListing from '../../components/Search/SearchListing';
import Modal from '../../components/Modal';
import { inject, observer } from 'mobx-react';
import ResultStore from '../../stores/resultsStore';
import UIStore from '../../stores/uiStore';

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

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  
  openModal = () => {
    const { uiStore } = this.props;

    if(uiStore) uiStore.toggleModal()
  }

  render() {
    const { resultsStore } = this.props;
    const { keyword, results, loading, errorMessage, selectedItem } = resultsStore
  
    return (
      <main className="home">
        
        {selectedItem && <Modal>
          <div className="flex flex-wrap w-full">
            <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
              <img className="w-32 sm:w-full block" src={selectedItem.Poster} alt={`${selectedItem.Title} poster`} />
            </div>
  
            <div className="text-white  sm:pl-10 w-full sm:w-2/3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-10">{selectedItem.Title}</h2>
              {selectedItem.Director && <p>Director: {selectedItem.Director}</p>} 
              {selectedItem.Actors && <p>Cast: {selectedItem.Actors}</p>}
              {selectedItem.Genre && <p>Genre: {selectedItem.Genre} </p>}
              <br />
              {selectedItem.Plot && <p>Genre: {selectedItem.Plot} </p>}
            </div>
          </div>
        </Modal>}
  
        <section className="container mx-auto">
          {/* <Suspense fallback={
            <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
              <h2 className="text-white text-2xl mb-4">Loading results</h2>
            </div>
          }> */}
            {
              !loading && results.length ? (
                <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
                  <SearchListingHeader />
                  <SearchListing  clickHandler={() => this.openModal()} />
                </div>
    
              ) : (
  
                <div>
                  {/* { keyword && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
                    <h3 className="text-2xl mb-4">No results matching "{resultsStore.keyword}" found</h3>
                    { errorMessage && <p className="text-lg">{errorMessage}</p> }
                  </div> }
                 
  
                  { !keyword && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
                    <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                      <h2 className="text-3xl">Recommended</h2>
                    </div>
  
                    <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" aria-live="polite">
                      {resultsStore.recommendedListing && resultsStore.recommendedListing.map((item: any) => <SearchResultCard clickHandler={() => this.openModal()} item={item} key={`${item.imdbID}_${item.Year}`} />) }
                    </div>
                  </div> } */}
                </div>
              )
            }
          {/* </Suspense> */}
        </section>
      </main>
    )
  }
};

export default inject('resultsStore', 'uiStore')(observer(Results));