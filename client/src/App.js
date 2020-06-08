import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Test from './pages/Test';

class App extends Component {
  render() {
    const app = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/testPage' component={Test} />
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    )
  }
}

export default App;