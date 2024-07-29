Lenguaje = s:Sentencia_completa* { return s }
Sentencia_completa = Sentencia_tipica_completa

Sentencia_tipica_completa = _* s:Sentencia_tipica EOS _* { return s }
Sentencia_tipica = Sentencia_de_definicion / Sentencia_de_datos / Sentencia_de_modulo / Sentencia_de_uso_de_modulo
Sentencia_de_modulo = _* "módulo" _*
    titulo:Negacion_de_clave_curvada_apertura Clave_curvada_apertura _*
    sentencias:Sentencia_tipica_completa* _* Clave_curvada_cierre
        { return { tipo: "sentencia de modalidad", titulo, sentencias } }

No_EOL = (!(EOL) .)* { return text().trim() }
No_EOS = (!(EOS) .)* { return text().trim() }

Sentencia_de_uso_de_modulo = _* Token_usar Token_modulo? _* modulo:No_EOS { return {tipo: "sentencia de uso de módulo", modulo } }
Token_usar = "usar"
Token_modulo = _* "módulo" 

Sentencia_de_datos =
    fecha:Fecha_negable ( Token_consiste_en / Token_igual )
    eventos:Linea_de_evento_empirico*
        { return { tipo: "sentencia de datos", ...fecha, eventos: eventos.map(evento => { evento.fecha = fecha; return evento; }) } }
Fecha_negable = 
    estado:("!")? _*
    fecha:Fecha
    identificador:Texto_entre_claves_cuadradas?
        { return { computable: estado !== "!", fecha, identificador } }
Fecha = Clave_cuadrada_apertura fecha:Token_de_fecha Clave_cuadrada_cierre { return fecha }
Hora = Clave_cuadrada_apertura hora:Token_de_hora Clave_cuadrada_cierre { return hora }
Token_de_fecha = anio:Token_de_fecha_para_anio "/" mes:Token_de_fecha_para_mes "/" dia:Token_de_fecha_para_dia { return { anio, mes, dia } }
Token_de_fecha_para_anio = Digito Digito Digito Digito Digito? { return parseInt(text()) }
Token_de_fecha_para_mes = Digito Digito? { return parseInt(text()) }
Token_de_fecha_para_dia = Digito Digito? { return parseInt(text()) }
Token_de_fecha_para_hora = Digito Digito? { return parseInt(text()) }
Token_de_fecha_para_minuto = Digito Digito? { return parseInt(text()) }
Token_de_hora = horas:Token_de_fecha_para_hora ":" minutos:Token_de_fecha_para_minuto { return { horas, minutos } }
Clave_cuadrada_apertura = _* "[" _*
Clave_cuadrada_cierre = _* "]" _*
Negacion_de_clave_cuadrada_cierre = ( !(Clave_cuadrada_cierre) .)* { return text().trim() }
Texto_entre_claves_cuadradas = Clave_cuadrada_apertura texto:Negacion_de_clave_cuadrada_cierre Clave_cuadrada_cierre { return texto }
Linea_de_evento_empirico = _*
    hora:Hora _*
    fenomenos:Lista_de_fenomenos _* Token_asterisco _*
    cantidad:Monto_de_tiempo_o_unidades_negable
        { return { hora, fenomenos, cantidad } }
Token_asterisco = "*"
Monto_de_tiempo_o_unidades = ( Cantidad_de_unidades / Cantidad_de_tiempo )
Monto_de_tiempo_o_unidades_negable = 
    estado:("!")? _*
    cantidad:( Cantidad_de_unidades / Cantidad_de_tiempo )
        { return { completado: estado !== "!", cantidad } }
Numero = ("-")? _* [0-9]+ { return text() }
Digito = [0-9] { return text() }
Numero_decimal = ("-")? _* [0-9]+ ("." [0-9]+)? { return text() }

Cantidad_de_tiempo = 
    dias:Cantidad_de_dias?
    horas:Cantidad_de_horas?
    minutos:Cantidad_de_minutos?
        { return { dias, horas, minutos } }
Cantidad_de_unidades = _* unidades:Numero "u" { return unidades }
Cantidad_de_dias = _* dias:Numero "d" { return dias }
Cantidad_de_horas = _* horas:Numero "h" { return horas }
Cantidad_de_minutos = _* minutos:Numero "min" { return minutos }

