import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles/tailwind.output.css';

import Home from './views/Home/Home';
import Results from './views/Results/Results';
import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <React.StrictMode>
        <Router>
          <Header />
          <Switch>
              <Route path="/" exact={true} component={Home} />
              <Route path="/results" component={Results} />
          </Switch>
          </Router>
      </React.StrictMode>
    );
  }
}

export default observer(App);
