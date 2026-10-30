import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";
import {
  cargarPlacaDesdeCSV,
  cargarTarifaDesdeCSV,
  minas,
} from "../lib/colecciones";
import { esPlacaNuestra } from "../lib/funciones";
import { procesarFilas, normalizarEncabezado } from "../app/ReporteBascula";

const carpeta = path.join("data", "Reportes_Bascula");
const archivo = fs.readdirSync(carpeta).find((f) => f.endsWith(".xlsx"))!;
const libro = XLSX.read(fs.readFileSync(path.join(carpeta, archivo)));
const datos = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  libro.Sheets[libro.SheetNames[0]],
  { defval: "" }
);
const cols = Object.keys(datos[0] ?? {});
const col = (n: string) =>
  cols.find((c) => normalizarEncabezado(c) === normalizarEncabezado(n)) ?? n;

const placas = cargarPlacaDesdeCSV(path.join("lib", "Placas.csv"));
const tarifas = cargarTarifaDesdeCSV(path.join("lib", "Tarifas_M&E.csv"), ";");
const propias = datos.filter((f) =>
  esPlacaNuestra(String(f[col("Placa Vehiculo")]), placas)
);
const { procesadas, revisar } = procesarFilas(propias, col, minas, placas, tarifas);

console.log("Columnas:", cols.join(" | "));
console.log({
  total: datos.length,
  propias: propias.length,
  procesadas: procesadas.length,
  revisarPorCalculo: revisar.length,
  noPropias: datos.length - propias.length,
});
console.table(procesadas.slice(0, 5));
console.log("Revisar (muestra):");
console.table(
  revisar.slice(0, 5).map((f) => ({
    Item: f[col("Item")],
    Placa: f[col("Placa Vehiculo")],
    Entrada: f[col("Peso Entrada")],
    Salida: f[col("Peso Salida")],
  }))
);

const manual = datos.find((f) => !esPlacaNuestra(String(f[col("Placa Vehiculo")]), placas) && f[col("Item")]);
if (manual) {
  const { construirFilaManual } = require("../app/ReporteBascula");
  console.log("Fila manual (sin calcular lo que falta):");
  console.table([construirFilaManual(manual, col, minas, placas, tarifas)]);
}
