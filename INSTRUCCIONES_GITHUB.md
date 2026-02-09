# Instrucciones para subir a GitHub
 
## Pre-requisitos
1.  **Instalar Git**: Si no tienes Git instalado:
    - Descárgalo desde [git-scm.com](https://git-scm.com/download/win).
    - Instálalo aceptando las opciones por defecto.
    - Reinicia tu terminal o editor de código.

2.  **Crear Repositorio en GitHub**:
    - Ve a [github.com/new](https://github.com/new).
    - Crea un nuevo repositorio (público o privado).
    - **No** agregues README, .gitignore ni licencia (para que esté vacío).
    - Copia la URL del repositorio (termina en `.git`).

## Pasos para subir el proyecto
Abre una terminal en la carpeta del proyecto (`c:\Users\DELL\Desktop\SOCIEDAD EJEMPLO CARLOS AGUILAR`) y ejecuta los siguientes comandos:

```bash
# 1. Inicializar el repositorio (si no lo has hecho)
git init

# 2. Agregar todos los archivos
git add .

# 3. Guardar los cambios
git commit -m "Versión inicial completa con textos legales y correcciones"

# 4. Renombrar la rama principal a 'main'
git branch -M main

# 5. Conectar con tu repositorio remoto
# REEMPLAZA "URL_DEL_REPOSITORIO" CON LA URL QUE COPIASTE DE GITHUB
git remote add origin URL_DEL_REPOSITORIO

# 6. Subir los archivos
git push -u origin main
```

**Nota:** Si te pide credenciales, usa tu usuario de GitHub y tu contraseña (o Token de Acceso Personal si tienes 2FA activado).
