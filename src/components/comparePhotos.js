// @flow

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class ComparePhotos extends Component {

  constructor(props: Object) {
    super(props);
    this.state = {
      photoGroupIndex: 0,
      photoGroups: []
    };
  }


  componentWillMount() {

    let photoGroups = [];

    switch(this.props.comparisonType) {
      case 'identicalGooglePhotos': {
        // for now, find the first google photo that has a match with other google photos
        const googlePhotosByHash = this.props.googlePhotosByHash;
        for (let hash in googlePhotosByHash) {
          if (googlePhotosByHash.hasOwnProperty(hash)) {
            const identicalPhotos = googlePhotosByHash[hash];
            const identicalGooglePhotos = identicalPhotos.photos;
            if (identicalGooglePhotos.length > 1) {
              photoGroups.push(identicalPhotos);
            }
          }
        }

        this.setState({photoGroups});

        break;
      }
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
      default: {
        debugger;
      }
    }
  }

  handleAllMatch() {
    console.log('handleNextMatch invoked');
    this.handleNextPhotoGroup();
  }

  handleNoneMatch() {
    console.log('handleNoneMatch invoked');
    this.handleNextPhotoGroup();
  }

  handleCheckedMatch() {
    console.log('handleCheckedMatch invoked');
  }

  handleNextPhotoGroup() {

    let photoGroupIndex = this.state.photoGroupIndex + 1;
    if (photoGroupIndex >= this.state.photoGroups.length) {
      photoGroupIndex = 0;
    }

    this.setState( { photoGroupIndex });
  }

  // handlePrevPhotoGroup() {
  //
  //   let photoGroupIndex = this.state.photoGroupIndex - 1;
  //   if (photoGroupIndex < 0 ) {
  //     photoGroupIndex = this.state.photoGroups.length - 1;
  //   }
  //
  //   this.setState( { photoGroupIndex });
  // }

  formatDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }

  togglePhotoSelection(_) {
    console.log("togglePhotoSelection");

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
  }

  getPhotosToDisplay(photos) {

    let self = this;

    const maxHeight = 400;

    let photosJSX = photos.map(function(photo) {

      let width = photo.getWidth();
      let height = photo.getHeight();

      let aspectRatio = width / height;
      if (height > maxHeight) {
        height = maxHeight;
        width = aspectRatio * height;
      }

      let dateTime = photo.getDateTime();
      let formattedDateTime = self.formatDateTime(dateTime);

      let exifDateTime = photo.getExifDateTime();
      let formattedExifDateTime = self.formatDateTime(exifDateTime);

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img
            className="thumbImg"
            src={photo.url}
            width={width}
            height={height}
          />
          <input id={photo.url} type="checkbox" className="thumbSelector"
            onClick={() => self.togglePhotoSelection(photo)}
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

  // getButtonButtonStyle(){
  //   return {
  //     height: '24px',
  //     width: '240px',
  //   };
  // }

  getButtonStyle() {
    return {
      height: '24px',
      width: '240px',
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

    const photoGroups = this.state.photoGroups[this.state.photoGroupIndex];
    if (!photoGroups) {
      return (
        <div>Loading...</div>
      );
    }

    // buttonStyle={this.getButtonButtonStyle()}

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
              <ul className="flex-container wrap">
                {this.getPhotosToDisplay(photoGroups.photos)}
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

  // diskImageUrl: React.PropTypes.string.isRequired,
  // googleImageUrl: React.PropTypes.string.isRequired,
};


export default ComparePhotos;
