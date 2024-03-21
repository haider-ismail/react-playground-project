import React, { useContext } from "react";
import { format } from "date-fns";
import { IJob } from "../../../types/types";

// Components
import { ResultsContext } from "../../../views/Results/context/results.context";
interface IProps {
  item: IJob;
  clickHandler: () => void;
}

const ResultItemCard: React.FC<IProps> = ({ item, clickHandler }) => {
  const { updateSelectedItem } = useContext(ResultsContext);

  const handleClick = () => {
    updateSelectedItem(item);
    clickHandler();
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      clickHandler();
    }
  };

  return (
    <article
      className="cursor-pointer mb-8"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
    >
      {item.image && item.image !== "N/A" ? (
        <img className="w-full" src={item.image} alt={`${item.title} poster`} />
      ) : (
        <div className="w-full h-full bg-white" />
      )}
      <h3 className="text-white  mt-2 ">{item.title}</h3>
      <time
        className="text-white"
        dateTime={format(new Date(item.updated), "dd/MM/yyyy")}
      >
        {format(new Date(item.updated), "dd/MM/yyyy")}
      </time>
      <div className="text-white mb-3 text-sm">
        {item.description.substring(0, 300)}
      </div>
      <a
        className=" bg-white text-black p-3 inline-block"
        target="_blank"
        rel="noreferrer"
        href={item.url}
      >
        View job
      </a>
    </article>
  );
};

export default ResultItemCard;
