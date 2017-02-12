// @flow

import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class Landing extends Component {

  componentWillMount() {
    console.log("landing.js::componentWillMount invoked");
    // this.props.onReadGooglePhotos();
    // this.props.onReadDrivePhotos();
    this.props.onAnalyzePhotos();
  }

  handleCompareIdenticalGooglePhotos() {
    hashHistory.push('/comparePhotosContainer/' + 'identicalGooglePhotos');

  }

  handleCompareIdenticalDrivePhotos() {
    hashHistory.push('/comparePhotosContainer/' + 'identicalDrivePhotos');
  }


  render() {

    const style = {
      marginLeft: '2px',
      marginTop: '2px',
      fontSize: '16px',
    };

    return (
      <MuiThemeProvider>
        <div>
          <h1>Pizza!</h1>
          <RaisedButton
            onClick={this.handleCompareIdenticalGooglePhotos.bind(this)}
            label="Compare 'Identical' Google Photos"
            style={style}
          />
          <RaisedButton
            onClick={this.handleCompareIdenticalDrivePhotos.bind(this)}
            label="Compare 'Identical' Drive Photos"
            style={style}
          />

        </div>
      </MuiThemeProvider>
    );
  }
}

Landing.propTypes = {
  // onReadGooglePhotos: React.PropTypes.func.isRequired,
  // onReadDrivePhotos: React.PropTypes.func.isRequired,
  onAnalyzePhotos: React.PropTypes.func.isRequired
};


export default Landing;