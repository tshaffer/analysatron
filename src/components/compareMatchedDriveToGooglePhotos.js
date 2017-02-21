// @flow

import type {
  MatchedPhoto,
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
  PhotosByHash,
} from '../types';

import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import ComparePhotoItems from './comparePhotoItems';

class CompareMatchedDriveToGooglePhotos extends Component {

  constructor(props: Object) {
    super(props);

    this.state = {
      drivePhotoIndex: 0
    };
  }

  state: Object;


  moveToNext() {

    let drivePhotoIndex = this.state.drivePhotoIndex + 1;
    if (drivePhotoIndex >= this.props.photoComparisonResults.matchedPhotos.length) {
      drivePhotoIndex = 0;
    }

    this.setState( { drivePhotoIndex });
  }

  handleMatch() {
  }

  handleNotMatch() {
  }

  handleSave() {
    // const photosByHashStr = JSON.stringify(this.photosByHash, null, 2);
    // fs.writeFileSync(this.outputFileName, photosByHashStr);
    // console.log('photosByHash write complete.');
  }

  handleNext() {
    this.moveToNext();
  }

  handlePrev() {

    let drivePhotoIndex = this.state.drivePhotoIndex - 1;
    if (drivePhotoIndex < 0) {
      drivePhotoIndex = this.props.photoComparisonResults.matchedPhotos.length - 1;
    }

    this.setState( { drivePhotoIndex });
  }

  handleHome() {
    hashHistory.push('/');
  }

  getButtonStyle() {
    return {
      height: '24px',
      width: '200px',
      marginLeft: '2px'
    };
  }

  getButtonLabelStyle() {
    return {
      fontSize: '12px',
    };
  }

  render() {

    if (!this.props.photoComparisonResults) {
      return (
        <div>Loading...</div>
      );
    }

    const matchedPhotos: Array<MatchedPhoto> = this.props.photoComparisonResults.matchedPhotos;
    const matchedDrivePhoto: MatchedPhoto = matchedPhotos[this.state.drivePhotoIndex];
    const identicalDrivePhotos : IdenticalPhotos = matchedDrivePhoto.drivePhotos;
    const drivePhotoItems: PhotoItems = identicalDrivePhotos.photoItems;
    // TODO, for now ignore matchedPhotoGroupIndex
    const drivePhotoItem : PhotoItem = drivePhotoItems[0];
    // const drivePhotoHash: string = identicalDrivePhotos.hash;
    const drivePhotoKey: string = identicalDrivePhotos.key;

    const googlePhotosByHash: PhotosByHash = this.props.googlePhotosByHash;
    const matchingIdenticalGooglePhotos: IdenticalPhotos = googlePhotosByHash[drivePhotoKey];
    if (!matchingIdenticalGooglePhotos) {
      debugger;
    }
    const googlePhotoItems: PhotoItems = matchingIdenticalGooglePhotos.photoItems;
    // TODO, for now ignore matchedPhotoGroupIndex
    const googlePhotoItem: PhotoItem = googlePhotoItems[0];

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
                onClick={this.handleNotMatch.bind(this)}
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
  googlePhotosByHash: React.PropTypes.object.isRequired,
  photoComparisonResults: React.PropTypes.object.isRequired
};

export default CompareMatchedDriveToGooglePhotos;

