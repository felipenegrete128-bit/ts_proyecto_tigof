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
  delimitador: string = ',',
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
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0);

  if (lineas.length === 0) {
    return [];
  }

  // 4. Omitir la fila del encabezado si aplica
  const filas = tieneEncabezado ? lineas.slice(1) : lineas;

  // 5. Mapear cada fila al tipo Mina
  return [se quitó el vínculo sospechoso]((linea) => {
    // Dividir columnas y remover comillas residuales si existen
    const columnas = linea.split(delimitador).map((col) => col.replace(/^["'](.*)["']\$/, '\$1').trim());

    const [mina = '', tipoMaterial = '', grupo = '', distanciaStr = '0', pertenencia = ''] = columnas;

    // Convertir distancia a número con soporte para coma o punto decimal
    const distanciaLimpia = distanciaStr.replace(',', '.');
    const distancia = parseFloat(distanciaLimpia);

    return {
      mina,
      tipoMaterial,
      grupo,
      distancia: isNaN(distancia) ? 0 : distancia,
      pertenencia
    };
  });
}