Sistema_de_modulos.definir("vue", [], () => Vue);
Sistema_de_modulos.definir("vue-router", [], () => VueRouter);
Sistema_de_modulos.definir("vue-i18n", [], () => VueI18n);
Sistema_de_modulos.definir("jquery", [], () => jQuery);
Sistema_de_modulos.definir("ejs", [], () => ejs);
// Sistema_de_modulos.definir("socket.io", [], () => io);
Sistema_de_modulos.definir("mentemetria", [], () => {
  return {
    parser: window.mentemetria_parser,
    estadisticas: window.mentemetria_estadisticas
  };
});