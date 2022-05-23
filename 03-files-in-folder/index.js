const path = require("path");
const fs = require("fs");
const promises = require("fs/promises");

const folder = path.join(__dirname, "secret-folder");

promises
  .readdir(folder, { withFileTypes: true })
  .then((data) => {
    data.forEach((elem) => {
      fs.stat(path.join(folder, elem.name), (error, stats) => {
        if (error) throw error;
        if (!stats.isFile()) return;

        const fileExtension = path.extname(elem.name);
        const fileName = path.basename(elem.name, fileExtension);
        const fileSize = stats.size / 1024;

        fileName === elem.name
          ? console.log(
              `${fileExtension} - ${fileName.slice(1)} - ${fileSize}kb`
            )
          : console.log(
              `${fileName} - ${fileExtension.slice(1)} - ${fileSize}kb`
            );
      });
    });
  })
  .catch((err) => console.log(err));
