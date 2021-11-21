import React from 'react';
import { inject, observer } from 'mobx-react';
import { IMovie } from '../../../types/types';
import ResultStore from '../../../stores/resultsStore';

interface IProps {
  selectedItem: IMovie | null;
  resultsStore?: ResultStore;
}

const ResultItemModalContent: React.FC<IProps> = ({ selectedItem }) => {
  return (
    <>
    <div className="flex flex-wrap w-full">
      <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
        <img className="w-32 sm:w-full block" src={selectedItem?.Poster} alt={`${selectedItem?.Title} poster`} />
      </div>

      <div className="text-white  sm:pl-10 w-full sm:w-2/3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-10">{selectedItem?.Title}</h2>
        {selectedItem?.Director && <p>Director: {selectedItem?.Director}</p>} 
        {selectedItem?.Actors && <p>Cast: {selectedItem?.Actors}</p>}
        {selectedItem?.Genre && <p>Genre: {selectedItem?.Genre} </p>}
        <br />
        {selectedItem?.Plot && <p>Genre: {selectedItem?.Plot} </p>}
      </div>
    </div>
    </>
)};

export default inject('resultsStore')(observer(ResultItemModalContent));
