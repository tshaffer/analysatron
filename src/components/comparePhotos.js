// @flow

const fs = require('fs');

import type { PhotoItem, PhotoItems, IdenticalPhotos, PhotosByHash } from '../types';

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import ComparePhotoItems from './comparePhotoItems';

class ComparePhotos extends Component {

  constructor(props: Object) {
    super(props);

    this.state = {
      identicalPhotoItemsCollectionIndex: 0,
      identicalPhotoItemsCollection: []
    };

    this.selectedPhotos = {};
  }

  state : Object;

  componentWillMount() {

    const parameters = this.props.parameters.ids.split(",");
    this.comparisonType = parameters[0];
    this.outputFileName = parameters[1];

    let identicalPhotoItemsCollection : Array<PhotoItems> = [];

    switch(this.comparisonType) {
      case 'identicalGooglePhotos': {

        this.photosByHash = this.props.googlePhotosByHash;

        for (let hash in this.photosByHash) {

          if (this.photosByHash.hasOwnProperty(hash)) {
            const identicalPhotos : IdenticalPhotos = this.photosByHash[hash];
            const identicalPhotoItems : PhotoItems = identicalPhotos.photoItems;
            if (identicalPhotoItems.length > 1) {
              let photoItemsWithinIdenticalPhotosThatMayMatch : PhotoItems = [];
              identicalPhotoItems.forEach( (photoItem: PhotoItem) => {
                if (photoItem.matchedPhotoGroupIndex === null || photoItem.matchedPhotoGroupIndex === undefined) {
                  photoItemsWithinIdenticalPhotosThatMayMatch.push(photoItem);
                }
              });

              if (photoItemsWithinIdenticalPhotosThatMayMatch.length > 1) {
                identicalPhotoItemsCollection.push(photoItemsWithinIdenticalPhotosThatMayMatch);
              }
            }
          }
        }

        this.setState( { identicalPhotoItemsCollection });
        break;
      }
      case 'identicalDrivePhotos':
        {
          this.photosByHash = this.props.drivePhotosByHash;

          for (let hash in this.photosByHash) {

            if (this.photosByHash.hasOwnProperty(hash)) {
              const identicalPhotos : IdenticalPhotos = this.photosByHash[hash];
              const identicalPhotoItems : PhotoItems = identicalPhotos.photoItems;
              if (identicalPhotoItems.length > 1) {
                let photoItemsWithinIdenticalPhotosThatMayMatch : PhotoItems = [];
                identicalPhotoItems.forEach( (photoItem: PhotoItem) => {
                  if (photoItem.matchedPhotoGroupIndex === null || photoItem.matchedPhotoGroupIndex === undefined) {
                    photoItem.photo.updatePath();
                    photoItemsWithinIdenticalPhotosThatMayMatch.push(photoItem);
                  }
                });

                if (photoItemsWithinIdenticalPhotosThatMayMatch.length > 1) {
                  identicalPhotoItemsCollection.push(photoItemsWithinIdenticalPhotosThatMayMatch);
                }
              }
            }
          }

          this.setState( { identicalPhotoItemsCollection });
          break;
        }


      default: {
        debugger;
      }
    }
  }

  selectedPhotos: Object;
  photosByHash : PhotosByHash;
  comparisonType: string;
  outputFileName: string;

  nextIdenticalPhotoCollection() {

    let identicalPhotoItemsCollectionIndex = this.state.identicalPhotoItemsCollectionIndex + 1;
    if (identicalPhotoItemsCollectionIndex >= this.state.identicalPhotoItemsCollection.length) {
      identicalPhotoItemsCollectionIndex = 0;
    }

    this.setState( { identicalPhotoItemsCollectionIndex });
  }

  handleAllMatch() {

    let minIndex : number = -1;
    const identicalPhotosItems : PhotoItems =
      this.state.identicalPhotoItemsCollection[this.state.identicalPhotoItemsCollectionIndex];
    identicalPhotosItems.forEach( (photoItem: PhotoItem) => {
      if (photoItem.matchedPhotoGroupIndex && photoItem.matchedPhotoGroupIndex > minIndex) {
        minIndex = photoItem.matchedPhotoGroupIndex;
      }
    });

    const newGroupIndex = minIndex + 1;
    const matchingPhotoItems : PhotoItems =
      this.state.identicalPhotoItemsCollection[this.state.identicalPhotoItemsCollectionIndex];
    matchingPhotoItems.forEach( (photoItem) => {
      photoItem.matchedPhotoGroupIndex = newGroupIndex;
    });

    this.nextIdenticalPhotoCollection();
  }

  handleNoneMatch() {

    const nonMatchingPhotoItems : PhotoItems =
      this.state.identicalPhotoItemsCollection[this.state.identicalPhotoItemsCollectionIndex];
    nonMatchingPhotoItems.forEach( (photoItem) => {
      photoItem.matchedPhotoGroupIndex = -1;
    });

    this.nextIdenticalPhotoCollection();
  }

  handleNext() {

    this.nextIdenticalPhotoCollection();

  }

