import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './styles/tailwind.output.css';

// contexts
import { ResultsContext } from "./contexts/resultsStoreContext";


// hooks
import { useResultsStore } from "./hooks/useResultsStore";

// components
import Home from './views/Home/Home';
import Results from './views/Results/Results';
import Header from './components/Header';

const App: React.FunctionComponent = () => {
  const resultsStoreData = useResultsStore();
  
  return (
    <React.StrictMode>
      
        <Router>
          <Header />
          <Switch>
            <ResultsContext.Provider value={ resultsStoreData }>
              <Route path="/" exact={true} component={Home} />
              <Route path="/results" component={Results} />
            </ResultsContext.Provider>
          </Switch>
        </Router>
     
    </React.StrictMode>
  );
};

export default App;
