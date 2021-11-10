import React, { Component } from 'react';
import SearchResultCard from '../../components/SearchResultCard';
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
    if(uiStore) console.log('uiStore.resultModalOpen', uiStore.resultModalOpen);
  }

  showNextPage = () => {
    const { resultsStore } = this.props;

    resultsStore.incrementPage()
  }

  showPreviousPage = () => {
    const { resultsStore } = this.props;

    resultsStore.decrementPage()
  }

  render() {
    const { resultsStore } = this.props;
    const { results, loading, errorMessage, searched, selectedItem } = resultsStore
  
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
        {loading ? (
          <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
            <h2 className="text-white text-2xl mb-4">Loading results</h2>
          </div>
          ) : (
            results.length ? (
              <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
                 <h2 className="text-3xl text-white">Search results</h2>
                <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                  <div className="w-full sm:w-auto mb-6 sm:mb-0" >{results.length} Results found for "{resultsStore.keyword}"</div>
  
                  <div className="flex items-center">
                    <span className="text-lg">Page {resultsStore.getCurrentPage} of {resultsStore.getTotalPages}</span>
  
                    <div className="flex -mx-3 pl-6">
                      <button onClick={() => this.showPreviousPage()} disabled={resultsStore.getCurrentPage === 1} className="py-2 p-3 border-2 border-white mx-3"><svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M-1.31174e-07 11L11.25 20.5263L11.25 1.47372L-1.31174e-07 11Z" fill="#fff"/> </svg> </button>
                      <button onClick={() => this.showNextPage()} disabled={resultsStore.getCurrentPage + 1 > resultsStore.getTotalPages} className="py-2 p-3 border-2 border-white mx-3"><svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15 11L3.75 20.5263L3.75 1.47372L15 11Z" fill="#fff"/> </svg> </button>
                    </div>
                  </div>
                </div>
  
                <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
                  {resultsStore.getPaginatedResults() && resultsStore.getPaginatedResults().map((item: any) => <SearchResultCard clickHandler={() => this.openModal()} item={item} key={item.imdbID} />) }
                </div>
              </div>
  
            ) : (

              <div>
                { searched && resultsStore.keyword && !resultsStore.results.length && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
                  {searched && <h3 className="text-2xl mb-4">No results matching "{resultsStore.keyword}" found</h3>}
                  {searched && errorMessage && <p className="text-lg">{errorMessage}</p> }
                </div> }
               

                <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
                  <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                    <h2 className="text-3xl">Recommended</h2>
                  </div>

                  <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" aria-live="polite">
                    {resultsStore.recommendedListing && resultsStore.recommendedListing.map((item: any) => <SearchResultCard clickHandler={() => this.openModal()} item={item} key={item.imdbID} />) }
                  </div>
                </div>
              </div>
            )
          )}
        </section>
      </main>
    )
  }
};

export default inject('resultsStore', 'uiStore')(observer(Results));