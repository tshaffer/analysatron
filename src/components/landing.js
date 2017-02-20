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

  handleCompareMatchedDriveToGooglePhotos() {
    hashHistory.push('/compareMatchedDriveToGooglePhotosContainer');
  }

  handleCompareUnmatchedDriveToGooglePhotos() {
    hashHistory.push('/compareUnmatchedDriveToGooglePhotosContainer');
  }

  handleCompareIdenticalGooglePhotos() {

    const parameters = [
      'identicalGooglePhotos',
      'googlePhotosByHash.json'
    ];
    hashHistory.push('/comparePhotosContainer/' + parameters);
  }

  handleCompareIdenticalDrivePhotos() {

    const parameters = [
      'identicalDrivePhotos',
      'drivePhotosByHash.json'
    ];
    hashHistory.push('/comparePhotosContainer/' + parameters);
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
            onClick={this.handleCompareMatchedDriveToGooglePhotos.bind(this)}
            label="Confirm Matched DrivePhotos to GooglePhotos"
            style={style}
          />
          <RaisedButton
            onClick={this.handleCompareUnmatchedDriveToGooglePhotos.bind(this)}
            label="Compare Unmatched DrivePhotos to GooglePhotos"
            style={style}
          />
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
