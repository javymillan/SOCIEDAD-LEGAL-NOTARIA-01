---
trigger: manual
---

Rol: Eres un Desarrollador Senior Fullstack especializado en "Document Automation" y diseño UX/UI profesional.

Objetivo: Crear una aplicación web para la generación automatizada de documentos legales/administrativos (ej. Contratos, Escrituras, Actas) siguiendo una arquitectura específica de "Wizard" (paso a paso) con Vista Previa en vivo y Descarga en Word (.docx).

Stack Tecnológico:

Core: HTML5, Vanilla JavaScript (ES Modules), Vanilla CSS (Moderno).
Build Tool: Vite (para desarrollo rápido y optimización).
Librerías Clave: docx (para generar archivos .docx) y file-saver (para la descarga).
Estilo Visual y Diseño (Sistema de Diseño Obligatorio): Debes replicar una estética "Legal Premium" utilizando exactamente este sistema de tokens CSS:

Paleta de Colores:
Primarios (Azules Profundos): hsl(220, 70%, 15%) a hsl(220, 50%, 55%).
Acentos (Dorados/Elegantes): hsl(40, 85%, 25%) a hsl(40, 75%, 55%).
Fondos: Grises muy suaves hsl(220, 20%, 98%).
Tipografía: 'Inter' para UI y textos largos; 'Playfair Display' para títulos y encabezados (importadas de Google Fonts).
Componentes:
Tarjetas con sombras suaves (box-shadow).
Inputs con bordes limpios y focus states claros.
Botones con gradientes (Primarios: Azul a Azul claro; Secundarios: Borde dorado/azul).
Arquitectura de la Aplicación (Estructura de Archivos):

index.html
:
Debe contener un <div class="progress-container"> que visualice los pasos del formulario (1, 2, 3...).
El contenido principal se divide en <section class="form-section" id="sectionN"> que se muestran/ocultan vía JS.
La última sección SIEMPRE es "Vista Previa".
styles.css
:
Usa variables CSS (:root) para TODOS los colores, espaciados y sombras.
Implementa animaciones suaves (fadeIn) al cambiar de sección.
Diseño Responsivo (Mobile First o adaptativo).
app.js
 (Lógica Central):
Estado Global: Variables para rastrear la sección actual y datos complejos (ej. arrays de socios/items).
Navegación: Funciones 
nextSection()
 y 
prevSection()
 que validan datos antes de avanzar y actualizan la barra de progreso.
Recolección de Datos: Una función 
collectAllData()
 que extrae valores de todos los inputs por su ID y maneja valores por defecto ("XXXXX" si está vacío).
Vista Previa (Preview): Función 
generatePreview()
 que inyecta HTML dinámico en un contenedor, simulando cómo se verá el documento final.
Generación DOCX: Función 
generateDocument()
 que utiliza la librería docx (Packer, 
Document
, Paragraph, etc.) para mapear los datos recolectados a un archivo Word descargable, respetando el formato del preview.
Requerimientos Funcionales Específicos:

Formularios Dinámicos: Capacidad de agregar/eliminar items (ej. "Agregar Socio", "Agregar Cláusula") dinámicamente en el DOM.
Cálculos en Tiempo Real: Si hay montos (dinero, porcentajes), deben calcularse y actualizarse al cambiar los inputs.
Formato de Moneda: Implementa una utilidad para formatear números como moneda (ej. $10,000.00).
Consistencia: El texto mostrado en la "Vista Previa" (HTML) debe coincidir estructuralmente con el documento generado (.docx).
Instrucción Final al Agente: "Genera el código completo del proyecto basándote en esta estructura. Comienza configurando el 
package.json
 con las dependencias necesarias. Luego, crea el CSS con el sistema de diseño especificado y finalmente el HTML y JS con la lógica de navegación y generación de documentos."