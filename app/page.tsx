/*Esta seria la base de la página y donde se harán todas las modificaciones que queramos ver*/
"use client"
import { useState } from "react";
import {definirRango, encontrarMina} from "@/lib/funciones"
import { Mina } from "@/lib/funciones";

export default function Home() {
  /* const [nombre, setNombre] = useState("Albana") */
  const [resultado, setResultado] = useState<Mina | null>(null);/*Siempre se debe declara como constante (const), el estado siempre tiene dos valores, uno que almacena y otro que modifica*/
  const minas: Mina[] = [
  {
    mina: "El Manzanillo",
    tipoMaterial: "Mineral",
    grupo: "OME",
    distancia: 3.8,
    pertenencia: "Segovia"
  },
  {
    mina: "El Zapatillo",
    tipoMaterial: "Mineral",
    grupo: "OME",
    distancia: 5.2,
    pertenencia: "Remedios"
  },
  {
    mina: "Esperanza Gold",
    tipoMaterial: "Mineral",
    grupo: "OME",
    distancia: 4.5,
    pertenencia: "Segovia"
  },
  {
    mina: "Explominerales",
    tipoMaterial: "Mineral",
    grupo: "OME",
    distancia: 17.4,
    pertenencia: "Remedios"
  },
  {
    mina: "Explotaciones Gold",
    tipoMaterial: "Mineral",
    grupo: "OME",
    distancia: 8.1,
    pertenencia: "Segovia"
  }
];
useState();
let mina = encontrarMina("El Zapatillo",minas)
let rango = definirRango(mina)
    return (
      <div>
        <input type="text" placeholder="Nombre Mina" onChange={(e)=> encontrarMina(e.target.value, minas)} />{/*  */}
        <p>La Mina {mina.mina} su material es {mina.tipoMaterial}, pertenece al grupo {mina.grupo}, tiene una distancia de {mina.distancia} km y su rango está en {rango} </p>{/* Para englobar objetos previamente creados, debemos usar llaves y punto para indexar dentro de ellos */}
        
        <h1>Reporte de báscula</h1>

        <label htmlFor="archivo">Archivo de báscula</label> {/* label, es la etiqueta del input, es decir, en ella se define el contexto bajo el cual funciona el input */}
        <input type ="file" accept=".xlsx" id="archivo"/> {/* Input es la puerta de entrada y su funcionamiento depende del type que definamos */}

        <label htmlFor="material">Tipo de material</label>{/*El atributo For, permite enlazar con el id del input*/}
        <select id="material"> {/*Es una lista desplegable con sus respectivas etiquedas opción dentro*/}
        <option value="mineral">Mineral</option>
        <option value="esteril">Estéril</option>{/*El texto luego de value es lo que ve el usuario en la lista*/}
        </select>

        <button type="button">Procesar</button>{/*Se añade nuevamente type = button dentro, ya que se busca prevenir recargues de la páquina sin necesidad y evitar perdida de informacion*/}
      </div> 
    );
}
