import React from "react";

// Types
import { IResultsProvider } from '../../../types/types';

const ResultsContext = React.createContext({} as IResultsProvider)

const { Consumer, Provider } = ResultsContext

export { Provider, Consumer, ResultsContext }