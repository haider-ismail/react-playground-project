import React, { useContext } from 'react';

// Helpers
import { ResultsContext } from "./context/results.context"

// Components
import ResultListingHeader from '../../components/Results/ResultListingHeader'
import ResultListingPlaceholder from '../../components/Results/ResultListing/ResultListingPlaceholder'
import { ResultListing, ResultItemModalContent } from '../../components/Results'
import Modal from '../../components/Modal'

interface IProps { }

const Results: React.FunctionComponent<IProps> = () => {
  const { keyword, loading, errorMessage, selectedItem, recommendedListing, paginatedResults, isResultModalOpen, setModalOpenState } = useContext(ResultsContext);

  return (
    <main>
      {isResultModalOpen && <Modal isOpen={isResultModalOpen} onClose={() => setModalOpenState(false)}>
        {!selectedItem && (<div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
          <h2 className="text-white text-2xl mb-4">Loading information</h2>
        </div>)}
        {selectedItem && <ResultItemModalContent selectedItem={selectedItem} />}
      </Modal>}

      <section className="container mx-auto">
        {keyword && loading && (<div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
          <h2 className="text-white text-2xl mb-4">Fetching results</h2>
          <ResultListingPlaceholder />
        </div>)}

        {keyword && !loading && (paginatedResults && paginatedResults.length === 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 mb-8 rounded-md text-white text-center">
          <h3 className="text-2xl mb-4">No results matching "{keyword}" found</h3>
          {errorMessage && <p className="text-lg">{errorMessage}</p>}
        </div>}

        {keyword && (paginatedResults && paginatedResults.length > 0) && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
          <ResultListingHeader />
          <ResultListing resultItems={paginatedResults} clickHandler={() => setModalOpenState(true)} />
        </div>}

        {!keyword && recommendedListing?.length && <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md text-white text-center">
          <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
            <h2 className="text-3xl">Recommended</h2>
          </div>

          <ResultListing resultItems={recommendedListing} clickHandler={() => setModalOpenState(true)} />
        </div>}
      </section>
    </main>
  )
};

export default Results;