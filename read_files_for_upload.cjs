const fs = require('fs');
const filesRead = ['app.js', 'index.html', 'styles.css', 'package.json', 'README.md', '.gitignore'];
const result = {};

filesRead.forEach(file => {
    try {
        result[file] = fs.readFileSync(file, 'utf8');
    } catch (e) {
        result[file] = null; // O manejar error
    }
});

// Imprimir separador único para facilitar parsing si hay ruido
console.log('---JSON_START---');
console.log(JSON.stringify(result));
console.log('---JSON_END---');
