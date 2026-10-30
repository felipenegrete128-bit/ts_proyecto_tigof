# Mostrar información de excel a tabla

A partir de los datos del reporte de báscula, aplicar todas las funciones de filtrado propias para mostrar una tabla con todos los datos de filtrado. <!-- Agregar descripción que debe diferenciar dependiendo del nombre del archivo si se ejecutan las funciones para Mineral o para Estéril. Definir en este apartado que cuando no se especifique se debe aplicar para ambos. -->

## Primera limpieza

Se debe iniciar filtrando el reporte por la columna Placa Vehiculo: Utilizando la función esPlacaNuestra, descartamos los registros que inicialmente no son de valor, sin embargo, NUNCA se eliminan, sino que se guardan en una tabla de revisión manual a la que se puede acceder. Posterior a ello añadir registros de nuestras placas a la tabla principal de visualización.

Se deben crear 2 variables de listas para los datos a revisar y los datos a analizar.

## Paso 1: Calcular peso neto.

En la tabla registros de placas propias, calculamos el peso neto en cada fila haciendo uso de la función calcularPesoNeto(), utilizando los parámetros pesoEntrada:Peso Entrada, pesoSalida:Peso Salida; desde el excel. En caso de que peso neto sea igual a 0, agregar el registro a la tabla de registros para revisión manual y eliminar de la tabla de registros de placas propias y no tener registros duplicados. Cuando peso neto sea mayor a 0 accedemos a la columna del registro (registros de placas propias) y reemplazamos su valor por el resultado de la función calcularPesoNeto().

## Paso 2: Encontrar mina.

En la tabla registros de placas propias, procedemos a ejecutar la función encontrarMina() en cada fila, utilizando los parámetros mina: columna Item, minas: lista de minas(Mina []). Al ejecutar esta función y encontrar coincidencia entre columna Itmen y nuestra lista de minas, obtenemos todos los datos de la mina que se deben agregar a la tabla registros de placas propias como columnas, de acuerdo al objeto tipo Mina. En la columna Item se debe reemplazar por el nombre de mina que devuelve el objeto Mina. En caso de no encontrar la mina en nuestra lista de minas (La función retorna objeto Mina vacío), se debe agregar el registro a la tabla de registros para revisión manual y eliminar de la tabla de registros de placas propias y no tener registros duplicados.

## Paso 3: Obtenener rango.

En la tabla registros de placas propias, calculamos el rango en cada fila haciendo uso de la función definirRango(), utilizando el parámetro mina: Objeto Mina encontrado en el paso 2. Luego de esto lo agregamos como columna en tabla registros de placas propias.

## Paso 4: Obtener datos de vehículo.

En la tabla registros de placas propias, procedemos a ejecutar la función obtenerVehiculo() en cada fila, utilizando los parámetros placa: columna Placa Vehiculo, placas: lista de placas(Placa []). Al ejecutar esta función y encontrar coincidencia entre columna Placa Vehiculo y nuestra lista de placas, obtenemos todos los datos del vehiculo que se deben agregar a la tabla registros de placas propias como columnas,excepto la columna Placa Vehiculo de la tabla; de acuerdo al objeto tipo Placa.

## Paso 5: Obtener sobre pesos.

En la tabla registros de placas propias, procedemos a calcular si existe sobre peso en cada fila, es decir, comparar si se supera con el peso neto, obtenido en el paso 1, la capacidad del objeto Placa obtenido en el paso 4. Se crea la columna Sobre Peso y completar el valor con Verdadero o Falso según corresponda; también se debe crear la columna Sobre Peso Ton donde se debe completar con el valor superado, es edcir, la diferencia entre peso neto y la capacidad del vehiculo; en caso de no haber sobre peso completar con 0.

## Paso 6: Obtener tarifa.

En la tabla registros de placas propias, calculamos la tarifa en cada fila haciendo uso de la función obtenerTarifa(), utilizando el parámetro rango:Columna Rango obtenida en paso 3, tipoVehiculo: Columna Tipo Vehiculo obtenida en paso 4, anio:Date(Obteniendo el año actual en string), tarifas: lista de tarifas (Tarifa[]). Luego de esto lo agregamos como columna en tabla registros de placas propias. En caso de que la tarifa sea 0 agregar el registro a la tabla de registros para revisión manual y eliminar de la tabla de registros de placas propias y no tener registros duplicados.

## Paso 7: Obtener facturacion.

En la tabla registros de placas propias, procedemos a calcular la facturación la cual se obtiene de multiplicar peso neto, obtenido en paso 1, por tarifa, obtenido en paso 6.

## Paso 8: Editar tabla de revisión manual:

Luego de tener segmentada la información en las tablas registros de placas propias y registros para revisión manual, se debe permitir hacer una edición, la cual consiste en habilitar la edición manual de la fila en su totalidad y la agregación de registros de la tabla registros para revisión manual hacia la tabla registros de placas propias; los registros que sean agregados de manera manual en la tabla de registros de placas propias deben ser eliminados de la tabla registros para revisión manual y así evitar tener registros duplicado. En el input de peso neto, ejecutar el paso 1, en el input de vehículo se debe ejecutar el paso 4 para obtener propiedad y tipo vehiculo, en el input de rango, se debe ejecutar el paso 3, en el input de tarifa se debe ejecutar el paso 6, en el input de sobre peso y sobre peso ton se debe ejecutar el paso 5 y en el input de facturación se debe ejecutar el paso 7; a medida que se van rellenando los input se van calculando los demás valores.

## Columnas resultantes.

Ordenar la tabla final con la siguiente estructura:
Numero Consecutivo: Texto
Item: Texto
Fecha Registro: Fecha
Fecha Salida: Fecha
Placa Vehiculo: Texto
Tipo Vehiculo: Texto
Propiedad: Texto
Nombre Conductor: Texto
Hora Registro: Hora
Hora Salida: Hora
Peso Entrada: Número
Peso Salida: Número
Peso Neto: Número con 2 decimales
Sobre Peso: Texto
Sobre Peso Ton: Número con 2 decimales
Rango: Texto
Tarifa: Moneda sin decimales
Facturacion: Moneda sin decimales

Las columnas no mencionadas no la agregues en la tabla final de registro de placas propias.
