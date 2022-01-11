import React, { useContext } from 'react';

import { IMovie } from '../../../types/types';

// contexts
import { ResultsStoreContext } from "../../../contexts/resultsStoreContext";

import ResultItem from '../ResultItem';

interface IProps {
  clickHandler: () => void;
}

const ResultListing: React.FC<IProps> = ({ clickHandler }) => { 
  const  { paginatedResults } = useContext(ResultsStoreContext);

  const handleClick = () => clickHandler()
  return (
    paginatedResults && 
      <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
        { paginatedResults.map((item: any) => <ResultItem clickHandler={() => handleClick()} item={item} key={`${item.imdbID}_${item.Year}`} />) }
      </div>
  )
}

export default ResultListing;
