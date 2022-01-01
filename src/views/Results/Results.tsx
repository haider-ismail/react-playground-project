import React, { Suspense, useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStores } from '../../hooks/useStores'

import ResultListingHeader from '../../components/Result/ResultListingHeader';
import ResultListingPlaceholder from '../../components/Result/ResultListing/ResultListingPlaceholder';
import Modal from '../../components/Modal';

const ResultItemModalContent = React.lazy(() => import('../../components/Result/ResultItemModalContent'));
const ResultListing = React.lazy(() => import('../../components/Result/ResultListing'));

interface IProps {}

const Results: React.FunctionComponent<IProps> = () => {
  const { uiStore, resultsStore  } = useStores()
  const { resultModalOpen } = uiStore
  const { keyword, results, loading, errorMessage, selectedItem, getPaginatedResults, recommendedListing } = resultsStore

  // Utilising useEffect hook and timeout to only trigger search when user stops typing
  useEffect(() => {
    // if (!resultsStore) return

    resultsStore.getSearchTerms()
    // @ts-ignore
  })

  console.log('results.tsx : recommendedListing', resultsStore.recommendedListing);
  console.log('resultsStore', resultsStore);

  const openModal = () => {
    if(uiStore) uiStore.toggleModal()
  }
  
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

            { resultsStore.keyword && !loading && (results && results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
              <h3 className="text-2xl mb-4">No results matching "{resultsStore.keyword}" found</h3>
              { errorMessage && <p className="text-lg">{errorMessage}</p> }
            </div> }

            { resultsStore.keyword && (resultsStore.results && resultsStore.results.length > 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
              <ResultListingHeader />
              <ResultListing resultItems={ resultsStore.getPaginatedResults } clickHandler={() => openModal()} />
            </div>}

            { !resultsStore.keyword && (resultsStore.results && resultsStore.results.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
              <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                <h2 className="text-3xl">Recommended</h2>
              </div>

              <ResultListing resultItems={resultsStore.recommendedListing}  clickHandler={() => openModal()} />
            </div> }
          </Suspense>
        }
      </section>
    </main>
  )
};

export default  observer(Results);