import React from "react";
import { useResultsStore } from "../hooks/useResultsStore";

export const ResultsStoreContext = React.createContext({} as ReturnType<typeof useResultsStore>)

// export const ResultsContextProvider: React.FC<{}> = (props) => {
//   return (
//       <ResultsStoreContext.Provider value={useResultsStore()}>
//           {props.children}
//       </ResultsStoreContext.Provider>
//   )
// }