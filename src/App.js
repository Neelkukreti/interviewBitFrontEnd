import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import CreateInterview from './screens/CreateInterview';

import Nav from './nav';
function App() {
  return (
    <div className='App'>
      <Nav />
      <Router>
        <Switch>
          <Route path='/' exact component={HomeScreen} />
          <Route path='/create-interview' component={CreateInterview} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
