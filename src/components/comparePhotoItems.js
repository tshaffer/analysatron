// @flow

const path = require('path');
const fs = require('fs');

import Photo from '../entities/photo';

import type { PhotoItem, PhotoItems } from '../types';

import React, { Component } from 'react';

import { convertPhoto } from '../utilities/photoUtilities';

import * as utils from '../utilities/utils';

class ComparePhotoItems extends Component {

  formatDateTime(dateTimeStr : string) {

    const dateTime = new Date(dateTimeStr);
    if (dateTime.toString().startsWith("Invalid")) {
      return dateTimeStr;
    }
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }

  getPhotoUrl(photo: Photo) {

    return photo.getUrl();

    // let url = photo.getUrl();
    //
    // if (url.startsWith('file:////E:')) {
    //   let newPath = photo.getPath().replace('E:\\RemovableMedia\\',
    //     '/Users/tedshaffer/Documents/RemovableMedia/');
    //   url = this.replaceAll(newPath, '\\', '/');
    //   url = 'file://' + url;
    // }
    //
    // return url;
  }

  // escapeRegExp(str : string) {
  //   return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  // }
  //
  // replaceAll(str : string, find : string, replace: string) {
  //   return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  // }

// <input id={photoItem.photo.getUrl()} type="checkbox" className="thumbSelector"
// onClick={() => this.togglePhotoSelection(photoItem)}
// />

  togglePhotoSelection(photoItem: PhotoItem) {
    console.log('poo');
    console.log(photoItem);
  }

  renderCheckBoxes(displayCheckBoxes: boolean, photoItem: PhotoItem) {

    if (displayCheckBoxes) {
      return (
        <input id={photoItem.photo.getUrl()} type="checkbox" className="thumbSelector"
          onClick={() => this.togglePhotoSelection(photoItem)}
        />
      );
    }
    else {
      return (
        null
      );
    }
  }


  renderName(photo: Photo) {
    return (
      <p>{'Name: ' + photo.getName()}</p>
    );
  }

  renderDateTime(photo: Photo) {
    let dateTime = photo.getDateTime();
    let formattedDateTime = this.formatDateTime(dateTime);
    return (
      <p>{'DateTime: ' + formattedDateTime}</p>
    );
  }

  renderExifDateTime(photo: Photo) {
    let exifDateTime = photo.getExifDateTime();
    let formattedExifDateTime = this.formatDateTime(exifDateTime);

    return (
      <p>{'ExifDateTime: ' + formattedExifDateTime}</p>
    );
  }

  renderWidth(photo : Photo) {
    return (
      <p>{'Width: ' + photo.getWidth()}</p>
    );
  }

  renderHeight(photo : Photo) {
    return (
      <p>{'Height: ' + photo.getHeight()}</p>
    );
  }

  renderAspectRatio(aspectRatio: number) {
    return (
      <p>{'Aspect ratio: ' + aspectRatio.toString()}</p>
    );
  }


  // renderHash(photo: Photo) {
  //   return (
  //     <p>{photo.getHash()}</p>
  //   );
  // }

  // renderPhotoSrc(photoSrc : string) {
  //   return (
  //     <p>{photoSrc}</p>
  //   );
  // }

// {self.renderPhotoSrc(photoSrc)}

  getDimensions(photo: Photo) {

    const maxHeight = 400;

    let width = Number(photo.getWidth());
    let height = Number(photo.getHeight());

    let aspectRatio = width / height;
    if (height > maxHeight) {
      height = maxHeight;
      width = aspectRatio * height;
    }

    let dimensions = {};
    dimensions.height = height;
    dimensions.width = width;
    dimensions.aspectRatio = aspectRatio;

    return dimensions;
  }

  getPhotosToDisplay(photoItems : PhotoItems) {

    let self = this;

    return photoItems.map(function(photoItem: PhotoItem) {

      const photo = photoItem.photo;

      const dimensions = self.getDimensions(photo);

      const photoSrc : string = self.getPhotoUrl(photo);
      console.log('photoSrc: ', photoSrc);
      const extension = path.extname(photoSrc).toLowerCase();
      if (extension === '.tif' || extension === '.tiff') {

        // // photoSrc:  file:////E:\RemovableMedia\9-1-2006\My Pictures\2006\01_January_3\_DSC3562.jpg
        //
        //    const targetPath = 'file:////C:\\Users\\Ted\\Documents\\Projects\\analysatron\\tmpFiles\\negscan04317443365a-85d7-a53e-5000-db3c34afbae1.jpg';
        // // const targetPath = 'file:////E:\\RemovableMedia\\9-1-2006\\My Pictures\\2006\\01_January_3\\_DSC3562.jpg';
        //
        // return self.renderPhotoLi(targetPath, dimensions, photoItem, photo);

        let photoFilePath = photoSrc;
        if (photoFilePath.startsWith('file://')) {
          photoFilePath = photoFilePath.slice(9);
        }

        let photoName = path.basename(photoFilePath).toLowerCase();
        let fileNameWithoutExtension = photoName.slice(0, -4);
        photoName = fileNameWithoutExtension + ".jpg";

        const targetDir = "C:\\Users\\Ted\\Documents\\Projects\\analysatron\\tmpFiles";
        const guid = utils.guid();
        let targetPath = path.join(targetDir, fileNameWithoutExtension + guid + ".jpg");
        console.log('convertPhoto then display it: ', photoFilePath);
        convertPhoto(photoFilePath, targetPath).then( () => {

          console.log('CONVERSION COMPLETE');

          // converted file should be at targetPath
          // TODO - don't know why, but it appears as though sometimes a '-0' is appended to the photo file name
          if (!fs.existsSync(targetPath)) {
            console.log(targetPath, ' converted file does not exist');
            targetPath = path.join(targetDir, fileNameWithoutExtension + guid + "-0.jpg");
            if (!fs.existsSync(targetPath)) {
              debugger;
            }
          }

          // photoSrc:  file:////E:\RemovableMedia\9-1-2006\My Pictures\2006\01_January_3\_DSC3562.jpg
          // targetPath = 'file:////C:\\Users\\Ted\\Documents\\Projects\\analysatron\\tmpFiles\\negscan04317443365a-85d7-a53e-5000-db3c34afbae1.jpg';
          if (!targetPath.startsWith('file://')) {
            targetPath = 'file:////' + targetPath;
          }
          // return self.renderPhotoLi(targetPath, dimensions, photoItem, photo);

        }).catch( (err) => {
          console.log(err);
          debugger;
        });
      }
      else {
        return self.renderPhotoLi(photoSrc, dimensions, photoItem, photo);
      }
    });
  }

  renderPhotoLi(photoSrc, dimensions, photoItem, photo) {

    let self = this;

    return (
      <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
        <img
          className="thumbImg"
          src={photoSrc}
          width={dimensions.width}
          height={dimensions.height}
        />
        {self.renderCheckBoxes(this.props.displayCheckBoxes, photoItem)}
        {self.renderName(photo)}
        {self.renderDateTime(photo)}
        {self.renderExifDateTime(photo)}
        {self.renderWidth(photo)}
        {self.renderHeight(photo)}
        {self.renderAspectRatio(dimensions.aspectRatio)}
      </li>
    );
  }

  render() {
    
    console.log('RENDER invoked');

    return (
      <ul className="flex-container wrap">
        {this.getPhotosToDisplay(this.props.photoItems)}
      </ul>
    );
  }
}

ComparePhotoItems.propTypes = {
  photoItems: React.PropTypes.array.isRequired,
  displayCheckBoxes: React.PropTypes.bool.isRequired
};

export default ComparePhotoItems;
