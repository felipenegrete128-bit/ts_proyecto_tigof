import * as fs from 'fs';/* El * en un import hace referencia a importar toda la biblioteca. */
import {Placa, Mina, Tarifa, TipoMina, TipoVehiculo, Rango} from "./tipos";

/**
 * Lee un archivo CSV local y mapea sus registros a una lista de objetos tipo Mina.
 * 
 * @param rutaArchivo - Ruta relativa o absoluta del archivo CSV.
 * @param delimitador - Carácter separador de columnas (por defecto ',').
 * @param tieneEncabezado - Indica si la primera fila contiene los nombres de las columnas (por defecto true).
 * @returns Lista de objetos tipo Mina.
 */
export function cargarMinasDesdeCSV(
  rutaArchivo: string,
  delimitador: string = ';',
  tieneEncabezado: boolean = true
): Mina[] {
  // 1. Verificar la existencia del archivo
  if (!fs.existsSync(rutaArchivo)) {
    throw new Error(`El archivo CSV no fue encontrado en la ruta: ${rutaArchivo}`);/* throw new Error, se usan para lanzar o crear un error y un mensaje para este error. */
  }
    /*Al momento de lanzar un error, se corta la ejecución porque hubo un error. */

  // 2. Leer el contenido en codificación UTF-8
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');/* utf-8 es la codificación para leer tildes y ñ dentro del archivo. */

  // 3. Dividir el contenido por líneas (compatible con Windows \r\n y Unix \n) y omitir líneas vacías
  const lineas = contenido
    .split(/\r?\n/)/* Por cada salto de línea se divide y hace una lista, aplicado a contenido. Divide el string grande contenido en varios elementos string contenidos en lineas. */
    .map((linea) => linea.trim())/* Mapeamos una lista, es decir, recorremos la lista. Como si aplicaramos un for, para que con .trim eliminemos espacios adelante y detrás */
    .filter((linea) => linea.length > 0);/* Filtramos apra identificar elementos que tengan más de 0 carácteres */

  if (lineas.length === 0) {/* Validamos que el tamaño de lineas sea igual a 0 y de ser así lo guardamos en una lista vacía. */
    return [];
  }

  // 4. Omitir la fila del encabezado si aplica
  const filas = tieneEncabezado ? lineas.slice(1) : lineas;/* Valida si tiene o no encabezado, de ser verdadero corta esa lína y sino deja lineas como el original. */

  // 5. Mapear cada fila al tipo Mina
  return filas.map((linea): Mina => {
    // Quitar espacios y comillas envolventes de cada columna.
    const columnas = linea.split(delimitador).map((columna) => {
      const valor = columna.trim();
      return valor.replace(/^("|')(.*)\1$/, '$2').trim();
    });

    const [mina = '', tipoMaterial = '', grupo = '', distanciaStr = '0', pertenencia = '', tipo = ''] = columnas;

    // Mina.distancia es number; convertir la coma decimal a punto antes de parsear.
    const distancia = Number.parseFloat(distanciaStr.replace(',', '.'));

    return {
      mina,
      tipoMaterial,
      grupo,
      distancia: Number.isNaN(distancia) ? 0 : distancia,
      pertenencia,
      tipo: "Superficie"
    };
  });
}


export let minas = cargarMinasDesdeCSV('lib/Minas_Mineral.csv')

/* Función cargarPlacasDesdeCSV */

/**
 * Objeto por defecto cuando no se encuentra la placa.
 * Se utiliza type casting ("" as TipoVehiculo) para cumplir con el tipo cuando está vacío.
 */
const PLACA_VACIA: Placa = {
  placa: "",
  propiedad: "",
  capacidad: 0,
  tipoVehiculo: "Sencilla"
};

/**
 * Normaliza y valida que el texto del CSV sea un TipoVehiculo válido.
 */
function parseTipoVehiculo(valor: string): TipoVehiculo {
  const v = valor.trim().toLowerCase().replace(/_/g, " ");
  if (v === "doble troque" || v === "dobletroque") {
    return "Doble troque";
  }
  if (v === "sencilla") {
    return "Sencilla";
  }
  // Valor de respaldo (fallback) por defecto
  return "Sencilla";
}

/**
 * Normaliza y valida que el texto del CSV sea un TipoMina válido.
 */
function parseTipoMina(valor: string): TipoMina {
  const v = valor.trim().toLowerCase().replace(/_/g, " ");
  if (v === "superficie") {
    return "Superficie";
  }
  if (v === "socavón" || v === "socavon") {
    return "Socavón";
  }
  // Valor de respaldo (fallback) por defecto
  return "Superficie";
}

/**
 * Valida si una placa del reporte de báscula pertenece a la flota registrada.
 */
export function esPlacaNuestra(placa: string, placas: Placa[]): Placa {
  if (!placa) {
    return PLACA_VACIA;
  }

  const placaNormalizada = placa.replaceAll(' ', '').toUpperCase();

  const placaEncontrada = placas.find((p) => {
    const placaBaseLimpia = p.placa.replaceAll(' ', '').toUpperCase();
    return placaBaseLimpia === placaNormalizada;
  });

  return placaEncontrada ?? PLACA_VACIA;/* Aquí lo que hacemos es, que en caso de no existir placaEncontrada retornar PLACA_VACIA */
}

/**
 * Lee un archivo CSV local y mapea sus registros a una lista de objetos tipo Placa.
 */
export function cargarPlacaDesdeCSV(
  rutaArchivo: string,
  delimitador: string = ';',
  tieneEncabezado: boolean = true
): Placa[] {
  if (!fs.existsSync(rutaArchivo)) {
    throw new Error(`El archivo CSV no fue encontrado en la ruta: ${rutaArchivo}`);
  }

  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');

  const lineas = contenido
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0);

  if (lineas.length === 0) {
    return [];
  }

  const filas = tieneEncabezado ? lineas.slice(1) : lineas;

  return filas.map((linea) => {
    const columnas = linea
      .split(delimitador)
      .map((col) => col.replace(/^["'](.*)["']$/, '$1').trim());

    const [
      placaRaw = '',
      propiedad = '',
      capacidadStr = '0',
      tipoVehiculoRaw = ''
    ] = columnas;

    const placa = placaRaw.replaceAll(' ', '').toUpperCase();
    const capacidadLimpia = capacidadStr.replace(',', '.');
    const capacidad = parseFloat(capacidadLimpia);

    return {
      placa,
      propiedad,
      capacidad: isNaN(capacidad) ? 0 : capacidad,
      tipoVehiculo: parseTipoVehiculo(tipoVehiculoRaw) // Mapeo seguro al tipo de unión
    };
  });
}

/* FUNCIÓN TARIFA */
/**
 * Normaliza y valida que el valor del CSV coincida con las opciones válidas de Rango.
 */
function parseRango(valor: string): Rango {
  const v = valor.trim().toLowerCase().replace('.', ',');

  if (v.includes('0') && v.includes('3')) return "0 a 3";
  if (v.includes('3') && v.includes('8')) return "3,1 a 8";
  if (v.includes('8') && v.includes('20')) return "8,1 a 20";

  // Valor por defecto en caso de un dato mal formateado
  return "0 a 3";
}

/**
 * Lee un archivo CSV local y mapea sus registros a una lista de objetos tipo Tarifa. * 
 * @param rutaArchivo - Ruta relativa o absoluta del archivo CSV (por defecto 'Tarifas_M&E.csv').
 * @param delimitador - Carácter separador de columnas (por defecto ',').
 * @param tieneEncabezado - Indica si la primera fila contiene los nombres de las columnas (por defecto true).
 * @returns Lista de objetos tipo Tarifa.
 */
export function cargarTarifaDesdeCSV(
  rutaArchivo: string = 'Tarifas_M&E.csv',
  delimitador: string = ';',
  tieneEncabezado: boolean = true
): Tarifa[] {
  // 1. Verificar la existencia del archivo
  if (!fs.existsSync(rutaArchivo)) {
    throw new Error(`El archivo CSV no fue encontrado en la ruta: ${rutaArchivo}`);
  }

  // 2. Leer el contenido en codificación UTF-8
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');

  // 3. Dividir el contenido por líneas y omitir líneas vacías
  const lineas = contenido
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0);

  if (lineas.length === 0) {
    return [];
  }

  // 4. Omitir la fila del encabezado si aplica
  const filas = tieneEncabezado ? lineas.slice(1) : lineas;

  // 5. Mapear cada fila al objeto Tarifa
  return filas.map((linea) => {
    const columnas = linea
      .split(delimitador)
      .map((col) => col.replace(/^["'](.*)["']$/, '$1').trim());

    const [
      rangoRaw = '',
      tipoVehiculoRaw = '',
      tarifaStr = '0',
      anioRaw = '',
      tipo = "Superficie"
    ] = columnas;

    // Convertir tarifa a número soportando miles y decimales con coma o punto
    const tarifaLimpia = tarifaStr.replace(/\s/g, '').replace(',', '.');
    const tarifa = parseFloat(tarifaLimpia);

    return {
      rango: parseRango(rangoRaw),
      tipoVehiculo: parseTipoVehiculo(tipoVehiculoRaw),
      tarifa: isNaN(tarifa) ? 0 : tarifa,
      anio: anioRaw.trim(),
      tipo : parseTipoMina(tipo)
    };
  });
}