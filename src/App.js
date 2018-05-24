import React, { Component } from 'react';
import './App.css';

import UserDetails from './components/UserDetails'
class App extends Component {
  render() {
    return (
      <div className="App">
          <h1>Just playing with an rxjs based form library for react</h1>
          <UserDetails />
      </div>
    );
  }
}

export default App;
