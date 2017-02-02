// @flow

const fs = require('fs');

export function readFile(filePath) {
  return new Promise( (resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

