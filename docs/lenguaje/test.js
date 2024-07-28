const fs = require("fs");
const child_process = require("child_process");
const mentemetria = require(__dirname + "/mentemetria.js");

child_process.execSync("npx pegjs mentemetria.pegjs", { cwd: __dirname });
child_process.execSync("npx pegjs --format globals --export-var Parser_de_mentemetria --output mentemetria.web.js mentemetria.pegjs", { cwd: __dirname });

setTimeout(() => {
  const ficheros = [__dirname + "/ejemplo-1.mm"];
  for(let i=0; i<ficheros.length; i++) {
    const fichero = ficheros[i];
    const contenido = fs.readFileSync(fichero).toString();
    const ast = mentemetria.parse(contenido);
    fs.writeFileSync(__dirname + "/ejemplo-1.json", JSON.stringify(ast, null, 4), "utf8");
  }
}, 3000);