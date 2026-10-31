"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  calcularPesoNeto,
  definirRango,
  encontrarMina,
  esPlacaNuestra,
  obtenerFacturacion,
  obtenerTarifa,
  obtenerVehiculo,
} from "@/lib/funciones";
import type { Mina, Placa, Rango, Tarifa, TipoVehiculo } from "@/lib/tipos";

type ReporteRow = Record<string, unknown>;

type ReporteBasculaProps = {
  minas: Mina[];
  placas: Placa[];
  tarifas: Tarifa[];
};

const COLUMNAS_FINALES = [
  "Numero Consecutivo",
  "Item",
  "Fecha Registro",
  "Fecha Salida",
  "Placa Vehiculo",
  "Nombre Conductor",
  "Hora Registro",
  "Hora Salida",
  "Peso Entrada",
  "Peso Salida",
  "Peso Neto",
  "Tipo Vehiculo",
  "Propiedad",
  "Rango",
  "Tarifa",
  "Sobre Peso",
  "Sobre Peso Ton",
  "Facturacion",
];

const unicos = (valores: string[]) =>
  [...new Set(valores.map((v) => v.trim()).filter(Boolean))].sort();

// Campos del formulario de edición que se eligen de la lista de placas.
const OPCIONES_SELECT: Record<string, (placas: Placa[]) => string[]> = {
  "Tipo Vehiculo": (placas) => unicos(placas.map((p) => p.tipoVehiculo)),
};

// Campos con sugerencias de la lista de placas, pero que admiten texto libre.
const OPCIONES_SUGERIDAS: Record<string, (placas: Placa[]) => string[]> = {
  Propiedad: (placas) => unicos(placas.map((p) => p.propiedad)),
};

const formatoDecimal = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function aNumero(valor: unknown): number {
  if (typeof valor === "number") return valor;
  const texto = String(valor ?? "").trim().replace(/\s/g, "");
  const limpio = texto.includes(",")
    ? texto.replace(/\./g, "").replace(",", ".")
    : texto;
  return Number(limpio);
}

// Aplica los pasos 1 a 7 del spec; las filas descartadas pasan a revisión manual.
export function procesarFilas(
  filas: ReporteRow[],
  col: (nombre: string) => string,
  minas: Mina[],
  placas: Placa[],
  tarifas: Tarifa[]
) {
  const procesadas: ReporteRow[] = [];
  const revisar: ReporteRow[] = [];
  const anio = String(new Date().getFullYear());

  for (const fila of filas) {
    const pesoNeto = calcularPesoNeto(
      aNumero(fila[col("Peso Entrada")]),
      aNumero(fila[col("Peso Salida")])
    );
    if (!Number.isFinite(pesoNeto) || pesoNeto <= 0) {
      revisar.push(fila);
      continue;
    }

    const mina = encontrarMina(mostrarValor(fila[col("Item")]).trim(), minas);
    if (!mina.mina) {
      revisar.push(fila);
      continue;
    }

    const rango = definirRango(mina);
    const vehiculo = obtenerVehiculo(
      mostrarValor(fila[col("Placa Vehiculo")]),
      placas
    );
    const sobrePesoTon = Math.max(0, pesoNeto - vehiculo.capacidad);
    const tarifa = obtenerTarifa(rango, vehiculo.tipoVehiculo, anio, tarifas, mina.tipo);
    if (tarifa === 0) {
      revisar.push(fila);
      continue;
    }

    const resultado: ReporteRow = {};
    for (const nombre of COLUMNAS_FINALES) {
      resultado[nombre] = fila[col(nombre)];
    }
    Object.assign(resultado, {
      Item: mina.mina,
      "Peso Neto": formatoDecimal.format(pesoNeto),
      "Tipo Vehiculo": vehiculo.tipoVehiculo,
      Propiedad: vehiculo.propiedad,
      Rango: rango,
      Tarifa: formatoMoneda.format(tarifa),
      "Sobre Peso": sobrePesoTon > 0 ? "Verdadero" : "Falso",
      "Sobre Peso Ton": formatoDecimal.format(sobrePesoTon),
      Facturacion: formatoMoneda.format(obtenerFacturacion(tarifa, pesoNeto)),
    });
    procesadas.push(resultado);
  }

  return { procesadas, revisar };
}

function aMoneda(valor: unknown): number {
  const texto = String(valor ?? "").replace(/[^\d.,-]/g, "");
  return aNumero(/^\d{1,3}(\.\d{3})+$/.test(texto) ? texto.replace(/\./g, "") : texto);
}

