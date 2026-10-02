type Placa={
    placa:string;
    propiedad:string;
    capacidad:number;
    tipoVehiculo:TipoVehiculo;
}

type Mina={
    mina:string;
    tipoMaterial:string;
    grupo:string;
    distancia:number;
    pertenencia:string;
}

type Rango = "0 a 3" | "3,1 a 8" | "8,1 a 20"

type TipoVehiculo = "Doble troque" | "Sencilla"

type Tarifa={
    rango:Rango;
    tipoVehiculo:TipoVehiculo;
    tarifa:number;
    anio:string;
}

export function calcularPesoNeto(pesoEntrada:number, pesoSalida:number):number {
    return((pesoEntrada - pesoSalida)/1000);
}

export function esPlacaNuestra(placa:string, placas:Placa[]):boolean {
    placa = placa.replaceAll(' ','');
    placas.forEach(p => {
        if(p.placa == placa){
            return(true)
        }
    })
    /* return(p.placa == placa ? true : false)//Se usa este if ternario en casos de una sola condición */
    return(false)
}

export function definirRango(mina:Mina):Rango{
if(mina.distancia > 0 && mina.distancia <= 3){
    return("0 a 3")
}
else if(mina.distancia > 3 && mina.distancia <= 8){
    return("3,1 a 8")
}
else{
    return("8,1 a 20")
}
}

export function obtenerTarifa(rango:Rango, tipoVehiculo: TipoVehiculo, anio:string, tarifas:Tarifa[]):number{
tarifas.forEach(t => {
    if(t.anio == anio){
        if(t.rango == rango && t.tipoVehiculo == tipoVehiculo){
            return(t.tarifa)
        }
    }
})
return(0)
}

export function obtenerVehiculo(placa:string, placas:Placa[]):Placa{
    placa = placa.replaceAll(' ','');
    placas.forEach(p => {
        if(p.placa == placa){
            return(p)
        }
    })
    return({placa:"",propiedad:"", capacidad:0, tipoVehiculo:"Doble troque"})//Se crea una especie de diccionario vacio para llenar los datos que no cumplen nuestra condicón if, se aplica para Mina
}

// Función auxiliar para simular el .title() de Python
export function toTitleCase(texto: string): string {
  return texto.toLowerCase().replace(/(?:^|\s)\w/g, (letra) => letra.toUpperCase());//Se pasa todo el texto a minúsculas(toLowerCase)y luego la primera en mayúscula (toUpperCase), /(?:^|\s)\w/g => se llama regex
}

export function encontrarMina(mina:string, minas:Mina[]):Mina{//Aquí se busca que la función devuelva un objeto de tipo Mina
    const aliasMinas: Record<string, string> = {//Esta es la forma en TS de tipar un objeto donde claves y valores sean textos, const seria una variable constante.
        "PM-44-1 UPM EL MANZANILLO FINO MEDIO TENOR": "El Manzanillo",
        "ASM-2026-005-TP-GOLDEN BEAK-2.3<=Au<8.0 g/t":"Golden Beak",
        "ASM-2026-0015-TP-MINERALCO TERMINAL-8.0≤Au<15.0 g/tn":"Mineralco",
        "PM-117-1 OUTSOURCING EXPLOTACIONES GOLD CARLA":"Explotaciones Gold Carla",
        "ASM-2026-018 TP LA PALMICHALA 8.0≤Au<15.0 g/t":"La Palmichala",
        "PM-00-1 OUTSOURCING SK 3-7":"Sk 3-7"
    }
    if(mina in aliasMinas){
        mina = aliasMinas[mina];//Accede al valor mapeado
    }else if(mina.slice(0,2) == 'PP'){//Equivale a obtener los primeros 2 carácteres
        mina = mina.slice(3)//Equivale a recortar el texto del índice 3 en adelante
    }
    const minaBuscada = toTitleCase(mina);
    for (const m of minas) {
    if (m.mina.trim() === minaBuscada) {
      return m; // Retorna la mina encontrada y finaliza la funcion
    }
  }
  // 3. Objeto por defecto completo según el tipo Mina
  return({mina: "",tipoMaterial: "",grupo: "",distancia: 0,pertenencia: ""});//Si el bucle termina y no encuentra coincidencia, se ejecuta esta linea
}

export function obtenerFacturacion(tarifa:number, pesoNeto:number):number{
    return(tarifa * pesoNeto)
}