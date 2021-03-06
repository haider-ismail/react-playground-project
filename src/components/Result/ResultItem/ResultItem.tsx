import React, { useContext } from 'react';
import { IMovie } from '../../../types/types';

// Components
import { ResultsContext } from "../../../views/Results/context/result.context"
interface IProps {
  item: IMovie;
  clickHandler: () => void;
}

const ResultItemCard: React.FC<IProps> = ({ item, clickHandler }) => {
  const  { updateSelectedItem } = useContext(ResultsContext);

  const handleClick = () => {
    updateSelectedItem(item)
    clickHandler()
  }

  const handleKeyPress = (event:  any) => {
    if (event.key === 'Enter') {
      clickHandler()
    }
  }

  return (
  <article className="cursor-pointer" role="button" tabIndex={0} onClick={handleClick} onKeyPress={handleKeyPress}>
      {(item.Poster && item.Poster !== 'N/A' ? <img className="w-full" src={item.Poster} alt={`${item.Title} poster`} /> : <div className="w-full h-full bg-white"></div>) }
      <h3 className="text-white  mt-2 ">{item.Title}</h3>
      <time className="text-white" dateTime={item.Year}>{item.Year}</time>
  </article>
)};

export default ResultItemCard;
