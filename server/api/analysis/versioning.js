'use strict';

import fs from 'fs';

function getFiles() {
  return fs.readdirSync('.');
}

function getNodegitDirs(listOfFiles) {
  var nodegitDirs = listOfFiles.filter(function (file) {
    if (file.startsWith('nodegit'))
      return file;
});
  return nodegitDirs
}

function getNewVersionNumber(nodegitDirs) {
    var maxVersion = -1;
    var version;
    nodegitDirs.forEach(dir => {
      version = parseInt(dir.split('-')[1]);
      if (version > maxVersion) maxVersion = version;
    })
    return maxVersion + 1;
}

export function getNewNodegitVersion() {
  var listOfFiles = getFiles();
  var nodegitDirs = getNodegitDirs(listOfFiles);
  var newVersionNumber = getNewVersionNumber(nodegitDirs);
  return 'nodegit-' + newVersionNumber;
}
