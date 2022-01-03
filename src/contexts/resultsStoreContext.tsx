import React from "react";
import { useResultsStore } from "../hooks/useResultsStore";

export const ResultsContext = React.createContext({} as ReturnType<typeof useResultsStore>)

// export const ResultsContextProvider: React.FC<{}> = (props) => {
//   return (
//       <ResultsContext.Provider value={useResultsStore()}>
//           {props.children}
//       </ResultsContext.Provider>
//   )
// }