// Paso 8: al editar un campo se recalculan los dependientes (pasos 1, 3, 4, 5, 6 y 7).
export function recalcularFila(
  valores: ReporteRow,
  campo: string,
  minas: Mina[],
  placas: Placa[],
  tarifas: Tarifa[]
): ReporteRow {
  const v: ReporteRow = { ...valores };

  if (campo === "Peso Entrada" || campo === "Peso Salida") {
    const neto = calcularPesoNeto(aNumero(v["Peso Entrada"]), aNumero(v["Peso Salida"]));
    v["Peso Neto"] = Number.isFinite(neto) ? formatoDecimal.format(neto) : "";
  }
  if (campo === "Item") {
    const mina = encontrarMina(mostrarValor(v.Item).trim(), minas);
    v.Rango = mina.mina ? definirRango(mina) : "";
  }
  if (campo === "Placa Vehiculo") {
    const veh = obtenerVehiculo(mostrarValor(v["Placa Vehiculo"]), placas);
    v["Tipo Vehiculo"] = veh.placa ? veh.tipoVehiculo : "";
    v.Propiedad = veh.placa ? veh.propiedad : "";
  }

  const neto = aNumero(v["Peso Neto"]);
  const veh = obtenerVehiculo(mostrarValor(v["Placa Vehiculo"]), placas);
  if (campo !== "Sobre Peso" && campo !== "Sobre Peso Ton") {
    if (Number.isFinite(neto) && veh.placa) {
      const exceso = Math.max(0, neto - veh.capacidad);
      v["Sobre Peso"] = exceso > 0 ? "Verdadero" : "Falso";
      v["Sobre Peso Ton"] = formatoDecimal.format(exceso);
    } else {
      v["Sobre Peso"] = "";
      v["Sobre Peso Ton"] = "";
    }
  }

  if (campo !== "Tarifa" && campo !== "Facturacion") {
    const rango = mostrarValor(v.Rango) as Rango;
    const tipo = mostrarValor(v["Tipo Vehiculo"]) as TipoVehiculo;
    const tipoMina = encontrarMina(mostrarValor(v.Item).trim(), minas).tipo;
    const t = obtenerTarifa(rango, tipo, String(new Date().getFullYear()), tarifas, tipoMina);
    v.Tarifa = t ? formatoMoneda.format(t) : "";
  }
  if (campo !== "Facturacion") {
    const t = aMoneda(v.Tarifa);
    v.Facturacion =
      Number.isFinite(neto) && t ? formatoMoneda.format(obtenerFacturacion(t, neto)) : "";
  }
  return v;
}

// Paso 8: convierte una fila de revisión manual en fila final; lo que no se puede calcular queda vacío.
export function construirFilaManual(
  fila: ReporteRow,
  col: (nombre: string) => string,
  minas: Mina[],
  placas: Placa[],
  tarifas: Tarifa[]
): ReporteRow {
  const resultado: ReporteRow = {};
  for (const nombre of COLUMNAS_FINALES) {
    resultado[nombre] = fila[col(nombre)];
  }
  const pesoNeto = calcularPesoNeto(
    aNumero(fila[col("Peso Entrada")]),
    aNumero(fila[col("Peso Salida")])
  );
  const mina = encontrarMina(mostrarValor(fila[col("Item")]).trim(), minas);
  const vehiculo = obtenerVehiculo(
    mostrarValor(fila[col("Placa Vehiculo")]),
    placas
  );
  const conPeso = Number.isFinite(pesoNeto);
  const conVehiculo = vehiculo.placa !== "";
  const rango = mina.mina ? definirRango(mina) : "";
  const tarifa =
    rango && conVehiculo
      ? obtenerTarifa(
          rango,
          vehiculo.tipoVehiculo,
          String(new Date().getFullYear()),
          tarifas,
          mina.tipo
        )
      : 0;
  const sobrePesoTon =
    conPeso && conVehiculo ? Math.max(0, pesoNeto - vehiculo.capacidad) : null;

  return Object.assign(resultado, {
    Item: mina.mina || resultado.Item,
    "Peso Neto": conPeso ? formatoDecimal.format(pesoNeto) : "",
    "Tipo Vehiculo": conVehiculo ? vehiculo.tipoVehiculo : "",
    Propiedad: conVehiculo ? vehiculo.propiedad : "",
    Rango: rango,
    Tarifa: tarifa ? formatoMoneda.format(tarifa) : "",
    "Sobre Peso":
      sobrePesoTon === null ? "" : sobrePesoTon > 0 ? "Verdadero" : "Falso",
    "Sobre Peso Ton":
      sobrePesoTon === null ? "" : formatoDecimal.format(sobrePesoTon),
    Facturacion:
      conPeso && tarifa
        ? formatoMoneda.format(obtenerFacturacion(tarifa, pesoNeto))
        : "",
  });
}

