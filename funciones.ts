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
    return(false)
}

/* #Obtener rango de acuerdo a la distancia de la mina
def definir_rango(mina:dict)->str:
    "Devuelve el rango correspondiente a cada mina."
    "Parámetro: mina (Diccionario de la mina de cada registro)"
    "Retorno: Se extrae el rango de la mina de cada registro"
    rangos_minas = [
    {"min": 0, "max": 3, "nombre": "0 a 3"},
    {"min": 3.1, "max": 8, "nombre": "3,1 a 8"},
    {"min": 8.1, "max": 20, "nombre": "8,1 a 20"}
]
    distancia = mina['Distancia']# 1. Extrae la distancia del diccionario
    for rango in rangos_minas:# 2. Recorre RANGOS_MINAS    
        if rango['min'] <= distancia <= rango['max']:# 3. Compara si la distancia está dentro de cada rango (min y max)
            return rango['nombre']# 4. Cuando encuentres coincidencia, retorna el "nombre" del rango
    return None # 5. Si no encuentra nada 

    #Obtener tarifa
def obtener_tarifa(rango:str, tipo_vehiculo:str, ano:str, tarifas:list)->int:
    "Devuelve la tarifa luego de validar el rango y el tipo de vehiculo"
    "Parámetros: rango(rango de cada mina del registro), tipo_vehiculo(tipo de vehiculo de cada placa), ano(año al que aplica la tarifa consultada) y tarifas(Lista de tarifas, cada tarifa es un diccionario)"
    "Retorno: Se extrae la tarifa correspondinete"
    for t in tarifas:
        if t['Ano'] == ano:
            if t['Rango'] == rango and t['Tipo Vehiculo'] == tipo_vehiculo:
                return t['Tarifa']
    return 0*/

function definirRango(mina:Mina):string{

}

function obtenerTarifa(rango:Rango, tipoVehiculo: TipoVehiculo, anio:string, tarifas:Tarifa[]):number{

}

function name(params:type) {
    
}