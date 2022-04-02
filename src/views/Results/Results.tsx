import React, { Suspense, useEffect, useContext } from 'react';

// Helpers
import { ResultsContext } from "./context/result.context"

// Components
import ResultListingHeader from '../../components/Result/ResultListingHeader'
import ResultListingPlaceholder from '../../components/Result/ResultListing/ResultListingPlaceholder'
import Modal from '../../components/Modal'

const ResultItemModalContent = React.lazy(() => import('../../components/Result/ResultItemModalContent'))
const ResultListing = React.lazy(() => import('../../components/Result/ResultListing'))

interface IProps {}

const Results: React.FunctionComponent<IProps> = () => {
  const  { keyword, loading, errorMessage, selectedItem, recommendedListing, paginatedResults, isResultModalOpen, setModalOpenState, getSearchTerms, setParams } = useContext(ResultsContext);

  useEffect(() => {
    console.log('%c Results.tsx [useEffect] -->', 'color: yellow;, ', ', keyword:', keyword);
    getSearchTerms()
    setParams(true) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])
  
  return (
    <main>
      {isResultModalOpen && <Modal isOpen={isResultModalOpen} onClose={() => setModalOpenState(false)}>
        <Suspense fallback={
          <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
            <h2 className="text-white text-2xl mb-4">Loading information</h2>
          </div>}>

          <ResultItemModalContent selectedItem={selectedItem} />
        </Suspense>
      </Modal>}

      <section className="container mx-auto">
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
              <ResultListing resultItems={paginatedResults} clickHandler={() => setModalOpenState(true)} />
            </div>} 

            { !keyword && recommendedListing?.length && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
              <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
                <h2 className="text-3xl">Recommended</h2>
              </div>

              <ResultListing resultItems={recommendedListing}  clickHandler={() => setModalOpenState(true)} />
            </div> } 
           </Suspense> 
      </section>
    </main>
  )
};

export default Results;