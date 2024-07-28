const child_process = require("child_process");

child_process.execSync("npx pegjs -o mentemetria.js mentemetria.pegjs", {
  cwd: __dirname
});

child_process.execSync("npx pegjs --output mentemetria.web.js --format globals --export-var mentemetria_parser mentemetria.pegjs", {
  cwd: __dirname
});

require("fs").copyFileSync(__dirname + "/mentemetria.web.js", __dirname + "/../lib/mentemetria/mentemetria.web.js");