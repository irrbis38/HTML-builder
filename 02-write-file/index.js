const path = require("path");
const fs = require("fs");
const readline = require("readline");
const process = require("process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Please, type some text\n",
});

const fileName = path.join(__dirname, "text.txt");
const newFile = fs.createWriteStream(fileName);

rl.prompt();

rl.on("line", (input) => {
  input.trim() === "exit" ? rl.close() : newFile.write(input + "\n");
});

rl.on("SIGINT", () => rl.close());

rl.on("close", () => {
  process.stdout.write("The end of typing");
  newFile.end();
});