export function normalizarEncabezado(encabezado: string): string {
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
  accion,
}: {
  filas: ReporteRow[];
  columnas: string[];
  mensajeVacio: string;
  accion?: { titulo: string; onClick: (indice: number) => void };
}) {
  if (filas.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-gray-500">
        {mensajeVacio}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {columnas.map((columna) => (
              <th
                key={columna}
                scope="col"
                className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-medium"
              >
                {columna}
              </th>
            ))}
            {accion && (
              <th
                scope="col"
                className="border-b border-gray-200 px-4 py-3 font-medium"
              >
                Acción
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.map((fila, indice) => (
            <tr key={indice} className="hover:bg-gray-50">
              {columnas.map((columna) => (
                <td
                  key={columna}
                  className="whitespace-nowrap px-4 py-3 text-gray-700"
                >
                  {mostrarValor(fila[columna])}
                </td>
              ))}
              {accion && (
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="rounded-md border border-indigo-200 px-3 py-1 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => accion.onClick(indice)}
                  >
                    {accion.titulo}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReporteBascula({
  minas,
  placas,
  tarifas,
}: ReporteBasculaProps) {
  const [resultado, setResultado] = useState<Mina | null>(null);
  const [datosARevisar, setDatosARevisar] = useState<ReporteRow[]>([]);
  const [datosAAnalizar, setDatosAAnalizar] = useState<ReporteRow[]>([]);
  const [columnas, setColumnas] = useState<string[]>([]);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const colRef = useRef<(nombre: string) => string>((nombre) => nombre);
  const [edicion, setEdicion] = useState<{
    indice: number;
    valores: ReporteRow;
  } | null>(null);
  const [pestana, setPestana] = useState<"propias" | "revision">("propias");
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const inputArchivo = useRef<HTMLInputElement>(null);

  const enRevision = pestana === "revision";
  const filasPestana = enRevision ? datosARevisar : datosAAnalizar;
  const columnaFecha = enRevision
    ? colRef.current("Fecha Registro")
    : "Fecha Registro";
  const fechas = unicos(filasPestana.map((f) => mostrarValor(f[columnaFecha])));
  const textoBusqueda = busqueda.trim().toLocaleLowerCase();
  const filasFiltradas = filasPestana.filter(
    (fila) =>
      (!fechaFiltro || mostrarValor(fila[columnaFecha]) === fechaFiltro) &&
      (!textoBusqueda ||
        Object.values(fila).some((v) =>
          mostrarValor(v).toLocaleLowerCase().includes(textoBusqueda)
        ))
  );

  function editarFila(indice: number) {
    const fila = datosARevisar[indice];
    if (!fila) return;
    setEdicion({
      indice,
      valores: construirFilaManual(fila, colRef.current, minas, placas, tarifas),
    });
  }

  function agregarAPlacasPropias() {
    if (!edicion) return;
    setDatosAAnalizar((actuales) => [...actuales, edicion.valores]);
    setDatosARevisar((actuales) =>
      actuales.filter((_, i) => i !== edicion.indice)
    );
    setEdicion(null);
  }

  async function leerArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setErrorArchivo(null);
    setDatosARevisar([]);
    setEdicion(null);
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

      const propias: ReporteRow[] = [];
      const revisar: ReporteRow[] = [];

      for (const fila of datos) {
        const placa = mostrarValor(fila[columnaPlaca]);
        if (esPlacaNuestra(placa, placas)) {
          propias.push(fila);
        } else {
          revisar.push(fila);
        }
      }

      const col = (nombre: string) =>
        columnasReporte.find(
          (c) => normalizarEncabezado(c) === normalizarEncabezado(nombre)
        ) ?? nombre;
      const faltantes = ["Peso Entrada", "Peso Salida", "Item"].filter(
        (n) => !columnasReporte.includes(col(n))
      );
      if (faltantes.length > 0) {
        throw new Error(`Faltan columnas en el reporte: ${faltantes.join(", ")}.`);
      }

      const { procesadas, revisar: descartadas } = procesarFilas(
        propias,
        col,
        minas,
        placas,
        tarifas
      );

      colRef.current = col;
      setColumnas(columnasReporte);
      setDatosAAnalizar(procesadas);
      setDatosARevisar([...revisar, ...descartadas]);
    } catch (error) {
      setErrorArchivo(
        error instanceof Error
          ? error.message
          : "No fue posible leer el archivo de Excel."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-[96%] items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Reporte de báscula</h1>
            <p className="text-sm text-gray-500">Tigof y Cía Ingenieros</p>
          </div>
          <div>
            <input
              ref={inputArchivo}
              type="file"
              accept=".xlsx"
              id="archivo"
              className="hidden"
              onChange={leerArchivo}
            />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              onClick={() => inputArchivo.current?.click()}
            >
              <span aria-hidden="true">📊</span> Cargar archivo Excel
            </button>
            <button
              type="button"
              className="ml-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[96%] space-y-4 py-6">
        {errorArchivo && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorArchivo}
          </p>
        )}

        <section className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Nombre Mina"
            aria-label="Nombre Mina"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            onChange={(e) =>
              setResultado(encontrarMina(e.target.value, minas))
            }
          />
          {resultado && resultado.mina && (
            <p className="text-sm text-gray-600">
              La Mina {resultado.mina} su material es {resultado.tipoMaterial},
              pertenece al grupo {resultado.grupo}, tiene una distancia de{" "}
              {resultado.distancia} km y su rango está en{" "}
              {definirRango(resultado)}
            </p>
          )}
        </section>

        <nav
          className="flex gap-6 border-b border-gray-200"
          role="tablist"
          aria-label="Tablas del reporte"
        >
          {(
            [
              ["propias", "Registros placas nuestras", datosAAnalizar.length],
              ["revision", "Revisión manual", datosARevisar.length],
            ] as const
          ).map(([id, titulo, total]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={pestana === id}
              className={`-mb-px border-b-2 px-1 pb-3 text-sm font-medium ${
                pestana === id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setPestana(id);
                setFechaFiltro("");
                setEdicion(null);
              }}
            >
              {titulo} ({total})
            </button>
          ))}
        </nav>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                🔍
              </span>
              <input
                type="search"
                placeholder="Buscar en la tabla..."
                aria-label="Buscar en la tabla"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-72 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <select
              aria-label="Filtrar por fecha de registro"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Todas las fechas</option>
              {fechas.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <span className="ml-auto text-sm text-gray-500">
              {filasFiltradas.length} de {filasPestana.length} registros
            </span>
          </div>

          {enRevision ? (
            <TablaReporte
              filas={filasFiltradas}
              columnas={columnas}
              accion={{
                titulo: "Editar",
                onClick: (i) =>
                  editarFila(datosARevisar.indexOf(filasFiltradas[i])),
              }}
              mensajeVacio="No hay registros pendientes de revisión manual."
            />
          ) : (
            <TablaReporte
              filas={filasFiltradas}
              columnas={COLUMNAS_FINALES}
              mensajeVacio="No hay registros de placas propias para mostrar."
            />
          )}
        </section>

        {enRevision && edicion && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setEdicion(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEdicion(null);
            }}
          >
              <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-edicion"
                className="max-h-[90vh] w-full max-w-4xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  agregarAPlacasPropias();
                }}
              >
                  <h3 id="titulo-edicion" className="text-lg font-semibold">
                    Editar registro (fila {edicion.indice + 1})
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {COLUMNAS_FINALES.map((nombre) => {
                      const valor = mostrarValor(edicion.valores[nombre]);
                      const cambiar = (nuevo: string) =>
                        setEdicion({
                          ...edicion,
                          valores: recalcularFila(
                            { ...edicion.valores, [nombre]: nuevo },
                            nombre,
                            minas,
                            placas,
                            tarifas
                          ),
                        });
                      const opciones = OPCIONES_SELECT[nombre]?.(placas);
                      const sugerencias = OPCIONES_SUGERIDAS[nombre]?.(placas);

                      return (
                        <label key={nombre} className="flex flex-col text-sm">
                          {nombre}
                          {opciones ? (
                            <select
                              className="border border-gray-300 px-2 py-1"
                              value={valor}
                              onChange={(e) => cambiar(e.target.value)}
                            >
                              <option value="">Seleccione...</option>
                              {opciones.map((opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <input
                                type="text"
                                className="border border-gray-300 px-2 py-1"
                                value={valor}
                                list={sugerencias ? `lista-${nombre}` : undefined}
                                onChange={(e) => cambiar(e.target.value)}
                              />
                              {sugerencias && (
                                <datalist id={`lista-${nombre}`}>
                                  {sugerencias.map((s) => (
                                    <option key={s} value={s} />
                                  ))}
                                </datalist>
                              )}
                            </>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Agregar a placas propias
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setEdicion(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
          </div>
        )}
      </main>
    </div>
  );
}
