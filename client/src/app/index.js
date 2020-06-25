import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { NavBar } from '../components';
import {ItemInsert, ItemUpdate, ItemList} from '../pages/pages'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/items/list" exact component={ItemList} />
        <Route path="/items/create" exact component={ItemInsert} />
        <Route path="/items/update/:id" exact component={ItemUpdate} />
      </Switch>
    </Router>
  );//note the :id tells react to await for a param called id when making the requenst.
  // this id can be configured using something like this.props.match.params.id
}


export default App;

/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

