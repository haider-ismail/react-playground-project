import React, { Component, Suspense } from 'react';

import { inject, observer } from 'mobx-react';

import ResultStore from '../../stores/resultsStore';
import UIStore from '../../stores/uiStore';

import ResultListingHeader from '../../components/Result/ResultListingHeader';
import ResultListingPlaceholder from '../../components/Result/ResultListing/ResultListingPlaceholder';
import Modal from '../../components/Modal';

const ResultItemModalContent = React.lazy(() => import('../../components/Result/ResultItemModalContent'));
const ResultListing = React.lazy(() => import('../../components/Result/ResultListing'));

interface IProps {
  resultsStore: ResultStore;
  uiStore: UIStore
}

class Results extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    console.log('constructor')
  }

  UNSAFE_componentDidMount() {
    const { resultsStore } = this.props
    resultsStore.getSearchTerms()
  }

  openModal = () => {
    const { uiStore } = this.props;

    if(uiStore) uiStore.toggleModal()
  }

  render() {
    const { uiStore, resultsStore } = this.props;
    const { resultModalOpen } = uiStore
    const { keyword, results, loading, errorMessage, selectedItem, getPaginatedResults, recommendedListing } = resultsStore
  
    return (
      <main className="home">
        
        {resultModalOpen && <Modal>
          <Suspense fallback={
            <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
              <h2 className="text-white text-2xl mb-4">Loading information</h2>
            </div>}>

            <ResultItemModalContent selectedItem={selectedItem} />
          </Suspense>
        </Modal>}
  
        <section className="container mx-auto">
          {

            <Suspense fallback={
              <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
                <h2 className="text-white text-2xl mb-4">Fetching results</h2>
                <ResultListingPlaceholder />
              </div>}>

              { keyword && !loading && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
                <h3 className="text-2xl mb-4">No results matching "{resultsStore.keyword}" found</h3>
                { errorMessage && <p className="text-lg">{errorMessage}</p> }
              </div> }

              { keyword && (results && results.length > 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
                <ResultListingHeader />
                <ResultListing resultItems={getPaginatedResults} clickHandler={() => this.openModal()} />
              </div>}

              { !keyword && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
                <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                  <h2 className="text-3xl">Recommended</h2>
                </div>

                <ResultListing resultItems={recommendedListing}  clickHandler={() => this.openModal()} />
              </div> }
            </Suspense>
          }
        </section>
      </main>
    )
  }
};

export default inject('resultsStore', 'uiStore')(observer(Results));