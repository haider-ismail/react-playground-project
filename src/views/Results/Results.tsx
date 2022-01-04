import React, { Suspense, useEffect, useCallback, useContext } from 'react';

// hooks
import { useStores } from '../../hooks/useStores'

// contexts
import { ResultsContext } from "../../contexts/resultsStoreContext";

// components
import ResultListingHeader from '../../components/Result/ResultListingHeader';
import ResultListingPlaceholder from '../../components/Result/ResultListing/ResultListingPlaceholder';
import Modal from '../../components/Modal';

const ResultItemModalContent = React.lazy(() => import('../../components/Result/ResultItemModalContent'));
const ResultListing = React.lazy(() => import('../../components/Result/ResultListing'));

interface IProps {}

const Results: React.FunctionComponent<IProps> = () => {
  const { uiStore  } = useStores()
  const { resultModalOpen } = uiStore

  const  { keyword, loading, errorMessage, selectedItem, recommendedListing, paginatedResults, getSearchTerms, setParams } = useContext(ResultsContext);

  useEffect(() => {
    console.log('%c Results.tsx [useEffect] -->', 'color: yellow;, ', ', keyword:', keyword);
    getSearchTerms()
    setParams(true) 
  }, [keyword])

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

            { keyword && !loading && (paginatedResults && paginatedResults.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
              <h3 className="text-2xl mb-4">No results matching "{keyword}" found</h3>
              { errorMessage && <p className="text-lg">{errorMessage}</p> }
            </div> }

            {  keyword && (paginatedResults && paginatedResults.length > 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
              <ResultListingHeader />
              <ResultListing resultItems={ paginatedResults } clickHandler={() => openModal()} />
            </div>}

            { !keyword && (paginatedResults && paginatedResults.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
              <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                <h2 className="text-3xl">Recommended</h2>
              </div>

              <ResultListing resultItems={recommendedListing}  clickHandler={() => openModal()} />
            </div> }
          </Suspense>
        }
      </section>
    </main>
  )
};

export default Results;