// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import LandingContainer from '../containers/landingContainer';

export default class App extends Component {

  componentDidMount() {
    console.log("app.js::componentDidMount invoked");
  }

  render() {

    console.log("app.js::render invoked");

    return (
      <MuiThemeProvider>
        <div>
          <LandingContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}
