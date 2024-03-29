import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {AuthorizedRoute} from '../components';
import { NavBar } from '../components';
import {ActivitySensor, LogoutUser} from '../authentication';
import {BlogPage, Checkout, PostEditor, Cart, ImagePost, LandingPage, ItemUpdate, ItemList, StoreFront, ItemView, CreateReview, CreateAccountPage, LoginPage} from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import store from '../redux/store';
import freeAccount from '../redux/actions/accountAct';

function App() {
  
  /*const session_manager = new ActivitySensor();
  // this only works for 1 tab a different approach will be needed for multiple tabs
  session_manager.addInactivityTrigger(LogoutUser, 1000*60*5) // logout after 5 minutes of inactivity
  React.useEffect(()=>{
    session_manager.attachListeners(window);
    return () => session_manager.detachListeners(window);
  });*/
  
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" exact component={LoginPage} />
        <Route path="/createAccount" exact component={CreateAccountPage} />
        <AuthorizedRoute path="/items/list" exact component={ItemList} roles={['ROLE_ADMIN']} />
        <AuthorizedRoute path="/items/create" exact component={ItemUpdate} roles={['ROLE_ADMIN']} />
        <AuthorizedRoute path="/items/update/:id" exact component={ItemUpdate} roles={['ROLE_ADMIN']} />
        <Route path="/items/view/:id" exact component={ItemView} />
        <AuthorizedRoute path="/items/view/:id/review" exact component={CreateReview} roles={['ROLE_ADMIN']} />
        <Route path="/storefront" exact component={StoreFront} />
        <Route path="/storefront/cart" exact component={Cart} />
        <Route path="/blog" exact component={BlogPage} />
        <AuthorizedRoute path="/frontpage/post" exact component={PostEditor} roles={['ROLE_ADMIN']} />
        <AuthorizedRoute path="/frontpage/post/:id" exact component={PostEditor} roles={['ROLE_ADMIN']} />
        <AuthorizedRoute path="/frontpage/media/post" exact component={ImagePost} roles={['ROLE_ADMIN']} />
        <AuthorizedRoute path="/storefront/checkout" exact component={Checkout} roles={['ROLE_USER']} />
        <Route path="/" exact component={LandingPage}/>
      </Switch>
    </Router>
  );//note the :id tells react to await for a param called id when making the request.
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

