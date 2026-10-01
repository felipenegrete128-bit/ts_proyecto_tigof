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

function calcularPesoNeto(pesoEntrada:number, pesoSalida:number):number {
    return((pesoEntrada - pesoSalida)/1000);
}

function esPlacaNuestra(placa:string, placas:Placa[]):boolean {
    placa = placa.replaceAll(' ','');
    placas.forEach(p => {
        if(p.placa == placa){
            return(true)
        }
    })
    /* return(p.placa == placa ? true : false)//Se usa este if ternario en casos de una sola condición */
    return(false)
}

function definirRango(mina:Mina):Rango{
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

function obtenerTarifa(rango:Rango, tipoVehiculo: TipoVehiculo, anio:string, tarifas:Tarifa[]):number{
tarifas.forEach(t => {
    if(t.anio == anio){
        if(t.rango == rango && t.tipoVehiculo == tipoVehiculo){
            return(t.tarifa)
        }
    }
})
return(0)
}
