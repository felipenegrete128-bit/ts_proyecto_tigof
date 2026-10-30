# Rol / Contexto:

Eres un diseñador UI/UX especializado en interfaces de paneles de control (dashboards) y herramientas de productividad web.

# Objetivo:

Diseña un prototipo de interfaz web moderno, limpio y funcional para un sistema de gestión de datos, sin barra lateral (sidebar), optimizando el espacio al máximo ancho de pantalla.

# Estructura y Layout:

## Header / Cabecera Principal (Arriba de todo):

Un botón principal destacado (estilo Primary CTA, color morado o azul intenso con texto en blanco e icono de carga/Excel) que diga explícitamente: Cargar archivo Excel.

### Opcional: 

El nombre del sistema/marca o el perfil del usuario alineado de forma discreta a un costado del header.

## Navegación por Pestañas (Tabs Bar):

Directamente debajo del header principal, ubica una barra de navegación horizontal con solo dos pestañas (tabs):

- Registros placas nuestras (Pestaña activa por defecto, resaltada con una línea inferior de color o un indicador visual claro).

- Revisión manual (Pestaña secundaria inactiva).

- Al presionar el botón "Editar" en cada registro de la pestaña Revisión manual, activa un pop-up de edición que contenga los campos de edición especificados en el paso 8 de spec-excelTabla.md

## Panel de Contenido Principal (Ancho Completo / Full-Width Table):

Al no existir barra lateral, la tabla debe ocupar entre el 90% y 100% del contenedor centrado de la pantalla.

Incluye una barra de herramientas secundaria superior justo antes de la tabla con:

- Un campo de búsqueda rápida (input con icono de lupa).

- Filtros rápidos por estado o fecha.

- Tabla de datos: Estilo de filas limpias y separadores suaves, con las columnas existentes.

## Estilo Visual & UI:

- Estética SaaS moderna, minimalista y limpia (similar a Tailwind UI / Shadcn UI / Material Design).

- Fondo general claro (gris suave/blanco) con tarjetas en blanco puro con sombras muy sutiles o bordes delgados (#E5E7EB).

- Tipografía Sans-Serif nítida y legible.