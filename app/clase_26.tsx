"use client"
import { useState } from "react"
import * as XLSX from 'xlsx'
export default function Home(){
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
  return(
    <div>
      {/* onChange={leerArchivo}// le paso la función, React la llama cuando hay cambio
          onChange={leerArchivo()}// la ejecuto yo, ahora, y le paso el resultado
          onChange={(e) => leerArchivo(e)}// la envuelvo para pasarle algo mío */}
    <input type="file" accept=".xlsx" onChange={leerArchivo}/>
    <p>Filas leidas {filas.length}</p></div>
  )
 
}