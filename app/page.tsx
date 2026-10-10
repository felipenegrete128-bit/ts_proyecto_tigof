/*Esta seria la base de la página y donde se harán todas las modificaciones que queramos ver*/
"use client" /* Indica o da la referencia que el archivo va a tener interactividad en el htlm. */
import { useState } from "react";/* hook: Conecta la interactividad con html */
/* const [variable, setVariable] = useState(dato_inicial) Voy a tener un estado (variable) y una variable que modifique el estado de la variable(setvariable) */
/* const[tema, setTema]= useState('claro') Este seria un ejemplo aplicado al cambio de tema de una interfaz (Claro u oscuro)*/
/* setTema('oscuro') el valor dentro de setTema, cambia el valor de varible dentro de const. Asi asignamos un nuevo valor. */
import {definirRango, encontrarMina} from "@/lib/funciones"
import { Mina } from "@/lib/funciones";
import * as XLSX from 'xlsx'

export default function Home() {
 /*  const [nombre, setNombre] = useState<string>("Albana") */
 /* || equivale a or y && equivale a and */
  const [resultado, setResultado] = useState<Mina | null>(null);/*Siempre se debe declara como constante (const), el estado siempre tiene dos valores, uno que almacena y otro que modifica*/
  /* setNombre('Felipe') */
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
let mina = encontrarMina("El Zapatillo",minas)
let rango = definirRango(mina)
const [filas, setFilas] = useState<any[]>([])
    /* usamos una función asincrona, porque tenemos que leer a que se lea un archivo que tarda en hacerlo */
    async function leerArchivo(e: React.ChangeEvent<HTMLInputElement>) {/* e, dentro de una función es cuando vamos a llamar un evento, se usa async porque le cargamos un archivo que tarda y porque el parámetro parte de un evento. */
    const archivo = e.target.files?.[0]/* 1) accedemos al atributo files, para obtener los archivos de input, 2) verificamos si existe o no el atributo (archivo), con el signo de pregunta '?' y 3) La primera coincidencia, que seria el primer elemento [0] */
    if (!archivo) return /*Evaluamos la inexistencia (nulo) del archivo con el signo de exclamasión delante de la variable archivo */
      /* return en este caso corta la función, en caso de no existir un archivo */
    
    const buffer = await archivo.arrayBuffer()/* Almacenar el archivo de forma temporal */
    const libro = XLSX.read(buffer)
    const hoja = libro.Sheets[libro.SheetNames[0]]
    const datos = XLSX.utils.sheet_to_json(hoja)/* siempre devuelve una lista */

    setFilas(datos)/* Almacenamos en una lista los diccionarios resultantes */
  }    
return (
      <div>
        {/* onChange={(e) => {
        función}} se pueden escribir varias lineas de codigo y varias funciones*/}
        <input type="text" placeholder="Nombre Mina" onChange={(e)=> setResultado(encontrarMina(e.target.value, minas))} />{/*onChange permite ejecutar código cuando cambia el valor dentro del input, target es una caja y .value es el valor dentro de target */}
        {/* <p>La Mina {mina.mina} su material es {mina.tipoMaterial}, pertenece al grupo {mina.grupo}, tiene una distancia de {mina.distancia} km y su rango está en {rango} </p> */}{/* Para englobar objetos previamente creados, debemos usar llaves y punto para indexar dentro de ellos */}
        {resultado &&  <p>La Mina {resultado.mina} su material es {resultado.tipoMaterial}, pertenece al grupo {resultado.grupo}, tiene una distancia de {resultado.distancia} km y su rango está en {rango} </p> }
        {/* && cumple la función de resumir una declaración if, básicamente dice si la variable resultado existe, se aplica lo de la derecha (html) de && */}
        {/* test driven developmemt */}
        <h1>Reporte de báscula</h1>

        <label htmlFor="archivo">Archivo de báscula</label> {/* label, es la etiqueta del input, es decir, en ella se define el contexto bajo el cual funciona el input */}
        <input type ="file" accept=".xlsx" id="archivo" onChange={leerArchivo}/> {/* Input es la puerta de entrada y su funcionamiento depende del type que definamos */}
        <p>Filas leidas {filas.length}</p>
        <label htmlFor="material">Tipo de material</label>{/*El atributo For, permite enlazar con el id del input*/}
        <select id="material"> {/*Es una lista desplegable con sus respectivas etiquedas opción dentro*/}
        <option value="mineral">Mineral</option>
        <option value="esteril">Estéril</option>{/*El texto luego de value es lo que ve el usuario en la lista*/}
        </select>

        <button type="button">Procesar</button>{/*Se añade nuevamente type = button dentro, ya que se busca prevenir recargues de la páquina sin necesidad y evitar perdida de informacion*/}
      </div> 
    );
}
