export type Placa={
    placa:string;
    propiedad:string;
    capacidad:number;
    tipoVehiculo:TipoVehiculo;
}

export type Mina={
    mina:string;
    tipoMaterial:string;
    grupo:string;
    distancia:number;
    pertenencia:string;
    tipo:TipoMina;
}

export type TipoMina = 'Superficie' | 'Socavón'

export type Rango = "0 a 3" | "3,1 a 8" | "8,1 a 20"

export type TipoVehiculo = "Doble troque" | "Sencilla"

export type Tarifa={
    rango:Rango;
    tipoVehiculo:TipoVehiculo;
    tarifa:number;
    anio:string;
    tipo:TipoMina;
}
