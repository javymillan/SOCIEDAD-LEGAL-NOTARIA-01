# Notaría 01 Sociedad Legal - Sistema de Generación de Escrituras

## 📋 Descripción
Este sistema permite generar documentos de escrituras públicas para la constitución de una **Sociedad de Responsabilidad Limitada de Capital Variable (S. DE R.L. DE C.V.)** en México. 

La aplicación genera tanto una vista previa detallada en pantalla como un archivo descargable en formato Microsoft Word (.docx), respetando el formato legal, la estructura de los artículos y las tablas de aportaciones.

## ✅ Funcionalidades Principales

### 1. Captura de Datos Completa
- **Datos de la Sociedad**: Denominación, domicilio, duración, objeto social, capital, administración y vigilancia.
- **Datos Notariales**: Número de escritura, volumen, nombre del notario, fecha y lugar.
- **Socios**: Gestión dinámica de socios con cálculo automático de participaciones y aportaciones.
- **Administración**: Configuración detallada de Gerentes y Apoderados con sus respectivas facultades.

### 2. Generación de Documento Legal (.docx)
El sistema genera un archivo Word formateado (Tamaño Legal: 21.6 x 35.6 cm) que incluye:
- **Estructura Completa**: Antecedentes, declaraciones, y todos los artículos (cláusulas) necesarios.
- **Textos Legales Completos**: 
    - Objeto Social detallado (incisos a-o).
    - Cláusula de Extranjería (Artículo Sexto).
    - **Poderes y Facultades (Artículo Trigésimo Primero)**: Incluye los textos completos para Pleitos y Cobranzas, Actos de Administración, Poder Laboral, Actos de Dominio, Títulos de Crédito, etc.
- **Tablas Dinámicas**: Tabla de distribución de capital y aportaciones generada automáticamente según los socios capturados.

### 3. Vista Previa en Tiempo Real
- Visualización inmediata de cómo quedará el documento.
- Alertas visuales para campos obligatorios vacíos (mostrados como "XXXXX").

## 🚀 Cómo Usar
1.  Abre el archivo `index.html` en tu navegador (o usa un servidor local como Live Server).
2.  Completa los formularios paso a paso.
3.  Revisa la sección de **Vista Previa**.
4.  Haz clic en **"Generar Documento Word"** para descargar el archivo final.

## 🛠 Tecnologías
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Libraries**:
    - `docx` (para generación de documentos Word)
    - `file-saver` (para la descarga de archivos)

## 📂 Estructura del Proyecto
- `index.html`: Estructura principal de la aplicación.
- `styles.css`: Estilos y diseño responsivo.
- `app.js`: Lógica completa de la aplicación, incluyendo manejo del DOM, recolección de datos y generación del documento Word.
