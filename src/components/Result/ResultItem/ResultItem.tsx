import React from 'react';
import { inject, observer } from 'mobx-react';
import { IMovie } from '../../../types/types';
import ResultStore from '../../../stores/resultsStore';

interface IProps {
  item: IMovie;
  resultsStore?: ResultStore;
  clickHandler: () => void;
}

const SearchResultCard: React.FC<IProps> = ({ item, clickHandler, resultsStore }) => {
  const handeClick = () => {
    if(resultsStore) resultsStore.setSelectedItem(item)
    clickHandler()
  }

  const handleKeyPress = (event:  any) => {
    if (event.key === 'Enter') {
      clickHandler()
    }
  }

  return (
  <article className="cursor-pointer" role="button" tabIndex={0} onClick={handeClick} onKeyPress={handleKeyPress}>
      {(item.Poster && item.Poster !== 'N/A' ? <img className="w-full" src={item.Poster} alt={`${item.Title} poster`} /> : <div className="w-full h-full bg-white"></div>) }
      <h3 className="text-white  mt-2 ">{item.Title}</h3>
      <time className="text-white" dateTime={item.Year}>{item.Year}</time>
  </article>
)};

export default inject('resultsStore')(observer(SearchResultCard));
