/*Esta seria la base de la página y donde se harán todas las modificaciones que queramos ver*/

import Image from "next/image";

export default function Home() {
    return (
      <div>
        <h1>Reporte de báscula</h1>

        <label htmlFor="archivo">Archivo de báscula</label> /*label, es la etiqueta del input, es decir, en ella se define el contexto bajo el cual funciona el input*/
        <input type ="file" accept=".xlsx" id="archivo"/> /*Input es la puerta de entrada y su funcionamiento depende del type que definamos*/

        <label htmlFor="material">Tipo de material</label>/*El atributo For, permite enlazar con el id del input*/
        <select id="material"> /*Es una lista desplegable con sus respectivas etiquedas opción dentro*/
        <option value="mineral">Mineral</option>
        <option value="esteril">Estéril</option> /*El texto luego de value es lo que ve el usuario en la lista*/
        </select>

        <button type="button">Procesar</button>/*Se añade nuevamente type = button dentro, ya que se busca prevenir recargues de la páquina sin necesidad y evitar perdida de informacion*/
      </div> 
    );
}
