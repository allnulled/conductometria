#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline/promises");
const mentemetria_parser = require(__dirname + "/mentemetria.js");
const debug = function(arg) {
  console.log(JSON.stringify(arg, null, 2));
}
const asts = { definiciones: [], datos: [], modalidades: [] };
const utilidades = {
  mezclar_asts_con_original: function(ast_aniadido) {
    for(let index=0; index<ast_aniadido.length; index++) {
      const item = ast_aniadido[index];
      if(item.tipo === "sentencia de definición") {
        asts.definiciones.push(item);
      } else if(item.tipo === "sentencia de datos") {
        asts.datos.push(item);
      } else if(item.tipo === "sentencia de modalidad") {
        asts.modalidades.push(item);
      }
    }
  }
};

const main = async function() {
  try {
    const args = process.argv;
    const files = args.slice(2);
    for(let index=0; index<files.length; index++) {
      const file = files[index];
      const contents = fs.readFileSync(file).toString();
      const ast_de_fichero = mentemetria_parser.parse(contents);
      utilidades.mezclar_asts_con_original(ast_de_fichero);
      console.log(asts);
    }
    debug(asts);
  } catch (error) {
    console.log(error);
  }
};

main();