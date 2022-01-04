import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './styles/tailwind.output.css';

// contexts
import { ResultsStoreContext } from "./contexts/resultsStoreContext";
import { UIStoreContext } from "./contexts/uiStoreContext";


// hooks
import { useResultsStore } from "./hooks/useResultsStore";
import { useUIStore } from "./hooks/useUIStore";

// components
import Home from './views/Home/Home';
import Results from './views/Results/Results';
import Header from './components/Header';

const App: React.FunctionComponent = () => {
  const resultsStoreData = useResultsStore();
  const uiStoreData = useUIStore();
  
  return (
    <React.StrictMode>
        <UIStoreContext.Provider value={ uiStoreData }>
          <ResultsStoreContext.Provider value={ resultsStoreData }>
            <Router>
              <Header />
              <Switch>
                  <Route path="/" exact={true} component={Home} />
                  <Route path="/results" component={Results} />
              </Switch>
            </Router>
          </ResultsStoreContext.Provider>
        </UIStoreContext.Provider>
     
    </React.StrictMode>
  );
};

export default App;
