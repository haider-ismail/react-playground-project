import React from 'react';
import { observer } from 'mobx-react-lite';

import { IMovie } from '../../../types/types';

import ResultItem from '../ResultItem';

interface IProps {
  resultItems: IMovie[];
  clickHandler: () => void;
}

const ResultListing: React.FC<IProps> = ({ resultItems, clickHandler }) => { 
  const handleClick = () => clickHandler()
  return (
    resultItems && 
      <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
        { resultItems.map((item: any) => <ResultItem clickHandler={() => handleClick()} item={item} key={`${item.imdbID}_${item.Year}`} />) }
      </div>
  )
}

export default observer(ResultListing);
