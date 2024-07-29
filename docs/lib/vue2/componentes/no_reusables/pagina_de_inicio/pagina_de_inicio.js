return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/pagina_de_inicio/pagina_de_inicio.js",
  "lib/vue2/componentes/no_reusables/pagina_de_inicio", [

], async function (mentemetria) {
  return {
    name: "pagina-de-inicio",
    templateUrl: "lib/vue2/componentes/no_reusables/pagina_de_inicio/pagina_de_inicio.xml",
    data() {
      return {
        seccion_seleccionada: "Script",
        nombre_del_nuevo_script: "",
        script_abierto: "",
        script_abierto_ast: undefined,
        error_de_script_abierto: undefined,
        es_script_valido: false,
        esta_script_pendiente_de_validacion: false,
        contador_de_script: undefined,
        datos_de_estadisticas: undefined,
        tipos_de_dato: undefined,
        acciones_de_estadisticas_mostrandose: {},
        acciones_de_estadisticas_mostrandose_maximizadas: [],
        panel_de_estadisticas_seleccionado: undefined,
        alertas_de_estadisticas_mostrandose_maximizadas: [],
        alertas_de_estadisticas_actuales_mostrandose_maximizadas: [],
        seccion_de_alertas_seleccionada: "Actuales",
        hoy: new Date()
      }
    },
    methods: {
      seleccionar_seccion(seccion) {
        this.seccion_seleccionada = seccion;
      },
      seleccionar_seccion_de_alerta(seccion) {
        if(this.seccion_de_alertas_seleccionada === seccion) {
          this.seccion_de_alertas_seleccionada = undefined;
        } else {
          this.seccion_de_alertas_seleccionada = seccion;
        }
        this.$forceUpdate(true);
      },
      validar_script() {
        this.guardar_script();
      },
      validar_script_con_retardo() {
        
      },
      pasar_fecha_de_objeto_a_texto(fecha) {
        const { anio, mes, dia } = fecha;
        let texto = "";
        texto += anio;
        texto += "/"
        texto += mes < 10 ? "0" + mes : "" + mes;
        texto += "/"
        texto += dia < 10 ? "0" + dia : "" + dia;
        return texto;
      },
      pasar_date_a_objeto(fecha) {
        let salida = "";
        const year = fecha.getFullYear();
        const month = fecha.getMonth() + 1;
        const day = fecha.getDate();
        salida += year;
        salida += "/";
        salida += month < 9 ? "0" + month : month;
        salida += "/";
        salida += day < 9 ? "0" + day : day;
        return salida;
      },
      pasar_hora_de_objeto_a_texto(hora) {
        const { horas, minutos } = hora;
        let texto = "";
        texto += (horas < 9) ? ("0" + horas) : ("" + horas);
        texto += ":";
        texto += (minutos < 9) ? ("0" + minutos) : ("" + minutos);
        if(horas < 12) {
          texto += "am";
        } else {
          texto += "pm";
        }
        return texto;
      },
      pasar_cantidad_de_tiempo_de_objeto_a_texto(hora) {
        const { dias, horas, minutos } = hora;
        let texto = "";
        if(dias) {
          texto += dias + "d";
        }
        if(horas) {
          if(texto.length) {
            texto += " ";
          }
          texto += horas + "h";
        }
        if(minutos) {
          if(texto.length) {
            texto += " ";
          }
          texto += minutos + "min";
        }
        return texto;
      },
      alternar_estadistica_alerta_minimaximizar(nombre) {
        const pos = this.alertas_de_estadisticas_mostrandose_maximizadas.indexOf(nombre);
        if(pos === -1) {
          this.alertas_de_estadisticas_mostrandose_maximizadas.push(nombre);
        } else {
          const sobrante = this.alertas_de_estadisticas_mostrandose_maximizadas.splice(pos, 1);
        }
        this.$forceUpdate(true);
      },
      alternar_estadistica_alerta_actual_minimaximizar(nombre) {
        const pos = this.alertas_de_estadisticas_actuales_mostrandose_maximizadas.indexOf(nombre);
        if(pos === -1) {
          this.alertas_de_estadisticas_actuales_mostrandose_maximizadas.push(nombre);
        } else {
          const sobrante = this.alertas_de_estadisticas_actuales_mostrandose_maximizadas.splice(pos, 1);
        }
        this.$forceUpdate(true);
      },
      alternar_estadistica_accion_minimaximizar(nombre) {
        const pos = this.acciones_de_estadisticas_mostrandose_maximizadas.indexOf(nombre);
        if(pos === -1) {
          this.acciones_de_estadisticas_mostrandose_maximizadas.push(nombre);
        } else {
          const sobrante = this.acciones_de_estadisticas_mostrandose_maximizadas.splice(pos, 1);
        }
        this.$forceUpdate(true);
      },
      cargar_script() {
        const contenido = window.localStorage.mentemetria_script_1;
        this.script_abierto = contenido;
        this.guardar_script();
      },
      recolectar_datos_de_objetivos(ast) {
        this.datos_de_estadisticas = window.mentemetria_estadisticas.extraer_estadisticas_de_ast(ast);
        this.tipos_de_dato = ["alertas", "acciones"].concat(Object.keys(this.datos_de_estadisticas.global.definiciones).reduce((output, item, index) => {
          const subtipo = this.datos_de_estadisticas.global.definiciones[item].subtipo;
          if(typeof subtipo !== "string") {
            return output;
          }
          if(subtipo === "") {
            return output;
          }
          if(output.indexOf(subtipo) === -1) {
            output.push(subtipo);
          }
          return output;
        }, []));
      },
      capitalizar_texto(texto) {
        if(typeof texto !== "string") {
          return texto;
        }
        return texto.substr(0,1).toUpperCase() + texto.substr(1);
      },
      alternar_estadistica_accion(nombre) {
        if(!(nombre in this.acciones_de_estadisticas_mostrandose)) {
          this.acciones_de_estadisticas_mostrandose[nombre] = false;
        }
        this.acciones_de_estadisticas_mostrandose[nombre] = !this.acciones_de_estadisticas_mostrandose[nombre];
        this.$forceUpdate(true);
      },
      alternar_estadistica_panel(panel_de_estadisticas_seleccionado) {
        if(this.panel_de_estadisticas_seleccionado === panel_de_estadisticas_seleccionado) {
          this.panel_de_estadisticas_seleccionado = undefined;
        } else {
          this.panel_de_estadisticas_seleccionado = panel_de_estadisticas_seleccionado;
        }
        this.$forceUpdate(true);
      },
      guardar_script() {
        try {
          console.log("Iniciando guardado...");
          const contenido = this.script_abierto;
          const ast = window.mentemetria_parser.parse(contenido);
          this.script_abierto_ast = ast;
          this.script_abierto_ast_formato_1 = this.recolectar_datos_de_objetivos(ast);
          window.localStorage.mentemetria_script_1 = contenido;
          this.error_de_script_abierto = false;
          this.es_script_valido = true;
          this.esta_script_pendiente_de_validacion = false;
          console.log("Script guardado");
        } catch (error) {
          // ok.
          this.script_abierto_ast = undefined;
          this.es_script_valido = false;
          this.error_de_script_abierto = error;
          this.esta_script_pendiente_de_validacion = false;
          console.log(error);
          console.log("Guardado fallado.");
        } finally {
          this.$forceUpdate(true);
        }
      },
      guardar_script_con_dilacion() {
        this.esta_script_pendiente_de_validacion = true;
        clearTimeout(this.contador_de_script);
        this.contador_de_script = setTimeout(() => {
          this.guardar_script();
        }, 1000 * 2);
      }
    },
    mounted: function () {
      this.cargar_script();
    }
  };
});