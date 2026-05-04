# INSTRUCCIONES PARA COMPLETAR EL DOCUMENTO

## ✅ LO QUE YA ESTÁ HECHO

1. **Campos agregados en el formulario** (Sección 2):
   - Número de Escritura Pública
   - Volumen
   - Nombre del Notario

2. **Recolección de datos actualizada** (`collectAllData`):
   - Los nuevos campos se capturan correctamente
   - Se usan en preview y documento

## 🔧 LO QUE FALTA POR HACER

### PASO 1: Actualizar el Preview (app.js líneas 303-369)

Reemplazar la función `generatePreview()` completa con el contenido del archivo:
**`preview-completo.js`**

Esta función incluye TODOS los artículos del documento original.

### PASO 2: Actualizar la Generación de Artículos (app.js líneas 652-714)

Reemplazar la función `generateArticulos(data)` completa con el contenido del archivo:
**`articulos-completos.js`**

Esta función genera TODOS los artículos con:
- Todos los guiones (-----)
- Todos los tabuladores (\t)
- Todo el formato exacto del original
- TODOS los poderes (A-I) completos
- Todas las secciones sin omitir nada

### PASO 3: Agregar Artículos Transitorios y Generales al Documento Word

Después de la función `generateArticulos`, necesitas agregar en `createWordDocument` (después de la línea 641):

```javascript
// Sección ARTÍCULOS TRANSITORIOS
new Paragraph({
    children: [new TextRun({ text: '\tARTÍCULOS TRANSITORIOS\t', bold: true, size: 24 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- Los socios reunidos en Asamblea General de Socios, aprueban por unanimidad las siguientes resoluciones:\t------------------------------------------------------------------------------------------------------------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- PRIMERO. La parte mínima fija del capital social se constituye por la cantidad de $${data.capitalFijo}, conforme a lo siguiente:-----`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

// AQUÍ AGREGAR TABLA DE APORTACIONES

new Paragraph({
    children: [new TextRun({
        text: `----- Los comparecientes declaran, bajo formal protesta de decir verdad, que con anterioridad a la fecha de esta escritura pagaron en efectivo la totalidad de sus participaciones.`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- SEGUNDO. Los socios acuerdan que la sociedad se administre por un GERENTE, y para ocupar ese cargo nombran a ${data.nombreGerente}, a quien se le otorgan los poderes y facultades que se establecen en el artículo trigésimo primero de los estatutos sociales, el cual se tiene por reproducido como si se insertase a la letra.--------------------------------------------------------------------------------------------------------------------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- Se exime al Gerente de la obligación de caucionar su gestión.`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- TERCERO. Los socios acuerdan nombrar como APODERADO LEGAL a ${data.nombreApoderado}, a quien se le otorgan los poderes y facultades que se detallan a continuación: -------------------------------------------------------- XXXXXXXXXXXXXXX`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

// Sección GENERALES
new Paragraph({
    children: [new TextRun({ text: '\tGENERALES\t', bold: true, size: 24 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- EL SEÑOR ${data.nombreApoderado}, quien dijo ser ${data.nacionalidadApoderado}, haber nacido en ${data.lugarNacimientoApoderado}, el día ${data.fechaNacimientoApoderado}, de estado civil ${data.estadoCivilApoderado}, de ocupación ${data.ocupacionApoderado} y con domicilio en ${data.domicilioApoderado}, quien se identificó credencial para votar con fotografía con clave de elector número ${data.claveElectorApoderado}  expedida por el Instituto XXXXXXXXXXXXXXX Electoral.-------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

// EL SUSCRITO NOTARIO CERTIFICA
new Paragraph({
    children: [new TextRun({ text: '------- EL SUSCRITO NOTARIO CERTIFICA:\t\t', bold: true, size: 22 })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 200, after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 1.- Que los otorgantes manifestaron que se reconocen su personalidad jurídica y que se identificaron legalmente ante el Suscrito Notario, con los documentos citados, los cuales en copia simple agrego al testimonio y al legajo apéndice, marcadas con la letra "C", quienes a mi juicio, son hábiles para contratar y obligarse.-----------------------------------------------------------------------------------------------------------------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 2.- Que los otorgantes ${data.sociosNombres}, en este acto me exhiben sus cédulas de identificación fiscal, expedida por el Servicio de Administración Tributaria de la Secretaria de Hacienda y Crédito Público, mismas que en copia fotostática agrego al testimonio y apéndice de este instrumento marcadas con las letras "D", por lo que me cercioré que el Registro Federal de Contribuyentes que en sus generales han declarado, concuerdan fiel y exactamente con las Cédulas de Identificación Fiscal.----------------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 3.- Que manifestaron bajo protesta de decir verdad, estar al corriente en el cumplimiento de sus obligaciones legales, fiscales y tributarias sin haberlo acreditado al momento de la celebración del presente acto jurídico.--------------------------------------------------------------------------------------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 4.- Que advertí a los comparecientes que deberán acreditarme dentro del plazo del mes siguiente a la fecha de firma de la presente escritura, haber presentado la solicitud de inscripción de la sociedad en el Registro Federal de Contribuyentes, y que en caso de no exhibirme dicha solicitud, procederé a dar el aviso correspondiente a las autoridades fiscales competentes.-------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 5.- Que leyeron la escritura por sí mismos y se les explicó el valor y las consecuencias legales del contenido de la misma.---------------------------------------------------------------------------------------------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 6.- Que les expliqué la necesidad de su inscripción en los registros correspondientes.--------------`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),

new Paragraph({
    children: [new TextRun({
        text: `----- 7.- Que se manifestaron conformes con los términos de la escritura, ratificándola y firmándola ante el Suscrito Notario de todo lo cual DOY FE.-`,
        size: 22,
    })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 },
}),
```

## 📋 RESUMEN DE CAMBIOS

### Archivos creados:
1. **preview-completo.js** - Preview con TODO el documento
2. **articulos-completos.js** - Artículos completos para Word
3. **INSTRUCCIONES.md** - Este archivo

### Cambios necesarios en app.js:
1. Reemplazar `generatePreview()` (líneas 303-369)
2. Reemplazar `generateArticulos()` (líneas 652-714)
3. Agregar secciones finales en `createWordDocument()` después de línea 641

## ⚠️ IMPORTANTE

- **NO omitir ningún guión (-----)**
- **NO omitir ningún tabulador (\t)**
- **Mantener TODOS los textos exactos del original**
- **Incluir TODOS los poderes (A-I) completos**
- **Incluir TODAS las certificaciones del notario**

## ✅ VERIFICACIÓN

Después de hacer los cambios, verifica que:
1. El preview muestre TODO el documento completo
2. El archivo .docx descargable tenga TODOS los artículos
3. Los campos de escritura, volumen y notario aparezcan correctamente
4. Todos los guiones y formato estén presentes
5. No haya texto "XXXXX" donde hay datos capturados

## 🎯 RESULTADO ESPERADO

Un documento Word completo de aproximadamente 15-20 páginas (tamaño Legal) que sea una **transcripción fiel y exacta** del documento original, con todos los datos del formulario integrados correctamente.
