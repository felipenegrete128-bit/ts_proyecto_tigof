import path from "node:path";
import ReporteBascula from "./ReporteBascula";
import { cargarPlacaDesdeCSV, minas } from "@/lib/colecciones";

const placas = cargarPlacaDesdeCSV(
  path.join(process.cwd(), "lib", "Placas.csv")
);

export default function Home() {
  return <ReporteBascula minas={minas} placas={placas} />;
}