Lista_de_fenomenos = _*
    fenomenos:Conjunto_de_fenomenos_2
        { return { fenomenos } }

Porcentaje_de_efectividad_explicable = 
    efectividad:Porcentaje_de_efectividad
    explicacion:Explicacion_de_modificador?
        { return { efectividad, explicacion } }

Conjunto_de_fenomenos_2 = 
    fenomeno_1:Fenomeno
    fenomeno_n:Fenomeno_precedido_por_coma*
        { return [fenomeno_1].concat(fenomeno_n) }
Fenomeno_precedido_por_coma = _* "," _*
    fenomeno:Fenomeno
        { return fenomeno }

Suma_de_porcentajes_de_matiz = Suma_de_porcentaje+
Suma_de_porcentaje = _* porcentaje:Porcentaje_simple explicacion:Explicacion_de_modificador? { return { porcentaje, explicacion } }

Explicacion_de_modificador = _* "[" explicacion:Negacion_de_clave_cuadrada_cierre "]" { return explicacion }

Token_suma_o_resta = ("+" / "-") { return text() }
Sentencia_de_definicion =
    nombre:Explicacion_de_modificador?
    subtipo:Prependice_de_tipo?
    fenomeno:Fenomeno
    limites:Alertas_de_minimos_y_maximos_asociados?
    composicion:Prependice_de_definicion? { return { tipo: "sentencia de definición", subtipo, fenomeno, limites, nombre, composicion } }
Prependice_de_definicion = ( Token_consiste_en / Token_igual )
    composicion:Conjunto_de_fenomenos_1 { return composicion }
Prependice_de_tipo = _* "@" tipo:Negacion_de_espacio_simple _+ { return tipo }
Negacion_de_espacio_simple = (!(_).)+ { return text() }
Fenomeno = Clave_curvada_apertura texto:Negacion_de_clave_curvada_cierre Clave_curvada_cierre { return texto }
Clave_curvada_apertura = _* "{" _*
Clave_curvada_cierre = _* "}"
Negacion_de_clave_curvada_cierre = ( !(Clave_curvada_cierre) .)* { return text().trim() }
Negacion_de_clave_curvada_apertura = ( !(Clave_curvada_apertura) .)* { return text().trim() }
Token_consiste_en = _* "consiste en" _* ":" _*
Token_igual = _* "=" _*
Conjunto_de_fenomenos_1 = Linea_de_fenomeno_atomico+

Alertas_de_minimos_y_maximos_asociados = Alerta_de_minimo_o_maximo+
Alerta_de_minimo_o_maximo = _* "{" _* 
    desde:Subsentencia_desde_para_alerta?
    hasta:Subsentencia_hasta_para_alerta?
    limite:Subsentencia_maximo_o_minimo_para_alerta?
    cada:Subsentencia_cada_para_alerta?
    _* "}"
        { return { desde, hasta, limite, cada } }
Subsentencia_desde_para_alerta = _* "desde" _* fecha:Token_de_fecha  { return fecha }
Subsentencia_hasta_para_alerta = _* "hasta" _* fecha:Token_de_fecha { return fecha }
Subsentencia_maximo_o_minimo_para_alerta = _* limite:Token_maximo_o_minimo _* cantidad:Monto_de_tiempo_o_unidades  { return { limite, cantidad } }
Subsentencia_cada_para_alerta = _* "cada" _* tiempo:Cantidad_de_tiempo { return tiempo }
Token_maximo_o_minimo = particula:("máximo"/"máx"/"mínimo"/"mín") { return particula.startsWith("máx") ? "máximo" : "mínimo" }

Linea_de_fenomeno_atomico = _*
    polaridad:Signo_polar
    fenomeno:Fenomeno
    efectividad:Porcentaje_de_efectividad?
        { return { polaridad, efectividad: efectividad ? efectividad : 1, fenomeno } }

Porcentaje_de_efectividad = _* Token_asterisco _* efectividad:Numero_decimal _* "%" { return parseInt(efectividad) / 100; }
Porcentaje_simple = _* porcentaje:Numero_decimal _* "%" { return parseInt(porcentaje) / 100; }

Signo_polar = __* polaridad:("+" / "-") { return polaridad }

EOL "eol" = ___
EOS "eos" = _* "."
_ "espacio o linea" = __ / ___
__ "espacio" = "\t" / " "
___ "linea" = "\r\n" / "\r" / "\n"