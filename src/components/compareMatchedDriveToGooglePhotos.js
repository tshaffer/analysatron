// @flow

import type {
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
  MatchedPhoto,
} from '../types';

import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import ComparePhotoItems from './comparePhotoItems';

class CompareMatchedDriveToGooglePhotos extends Component {

  componentWillMount() {
    this.props.initMatchedDrivePhotoComparisons();
  }

  drivePhotoItems : PhotoItems;

  moveToNext() {
    this.props.onNavigateMatchedForward();
  }

  handleMatch() {
    this.props.onMatch(this.drivePhotoItems);
    this.props.onNavigateMatchedForward();
  }

  handleNotAMatch() {
    this.props.onNotAMatch(this.drivePhotoItems);
    this.props.onNavigateMatchedForward();
  }

  handleDiscard() {
    this.props.onDiscard(this.drivePhotoItems);
    this.props.onNavigateMatchedForward();
  }

  handleSave() {
    this.props.onSave();
  }

  handleNext() {
    this.props.onNavigateMatchedForward();
  }

  handlePrev() {
    this.props.onNavigateMatchedBackward();
  }

  handleHome() {
    hashHistory.push('/');
  }

  getButtonStyle() {
    return {
      height: '24px',
      width: '180px',
      marginLeft: '2px'
    };
  }

  getButtonLabelStyle() {
    return {
      fontSize: '12px',
    };
  }

  render() {

    // display loading until all data is loaded...

    if (!this.props.photoComparisonResults.matchedPhotos) {
      return (
        <div>Loading photoComparisonResults...</div>
      );
    }

    if (this.props.matchedDrivePhotoIndex < 0) {
      return (
        <div>Loading drivePhotoIndex...</div>
      );
    }

    // get drivePhoto
    const identicalDrivePhotos : IdenticalPhotos =
      this.props.matchedExistingPhotos[this.props.matchedDrivePhotoIndex].drivePhotos;
    this.drivePhotoItems = identicalDrivePhotos.photoItems;
    const drivePhotoItem : PhotoItem = this.drivePhotoItems[0];

    // get googlePhoto
    const matchedGooglePhoto : MatchedPhoto =
      this.props.matchedExistingPhotos[this.props.matchedDrivePhotoIndex];
    const matchedGooglePhotos : IdenticalPhotos = matchedGooglePhoto.matchedGooglePhotos;
    const googlePhotoItems : PhotoItems = matchedGooglePhotos.photoItems;
    const googlePhotoItem : PhotoItem = googlePhotoItems[0];

    // display drivePhoto, googlePhoto side by side
    const photoItems = [
      drivePhotoItem,
      googlePhotoItem
    ];

    return (
      <MuiThemeProvider>
        <div className="photoPageContainer">
          <div className="photosDiv">
            <div className="dayOfPhotosDiv" key={Math.random().toString()}>
              <RaisedButton
                label='Match'
                onClick={this.handleMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Not a match'
                onClick={this.handleNotAMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Discard'
                onClick={this.handleDiscard.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Save'
                onClick={this.handleSave.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Next'
                onClick={this.handleNext.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Prev'
                onClick={this.handlePrev.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Home'
                onClick={this.handleHome.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <ComparePhotoItems
                photoItems={photoItems}
                displayCheckBoxes={false}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

CompareMatchedDriveToGooglePhotos.propTypes = {
  photoComparisonResults: React.PropTypes.object.isRequired,
  drivePhotoToGooglePhotoComparisonResults: React.PropTypes.object.isRequired,
  onMatch: React.PropTypes.func.isRequired,
  onNotAMatch: React.PropTypes.func.isRequired,
  onDiscard: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  initMatchedDrivePhotoComparisons: React.PropTypes.func.isRequired,
  matchedDrivePhotoIndex: React.PropTypes.number.isRequired,
  matchedExistingPhotos: React.PropTypes.array.isRequired,
  onNavigateMatchedBackward: React.PropTypes.func.isRequired,
  onNavigateMatchedForward: React.PropTypes.func.isRequired,
};

export default CompareMatchedDriveToGooglePhotos;

