import path from "node:path";
import ReporteBascula from "./ReporteBascula";
import {
  cargarPlacaDesdeCSV,
  cargarTarifaDesdeCSV,
  minas,
} from "@/lib/colecciones";

const placas = cargarPlacaDesdeCSV(
  path.join(process.cwd(), "lib", "Placas.csv")
);
const tarifas = cargarTarifaDesdeCSV(
  path.join(process.cwd(), "lib", "Tarifas_M&E.csv"),
  ";"
);

export default function Home() {
  return <ReporteBascula minas={minas} placas={placas} tarifas={tarifas} />;
}
