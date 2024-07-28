const child_process = require("child_process");

child_process.execSync("node mentemetria.cli.js ejemplo-1.mm", {
  cwd: __dirname,
  stdio: [process.stdin, process.stdout, process.stderr]
});
