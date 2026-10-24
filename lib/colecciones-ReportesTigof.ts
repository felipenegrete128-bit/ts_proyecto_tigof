import * as fs from 'fs';/* El * en un import hace referencia a importar toda la biblioteca. */

export type Mina = {
  mina: string;
  tipoMaterial: string;
  grupo: string;
  distancia: number;
  pertenencia: string;
};

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

    const [mina = '', tipoMaterial = '', grupo = '', distanciaStr = '0', pertenencia = ''] = columnas;

    // Mina.distancia es number; convertir la coma decimal a punto antes de parsear.
    const distancia = Number.parseFloat(distanciaStr.replace(',', '.'));

    return {
      mina,
      tipoMaterial,
      grupo,
      distancia: Number.isNaN(distancia) ? 0 : distancia,
      pertenencia
    };
  });
}


export let minas = cargarMinasDesdeCSV('lib/Minas_Mineral.csv')

/* Función cargarMinasDesdeCSV */

// 1. Definición estricta de TipoVehiculo y Placa
export type TipoVehiculo = "Doble troque" | "Sencilla";

export type Placa = {
  placa: string;
  propiedad: string;
  capacidad: number;
  tipoVehiculo: TipoVehiculo;
};

/**
 * Objeto por defecto cuando no se encuentra la placa.
 * Se utiliza type casting ("" as TipoVehiculo) para cumplir con el tipo cuando está vacío.
 */
const PLACA_POR_DEFECTO: Placa = {
  placa: "",
  propiedad: "",
  capacidad: 0,
  tipoVehiculo: "" as TipoVehiculo
};

/**
 * Normaliza y valida que el texto del CSV sea un TipoVehiculo válido.
 */
function parseTipoVehiculo(valor: string): TipoVehiculo {
  const v = valor.trim().toLowerCase();
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
 * Valida si una placa del reporte de báscula pertenece a la flota registrada.
 */
export function esPlacaNuestra(placa: string, placas: Placa[]): Placa {
  if (!placa) {
    return PLACA_POR_DEFECTO;
  }

  const placaNormalizada = placa.replaceAll(' ', '').toUpperCase();

  const placaEncontrada = placas.find((p) => {
    const placaBaseLimpia = p.placa.replaceAll(' ', '').toUpperCase();
    return placaBaseLimpia === placaNormalizada;
  });

  return placaEncontrada ?? PLACA_POR_DEFECTO;
}

/**
 * Lee un archivo CSV local y mapea sus registros a una lista de objetos tipo Placa.
 */
export function cargarPlacaDesdeCSV(
  rutaArchivo: string,
  delimitador: string = ',',
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

/* Función tarifa */

