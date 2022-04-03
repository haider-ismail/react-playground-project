import React from 'react'

// Helpers
import { IMovie } from "../../../types/types"

// Components
import ResultItem from '../ResultItem';
interface IProps {
  resultItems: IMovie[],
  clickHandler: () => void
}

const ResultListing: React.FC<IProps> = ({ resultItems, clickHandler }) => { 
  const handleClick = () => clickHandler()
  
  return (
    resultItems && 
      <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
        { resultItems.map((item: any, index: number) => <ResultItem clickHandler={() => handleClick()} item={item} key={`${(item.imdbID && item.Year ? `${item.imdbID}_${item.Year}` : `result_item_${index}`  )}`} />) }
      </div>
  )
}

export default ResultListing
