// @flow

import React, { Component } from 'react';

class Landing extends Component {

  componentWillMount() {
    console.log("landing.js::componentWillMount invoked");
    // this.props.onReadGooglePhotos();
    // this.props.onReadDrivePhotos();
    this.props.onAnalyzePhotos();
  }

  render() {

    return (
      <div>
        pizza
      </div>
    );
  }
}

Landing.propTypes = {
  // onReadGooglePhotos: React.PropTypes.func.isRequired,
  // onReadDrivePhotos: React.PropTypes.func.isRequired,
  onAnalyzePhotos: React.PropTypes.func.isRequired
};


export default Landing;
