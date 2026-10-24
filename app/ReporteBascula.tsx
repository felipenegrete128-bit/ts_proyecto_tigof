"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { definirRango, encontrarMina, esPlacaNuestra } from "@/lib/funciones";
import type { Mina, Placa } from "@/lib/colecciones";

type ReporteRow = Record<string, unknown>;

type ReporteBasculaProps = {
  minas: Mina[];
  placas: Placa[];
};

function normalizarEncabezado(encabezado: string): string {
  return encabezado
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

function mostrarValor(valor: unknown): string {
  if (valor instanceof Date) {
    return valor.toLocaleDateString();
  }

  return String(valor ?? "");
}

function TablaReporte({
  filas,
  columnas,
  mensajeVacio,
}: {
  filas: ReporteRow[];
  columnas: string[];
  mensajeVacio: string;
}) {
  if (filas.length === 0) {
    return <p>{mensajeVacio}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th
                key={columna}
                scope="col"
                className="border border-gray-300 px-3 py-2"
              >
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, indice) => (
            <tr key={indice}>
              {columnas.map((columna) => (
                <td
                  key={columna}
                  className="border border-gray-300 px-3 py-2"
                >
                  {mostrarValor(fila[columna])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReporteBascula({ minas, placas }: ReporteBasculaProps) {
  const [resultado, setResultado] = useState<Mina | null>(null);
  const [datosARevisar, setDatosARevisar] = useState<ReporteRow[]>([]);
  const [datosAAnalizar, setDatosAAnalizar] = useState<ReporteRow[]>([]);
  const [columnas, setColumnas] = useState<string[]>([]);
  const [mostrarRevisionManual, setMostrarRevisionManual] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);

  async function leerArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setErrorArchivo(null);
    setDatosARevisar([]);
    setDatosAAnalizar([]);
    setColumnas([]);

    try {
      const buffer = await archivo.arrayBuffer();
      const libro = XLSX.read(buffer, { type: "array" });
      const nombreHoja = libro.SheetNames[0];
      const hoja = nombreHoja ? libro.Sheets[nombreHoja] : undefined;

      if (!hoja) {
        throw new Error("El archivo no contiene una hoja con datos.");
      }

      const datos = XLSX.utils.sheet_to_json<ReporteRow>(hoja, {
        defval: "",
      });
      const columnasReporte = Object.keys(datos[0] ?? {});
      const columnaPlaca = columnasReporte.find(
        (columna) => normalizarEncabezado(columna) === "placa vehiculo"
      );

      if (!columnaPlaca) {
        throw new Error(
          'No se encontró la columna "Placa Vehiculo" en el reporte.'
        );
      }

      const datosAAnalizar: ReporteRow[] = [];
      const datosARevisar: ReporteRow[] = [];

      for (const fila of datos) {
        const placa = mostrarValor(fila[columnaPlaca]);
        if (esPlacaNuestra(placa, placas)) {
          datosAAnalizar.push(fila);
        } else {
          datosARevisar.push(fila);
        }
      }

      setColumnas(columnasReporte);
      setDatosAAnalizar(datosAAnalizar);
      setDatosARevisar(datosARevisar);
    } catch (error) {
      setErrorArchivo(
        error instanceof Error
          ? error.message
          : "No fue posible leer el archivo de Excel."
      );
    }
  }

  return (
    <main className="space-y-6 p-6">
      <section className="space-y-3">
        <input
          type="text"
          placeholder="Nombre Mina"
          aria-label="Nombre Mina"
          onChange={(e) =>
            setResultado(encontrarMina(e.target.value, minas))
          }
        />
        {resultado && resultado.mina && (
          <p>
            La Mina {resultado.mina} su material es {resultado.tipoMaterial},
            pertenece al grupo {resultado.grupo}, tiene una distancia de{" "}
            {resultado.distancia} km y su rango está en{" "}
            {definirRango(resultado)}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Reporte de báscula</h1>
        <div>
          <label htmlFor="archivo">Archivo de báscula</label>
          <input
            type="file"
            accept=".xlsx"
            id="archivo"
            onChange={leerArchivo}
          />
        </div>

        {errorArchivo && (
          <p role="alert" className="text-red-700">
            {errorArchivo}
          </p>
        )}

        <p>Filas leídas: {datosAAnalizar.length + datosARevisar.length}</p>

        <section aria-labelledby="titulo-analizar" className="space-y-3">
          <h2 id="titulo-analizar" className="text-xl font-semibold">
            Registros de placas propias ({datosAAnalizar.length})
          </h2>
          <TablaReporte
            filas={datosAAnalizar}
            columnas={columnas}
            mensajeVacio="No hay registros de placas propias para mostrar."
          />
        </section>

        <section aria-labelledby="titulo-revision" className="space-y-3">
          <h2 id="titulo-revision" className="text-xl font-semibold">
            Revisión manual ({datosARevisar.length})
          </h2>
          <button
            type="button"
            aria-expanded={mostrarRevisionManual}
            aria-controls="tabla-revision-manual"
            onClick={() => setMostrarRevisionManual((mostrar) => !mostrar)}
          >
            {mostrarRevisionManual ? "Ocultar" : "Ver"} registros para revisión
            manual ({datosARevisar.length})
          </button>
          {mostrarRevisionManual && (
            <div id="tabla-revision-manual" className="space-y-3">
              <TablaReporte
                filas={datosARevisar}
                columnas={columnas}
                mensajeVacio="No hay registros pendientes de revisión manual."
              />
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
