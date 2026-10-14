# encontrarMina(mina, minas)

La función encontrar mina valida la existencia de cada mina, recibidas en el reporte de báscula, respecto a nuestra lista de minas.

## ¿Qué hace?

 Como primer parámetro de entrada recibe un string con el nombre mina que viene desde el reporte báscula y como segundo segundo parámetro la lista de minas de nuestra base de datos. Como retorno de esta obtenemos el tipo de dato Mina con los atributos; Mina={mina:string; tipoMaterial:string; grupo:string; distancia:number; pertenencia:string;}. Bajo ninguna regla se puede retornar undefined, en caso de haber encontrado coincidecnia, se devolvera el objeto Mina con strings vacíos y distancia en cero.

 Esto lo hacemos para comparar el nombre de la mina del reporte con nuestra lista de minas.

 Los nombres la base de datos minas están escritos con formato título: primera letra de cada palabra en mayúscula. Con este fomrato se debe almacenar en el objeto de retorno.

 ### Excepciones

    Algunos nombres de minas del reporte de báscula son demasiado extensos y el equivalente en nuestra lista de minas es el descrito luego de los dos puntos (:).

        "PM-44-1 UPM EL MANZANILLO FINO MEDIO TENOR": "El Manzanillo",
        "ASM-2026-005-TP-GOLDEN BEAK-2.3<=Au<8.0 g/t":"Golden Beak",
        "ASM-2026-0015-TP-MINERALCO TERMINAL-8.0≤Au<15.0 g/tn":"Mineralco",
        "PM-117-1 OUTSOURCING EXPLOTACIONES GOLD CARLA":"Explotaciones Gold Carla",
        "ASM-2026-018 TP LA PALMICHALA 8.0≤Au<15.0 g/t":"La Palmichala",
        "PM-00-1 OUTSOURCING SK 3-7":"Sk 3-7"
