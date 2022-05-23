const fs = require("fs");
const path = require("path");

async function createFolder() {
  return new Promise(function (resolve, reject) {
    return fs.mkdir(
      path.join(__dirname, "files-copy"),
      { recursive: true },
      (error) => {
        if (error) reject(error);
        resolve();
      }
    );
  });
}

async function clearDir() {
  return new Promise(function (resolve, reject) {
    fs.rm(path.join(__dirname, "files-copy"), { recursive: true }, (error) => {
      if (error) reject(error);
      fs.mkdir(path.join(__dirname, "files-copy"), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
}

async function copy() {
  await createFolder();
  await clearDir();

  fs.readdir(path.join(__dirname, "files"), (error, files) => {
    if (error) throw error;

    for (let file of files) {
      fs.copyFile(
        path.join(__dirname, "files", file),
        path.join(__dirname, "files-copy", file),
        (error) => {
          if (error) throw error;
        }
      );
    }
  });
}

copy();
