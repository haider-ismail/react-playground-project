import React from 'react';
import { inject, observer } from 'mobx-react';
import ResultStore from '../../../stores/resultsStore';
import SearchResultCard from './../SearchResultCard';

interface IProps {
  resultsStore?: ResultStore;
  clickHandler: () => void;
}

const SearchListing: React.FC<IProps> = ({ resultsStore, clickHandler }) => { 

  const handeClick = () => {
    clickHandler()
  }
  
  return (
    <>
      {resultsStore && <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
      {resultsStore.getPaginatedResults() && resultsStore.getPaginatedResults().map((item: any) => <SearchResultCard clickHandler={() => handeClick()} item={item} key={`${item.imdbID}_${item.Year}`} />) }
      </div>}
    </>
  )
}

export default inject('resultsStore')(observer(SearchListing));
