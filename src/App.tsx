import React from 'react';
// import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { StoresContext } from './contexts/storesContext'

// import { useStores } from './hooks/useStores'

import './styles/tailwind.output.css';

import Home from './views/Home/Home';
import Results from './views/Results/Results';
import Header from './components/Header';

const App: React.FunctionComponent = () => {
  // const stores = useStores()
  
  return (
    <React.StrictMode>
      {/* <StoresContext.Provider value={ stores }> */}
        <Router>
          <Header />
          <Switch>
              <Route path="/" exact={true} component={Home} />
              <Route path="/results" component={Results} />
          </Switch>
        </Router>
      {/* </StoresContext.Provider> */}
    </React.StrictMode>
  );
};

export default App;
