import React from "react";

// Helpers
import { IMovie } from "../../../types/types";

// Components
import ResultItem from "../ResultItem";
interface IProps {
  resultItems: IMovie[];
  clickHandler: () => void;
}

const ResultListing: React.FC<IProps> = ({ resultItems, clickHandler }) => {
  const handleClick = () => clickHandler();

  return (
    resultItems && (
      <div
        className="results-listing py-8 "
        id="resultsListing"
        aria-live="polite"
      >
        {resultItems.map((item: any, index: number) => (
          <ResultItem
            clickHandler={handleClick}
            item={item}
            key={`${item.id}`}
          />
        ))}
      </div>
    )
  );
};

export default ResultListing;
