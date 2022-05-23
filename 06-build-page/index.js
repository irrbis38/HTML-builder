const fs = require("fs");
const path = require("path");

async function createFolder() {
  return new Promise(function (resolve, reject) {
    fs.mkdir(
      path.join(__dirname, "project-dist", "assets"),
      { recursive: true },
      (error) => {
        if (error) reject();
        resolve();
      }
    );
  });
}

async function clearFolder() {
  return new Promise(function (resolve, reject) {
    fs.rm(
      path.join(__dirname, "project-dist", "assets"),
      { recursive: true },
      (error) => {
        if (error) reject(error);
        fs.mkdir(path.join(__dirname, "project-dist", "assets"), (error) => {
          if (error) reject(error);
          resolve();
        });
      }
    );
  });
}

async function copyAssets() {
  await createFolder();
  await clearFolder();

  return new Promise(function (resolve, reject) {
    fs.readdir(
      path.join(__dirname, "assets"),
      { withFileTypes: true },
      (error, data) => {
        if (error) reject(error);
        for (let item of data) {
          if (!item.isFile()) {
            fs.mkdir(
              path.join(__dirname, "project-dist", "assets", item.name),
              { recursive: true },
              (error) => {
                if (error) reject(error);
              }
            );

            fs.readdir(
              path.join(__dirname, "assets", item.name),
              (error, files) => {
                if (error) reject(error);

                for (let file of files) {
                  fs.copyFile(
                    path.join(__dirname, "assets", item.name, file),
                    path.join(
                      __dirname,
                      "project-dist",
                      "assets",
                      item.name,
                      file
                    ),
                    (err) => {
                      if (err) reject(err);
                    }
                  );
                }
              }
            );
          } else {
            fs.copyFile(
              path.join(__dirname, "assets", item.name),
              path.join(__dirname, "project-dist", "assets", item.name),
              (err) => {
                if (err) reject(err);
              }
            );
          }
        }

        resolve();
      }
    );
  });
}

async function createHtml() {
  return new Promise(function (resolve, reject) {
    fs.writeFile(
      path.join(__dirname, "project-dist", "index.html"),
      "",
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

async function createStyles() {
  return new Promise(function (resolve, reject) {
    fs.writeFile(
      path.join(__dirname, "project-dist", "style.css"),
      "",
      (error) => {
        if (error) reject(error);
        resolve();
      }
    );
  });
}

async function bundleStyles() {
  await createStyles();

  fs.readdir(
    path.join(__dirname, "styles"),
    { withFileTypes: true },
    (error, files) => {
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
              path.join(__dirname, "project-dist", "style.css"),
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
}

let getTemplate = new Promise(function (resolve, reject) {
  fs.readFile(path.join(__dirname, "template.html"), function (error, data) {
    if (error) reject(error);
    let arr = [];
    arr = data.toString();
    arr = arr.split("\n");
    arr = arr.map((item) => item.trim());

    resolve(arr);
  });
});

async function getComponents(component) {
  return new Promise(function (res, rej) {
    fs.readFile(
      path.join(__dirname, "components", `${component}.html`),
      (error, data) => {
        if (error) rej(error);
        res(data.toString());
      }
    );
  });
}

async function bundleHTML() {
  await createFolder();
  await copyAssets();
  await createHtml();
  await createStyles();
  await bundleStyles();
  const arr = await getTemplate;
  let finalBundle = [];

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].includes("{{")) {
      finalBundle.push(arr[i]);
    } else {
      let s = arr[i].match(/{{\w+}}/gi)[0];
      let subStr = s.slice(2, s.length - 2);
      let str = await getComponents(subStr);
      finalBundle.push(str);
    }
  }

  fs.appendFile(
    path.join(__dirname, "project-dist", "index.html"),
    finalBundle.join(""),
    (err) => {
      if (err) throw err;
    }
  );
}

bundleHTML();
