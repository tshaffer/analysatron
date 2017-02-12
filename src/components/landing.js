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

  handleComparePhotos() {
    // const volumeName = this.volumeNameField.input.value;
    // this.props.onMatchPhotos(volumeName);
    hashHistory.push('/comparePhotosContainer');
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
            onClick={this.handleComparePhotos.bind(this)}
            label="Compare Photos"
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
