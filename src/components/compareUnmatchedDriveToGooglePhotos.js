// @flow

import type {
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
  PhotosByHash,
  ClosestHashSearchResult,
} from '../types';

import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import ComparePhotoItems from './comparePhotoItems';

class CompareUnmatchedDriveToGooglePhotos extends Component {

  constructor(props: Object) {
    super(props);

    this.state = {
      drivePhotoIndex: 0
    };
  }

  state: Object;

  componentWillMount() {

    this.props.readDrivePhotoToGooglePhotoComparisonResults();

    const unmatchedPhotos: Array<IdenticalPhotos> = this.props.photoComparisonResults.unmatchedPhotos;
    if (!unmatchedPhotos) {
      debugger;
    }

    // let unmatchedExistingPhotos : Array<IdenticalPhotos> = unmatchedPhotos.map( function (unmatchedPhoto : IdenticalPhotos) : IdenticalPhotos {
    //   const photoItems : PhotoItems = unmatchedPhoto.photoItems;
    //   const photoItem : PhotoItem = photoItems[0];
    //   if (photoItem.photo.fileExists()) {
    //     return unmatchedPhoto;
    //   }
    //   else {
    //     return null;
    //   }
    // });

    // strip out photos that don't exist
    let unmatchedExistingPhotos : Array<IdenticalPhotos> = [];
    unmatchedPhotos.forEach( (unmatchedPhoto) => {
      const photoItems : PhotoItems = unmatchedPhoto.photoItems;
      const photoItem : PhotoItem = photoItems[0];
      if (photoItem.photo.fileExists()) {
        unmatchedExistingPhotos.push(unmatchedPhoto);
      }
    });

    unmatchedExistingPhotos.sort( (identicalPhotosA, identicalPhotosB) => {
      if (identicalPhotosA && identicalPhotosB) {
        const minHashDistanceA : number = identicalPhotosA.closestGooglePhoto.minHashDistance;
        const minHashDistanceB : number = identicalPhotosB.closestGooglePhoto.minHashDistance;
        return minHashDistanceA - minHashDistanceB;
      }
      return 0;
    });

    this.unmatchedPhotos = unmatchedExistingPhotos;
  }

  drivePhotoItems: PhotoItems;
  unmatchedPhotos: Array<IdenticalPhotos>;

  moveToNext() {

    let drivePhotoIndex = this.state.drivePhotoIndex + 1;
    if (drivePhotoIndex >= this.props.photoComparisonResults.matchedPhotos.length) {
      drivePhotoIndex = 0;
    }

    this.setState( { drivePhotoIndex });
  }

  handleMatch() {
    this.props.onMatch(this.drivePhotoItems);
    this.moveToNext();
  }

  handleNotAMatch() {
    this.props.onNotAMatch(this.drivePhotoItems);
    this.moveToNext();
  }

  handleSave() {
    this.props.onSave();
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

    const identicalDrivePhotos: IdenticalPhotos = this.unmatchedPhotos[this.state.drivePhotoIndex];
    this.drivePhotoItems = identicalDrivePhotos.photoItems;
    // TODO, for now ignore matchedPhotoGroupIndex
    const drivePhotoItem : PhotoItem = this.drivePhotoItems[0];
    // const drivePhotoHash: string = identicalDrivePhotos.hash;
    // const drivePhotoKey: string = identicalDrivePhotos.key;

    const closestGooglePhoto : ClosestHashSearchResult = identicalDrivePhotos.closestGooglePhoto;

    // closestGooglePhoto.googlePhotoHash - doesn't include aspectRatio, but it needs to.
    const googlePhotosByHash: PhotosByHash = this.props.googlePhotosByHash;
    const nonMatchingGooglePhotos: IdenticalPhotos = googlePhotosByHash[closestGooglePhoto.googlePhotoHash];
    if (!nonMatchingGooglePhotos) {
      debugger;
    }
    const googlePhotoItems: PhotoItems = nonMatchingGooglePhotos.photoItems;
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
                onClick={this.handleNotAMatch.bind(this)}
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

CompareUnmatchedDriveToGooglePhotos.propTypes = {
  googlePhotosByHash: React.PropTypes.object.isRequired,
  photoComparisonResults: React.PropTypes.object.isRequired,
  drivePhotoToGooglePhotoComparisonResults: React.PropTypes.object.isRequired,
  onMatch: React.PropTypes.func.isRequired,
  onNotAMatch: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  readDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
};

export default CompareUnmatchedDriveToGooglePhotos;

