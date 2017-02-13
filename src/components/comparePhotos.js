// @flow

import Photo from '../entities/photo';
// import DrivePhoto from '../entities/drivePhoto';
// import GooglePhoto from '../entities/googlePhoto';

type PhotoItem = {
  photo: Photo,
  matchedPhotoGroupIndex: ?number
}
// https://flowtype.org/docs/quick-reference.html#type-aliases
type IdenticalPhotos = {
  hash: string,
  key: string,
  photoItems: Array<PhotoItem>,
  closestGooglePhoto: ClosestHashSearchResult
};

type PhotosByHash = { [hash:string]: IdenticalPhotos };

type MatchedPhoto = {
  drivePhotos: IdenticalPhotos,
  matchedGooglePhotos: IdenticalPhotos
};

type PhotoComparisonResults = {
  matchedPhotos: Array<MatchedPhoto>,
  unmatchedPhotos: Array<IdenticalPhotos>
};
type ClosestHashSearchResult = {
  minHashDistance: number,
  googlePhotoIndexOfMinHashDistance: number
}

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class ComparePhotos extends Component {

  state : Object;

  constructor(props: Object) {
    super(props);
    this.state = {
      identicalPhotoCollectionIndex: 0,
      identicalPhotosCollection: []
    };
  }


  componentWillMount() {

    let identicalPhotosCollection : Array<IdenticalPhotos> = [];

    switch(this.props.comparisonType) {
      case 'identicalGooglePhotos': {
        // for now, find the first google photo that has a match with other google photos
        const googlePhotosByHash : PhotosByHash = this.props.googlePhotosByHash;
        for (let hash in googlePhotosByHash) {
          if (googlePhotosByHash.hasOwnProperty(hash)) {
            const identicalPhotos : IdenticalPhotos = googlePhotosByHash[hash];
            const identicalGooglePhotoItems : Array<PhotoItem> = identicalPhotos.photoItems;
            if (identicalGooglePhotoItems.length > 1) {
              identicalPhotosCollection.push(identicalPhotos);
            }
          }
        }

        this.setState({identicalPhotosCollection});

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
    this.handleNextIdenticalPhotos();
  }

  handleNoneMatch() {
    console.log('handleNoneMatch invoked');
    this.handleNextIdenticalPhotos();
  }

  handleCheckedMatch() {
    console.log('handleCheckedMatch invoked');
  }

  handleNextIdenticalPhotos() {

    let identicalPhotoCollectionIndex = this.state.identicalPhotoCollectionIndex + 1;
    if (identicalPhotoCollectionIndex >= this.state.identicalPhotosCollection.length) {
      identicalPhotoCollectionIndex = 0;
    }

    this.setState( { identicalPhotoCollectionIndex });
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

  formatDateTime(dateTimeStr : string) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }

  togglePhotoSelection(_ : any) {
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

  getPhotosToDisplay(photoItems : Array<PhotoItem>) {

    let self = this;

    const maxHeight = 400;

    let photosJSX = photoItems.map(function(photoItem: PhotoItem) {

      const photo = photoItem.photo;
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

    // this.state.photoGroups : Array<IdenticalPhotos>
    // photosGroups : IdenticalPhotos

    const identicalPhotos = this.state.identicalPhotosCollection[this.state.identicalPhotoCollectionIndex];
    if (!identicalPhotos) {
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
                {this.getPhotosToDisplay(identicalPhotos.photoItems)}
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
