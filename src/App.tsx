import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import './styles/tailwind.output.css';

import Home from './views/Home/Home';
import Results from './views/Results/Results';
import Header from './components/Header';

import ResultsStore from './stores/resultsStore';
import UIStore from './stores/uiStore';

const resultsStore = new ResultsStore();

const uiStore = new UIStore();


class App extends Component {
  render() {
    return (
      <React.StrictMode>
        <Provider
        resultsStore={resultsStore}
        uiStore={uiStore}
        >
          <Router>
            <Header />
            <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="/results" component={Results} />
            </Switch>
          </Router>
        </Provider>
      </React.StrictMode>
    );
  }
}

export default observer(App);
