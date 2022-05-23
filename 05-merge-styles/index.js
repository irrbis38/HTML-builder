const fs = require("fs");
const path = require("path");

fs.writeFile(
  path.join(__dirname, "project-dist", "bundle.css"),
  "",
  (error) => {
    if (error) throw error;
  }
);

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  function (error, files) {
    if (error) throw error;
    for (let file of files) {
      if (file.isFile() && /\.css$/gi.test(file.name)) {
        const stream = fs.createReadStream(
          path.join(__dirname, "styles", file.name),
          "utf-8"
        );

        let result = "";

        stream.on("data", (chunk) => (result += chunk));
        stream.on("end", () => {
          fs.appendFile(
            path.join(__dirname, "project-dist", "bundle.css"),
            result,
            (error) => {
              if (error) throw error;
            }
          );
        });
        stream.on("error", (error) => console.error(error.message));
      }
    }
  }
);