  handlePrev() {

    let identicalPhotoItemsCollectionIndex = this.state.identicalPhotoItemsCollectionIndex - 1;
    if (identicalPhotoItemsCollectionIndex < 0) {
      identicalPhotoItemsCollectionIndex = this.state.identicalPhotoItemsCollection.length - 1;
    }

    this.setState( { identicalPhotoItemsCollectionIndex });
  }

  handleSave() {
    const photosByHashStr = JSON.stringify(this.photosByHash, null, 2);
    fs.writeFileSync(this.outputFileName, photosByHashStr);
    console.log('photosByHash write complete.');
  }

  togglePhotoSelection(photoItem : PhotoItem) {

    console.log("togglePhotoSelection");

    const photo = photoItem.photo;
    const key = photo.getUrl();

    if (this.selectedPhotos.hasOwnProperty(key)) {
      delete this.selectedPhotos[key];
    }
    else {
      this.selectedPhotos[key] = photoItem;
    }
  }

  handleCheckedMatch() {

    console.log('handleCheckedMatch invoked');

    let minIndex : number = -1;
    const identicalPhotosItems : PhotoItems =
      this.state.identicalPhotoItemsCollection[this.state.identicalPhotoItemsCollectionIndex];
    identicalPhotosItems.forEach( (photoItem: PhotoItem) => {
      if (photoItem.matchedPhotoGroupIndex && photoItem.matchedPhotoGroupIndex > minIndex) {
        minIndex = photoItem.matchedPhotoGroupIndex;
      }
    });

    const newIndex = minIndex + 1;
    for (let key in this.selectedPhotos) {
      if (this.selectedPhotos.hasOwnProperty(key)) {
        let photoItem = this.selectedPhotos[key];
        photoItem.matchedPhotoGroupIndex = newIndex;
      }
    }
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

    let self = this;

    const identicalPhotoItems = this.state.identicalPhotoItemsCollection[this.state.identicalPhotoItemsCollectionIndex];
    if (!identicalPhotoItems) {
      return (
        <div>Loading...</div>
      );
    }

    const photoItems : PhotoItems =
      this.state.identicalPhotoItemsCollection[this.state.identicalPhotoItemsCollectionIndex];

    return (
      <MuiThemeProvider>
        <div className="photoPageContainer">
          <div className="photosDiv">
            <div className="dayOfPhotosDiv" key={Math.random().toString()}>
              <RaisedButton
                label='All Match'
                onClick={self.handleAllMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='None Match'
                onClick={this.handleNoneMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Checked Match'
                onClick={this.handleCheckedMatch.bind(this)}
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
                label='Save'
                onClick={this.handleSave.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <ComparePhotoItems
                photoItems={photoItems}
                displayCheckBoxes={true}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ComparePhotos.propTypes = {
  googlePhotos: React.PropTypes.array.isRequired,
  drivePhotosByHash: React.PropTypes.object.isRequired,
  googlePhotosByHash: React.PropTypes.object.isRequired,
  parameters: React.PropTypes.object.isRequired,
};


export default ComparePhotos;

// diskImageUrl: React.PropTypes.string.isRequired,
// googleImageUrl: React.PropTypes.string.isRequired,

// handlePrevPhotoGroup() {
//
//   let photoGroupIndex = this.state.photoGroupIndex - 1;
//   if (photoGroupIndex < 0 ) {
//     photoGroupIndex = this.state.photoGroups.length - 1;
//   }
//
//   this.setState( { photoGroupIndex });
// }

// import DrivePhoto from '../entities/drivePhoto';
// import GooglePhoto from '../entities/googlePhoto';
// case 'identicalDrivePhotos':
// {
//   const drivePhotosByHash = this.props.drivePhotosByHash;
//   for (let hash in drivePhotosByHash) {
//     if (drivePhotosByHash.hasOwnProperty(hash)) {
//       const identicalPhotos = drivePhotosByHash[hash];
//       const identicalDrivePhotos = identicalPhotos.photos;
//       const closestGooglePhoto = identicalPhotos.closestGooglePhoto;
//       if (closestGooglePhoto.minHashDistance === 1 && identicalDrivePhotos.length > 1) {
//         debugger;
//       }
//     }
//   }
//   break;
// }

// if (this.selectedPhotos.hasOwnProperty(photo.dbId)) {
//   delete this.selectedPhotos[photo.dbId];
// }
// else {
//   this.selectedPhotos[photo.dbId] = photo;
// }
//
// let selectedPhotos = {};
//
// for (var property in this.selectedPhotos) {
//   if (this.selectedPhotos.hasOwnProperty(property)) {
//     selectedPhotos[property] = this.selectedPhotos[property];
//   }
// }
//
// this.props.updateSelectedPhotos(selectedPhotos);
// this.selectedPhotos = selectedPhotos;
// buttonStyle={this.getButtonButtonStyle()}

// getButtonButtonStyle(){
//   return {
//     height: '24px',
//     width: '240px',
//   };
// }

