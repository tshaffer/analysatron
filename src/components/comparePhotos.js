// @flow

const fs = require('fs');

import type { PhotoItem, PhotoItems, IdenticalPhotos, PhotosByHash } from '../types';

// type CPState = {
//   identicalPhotoCollectionIndex: number,
//   identicalPhotoItemsCollection: Array<PhotoItems>
// };

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class ComparePhotos extends Component {

  constructor(props: Object) {
    super(props);

    // const cpState: CPState = {
    //   identicalPhotoCollectionIndex: 0,
    //   identicalPhotoItemsCollection: []
    // };

    // identicalPhotoItemsCollectionIndex : 0,
    //   identicalPhotoItemsCollection: []

    this.state = {
      identicalPhotoItemsCollectionIndex: 0,
      identicalPhotoItemsCollection: []
    };

    this.selectedPhotos = {};
  }

  state : Object;

  componentWillMount() {

    let identicalPhotoItemsCollection : Array<PhotoItems> = [];

    switch(this.props.comparisonType) {
      case 'identicalGooglePhotos': {
        const googlePhotosByHash : PhotosByHash = this.props.googlePhotosByHash;

        for (let hash in googlePhotosByHash) {

          if (googlePhotosByHash.hasOwnProperty(hash)) {
            const identicalPhotos : IdenticalPhotos = googlePhotosByHash[hash];
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
          const drivePhotosByHash : PhotosByHash = this.props.drivePhotosByHash;

          for (let hash in drivePhotosByHash) {

            if (drivePhotosByHash.hasOwnProperty(hash)) {
              const identicalPhotos : IdenticalPhotos = drivePhotosByHash[hash];
              const identicalPhotoItems : PhotoItems = identicalPhotos.photoItems;
              if (identicalPhotoItems.length > 1) {
                let photoItemsWithinIdenticalPhotosThatMayMatch : PhotoItems = [];
                identicalPhotoItems.forEach( (photoItem: PhotoItem) => {
                  if (photoItem.matchedPhotoGroupIndex === null || photoItem.matchedPhotoGroupIndex === undefined) {
                    if (photoItem.photo.path.startsWith('E:\\RemovableMedia\\')) {
                      let newPath = photoItem.photo.path.replace('E:\\RemovableMedia\\', '/Users/tedshaffer/Documents/RemovableMedia/');
                      newPath = this.replaceAll(newPath, '\\', '/');
                      if (fs.existsSync(newPath)) {
                        photoItem.photo.path = newPath;
                        photoItemsWithinIdenticalPhotosThatMayMatch.push(photoItem);
                      }
                    }
                    // photoItemsWithinIdenticalPhotosThatMayMatch.push(photoItem);
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


  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

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
    const googlePhotosByHash = this.props.googlePhotosByHash;
    const googlePhotosByHashStr = JSON.stringify(googlePhotosByHash, null, 2);
    fs.writeFileSync('googlePhotosByHash.json', googlePhotosByHashStr);
    console.log('googlePhotosByHash write complete.');
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

    // TODO - how to redisplay?
    // let identicalPhotoItemsCollectionIndex = this.state.identicalPhotoItemsCollectionIndex;
    // identicalPhotoItemsCollectionIndex++;
    // this.setState( { identicalPhotoItemsCollectionIndex });
    // identicalPhotoItemsCollectionIndex--;
    // this.setState( { identicalPhotoItemsCollectionIndex });

  }

  formatDateTime(dateTimeStr : string) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }

  getPhotosToDisplay(photoItems : PhotoItems) {

    let self = this;

    const maxHeight = 400;

    let photosJSX = photoItems.map(function(photoItem: PhotoItem) {

      const photo = photoItem.photo;
      let width = Number(photo.getWidth());
      let height = Number(photo.getHeight());

      let aspectRatio = width / height;
      if (height > maxHeight) {
        height = maxHeight;
        width = aspectRatio * height;
      }

      let dateTime = photo.getDateTime();
      let formattedDateTime = self.formatDateTime(dateTime);

      let exifDateTime = photo.getExifDateTime();
      let formattedExifDateTime = self.formatDateTime(exifDateTime);

      // src={photo.getUrl()}

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img
            className="thumbImg"
            src={photo.getPath()}
            width={width}
            height={height}
          />
          <input id={photo.getUrl()} type="checkbox" className="thumbSelector"
            onClick={() => self.togglePhotoSelection(photoItem)}
          />
          <p>{'Name: ' + photo.getName()}</p>
          <p>{'DateTime: ' + formattedDateTime}</p>
          <p>{'ExifDateTime: ' + formattedExifDateTime}</p>
          <p>{'Width: ' + photo.getWidth()}</p>
          <p>{'Height: ' + photo.getHeight()}</p>
          <p>{'Aspect ratio: ' + aspectRatio}</p>
          <p>{photo.getHash()}</p>
        </li>
      );
    });

    return photosJSX;
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
              <ul className="flex-container wrap">
                {this.getPhotosToDisplay(photoItems)}
              </ul>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ComparePhotos.propTypes = {
  googlePhotos: React.PropTypes.array.isRequired,
  comparisonType: React.PropTypes.string.isRequired,
  drivePhotosByHash: React.PropTypes.object.isRequired,
  googlePhotosByHash: React.PropTypes.object.isRequired,
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

