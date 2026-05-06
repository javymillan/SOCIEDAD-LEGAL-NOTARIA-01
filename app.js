import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';

// ===== ESTADO GLOBAL =====
let currentSection = 1;
let socios = [];
let formData = {};
let socioCounter = 0;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    addSocio(); // Agregar primer socio por defecto
});

function initializeApp() {
    // Configurar fecha actual como predeterminada
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaConstitucion').value = today;

    // Listener para duración
    // Listener para duración
    document.getElementById('duracion').addEventListener('change', (e) => {
        const aniosGroup = document.getElementById('duracionAniosGroup');
        aniosGroup.style.display = e.target.value === 'AÑOS' ? 'block' : 'none';
    });

    // Iniciar manejadores de administración
    if (typeof setupAdminHandlers === 'function') {
        setupAdminHandlers();
    }
}

// ===== FUNCIONES AUXILIARES =====
function numeroALetras(num) {
    if (num === null || isNaN(num) || num === undefined) return '';
    const isCurrency = String(num).includes('.') || typeof num === 'string' && num.includes('$');
    const number = parseFloat(String(num).replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';

    const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas2 = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    function convertirGrupo(n) {
        if (n === 100) return 'cien';
        let texto = '';
        const c = Math.floor(n / 100);
        const r = n % 100;
        if (c > 0) texto += centenas[c] + ' ';
        if (r > 0) {
            if (r < 10) texto += unidades[r];
            else if (r < 20) texto += decenas[r - 10];
            else {
                const d = Math.floor(r / 10);
                const u = r % 10;
                if (r === 20) texto += 'veinte';
                else if (d === 2) texto += 'veinti' + unidades[u];
                else {
                    texto += decenas2[d];
                    if (u > 0) texto += ' y ' + unidades[u];
                }
            }
        }
        return texto.trim();
    }

    let intPart = Math.floor(number);
    let result = '';
    
    if (intPart === 0) {
        result = 'cero';
    } else {
        const millones = Math.floor(intPart / 1000000);
        intPart = intPart % 1000000;
        const miles = Math.floor(intPart / 1000);
        const resto = intPart % 1000;

        if (millones > 0) {
            result += millones === 1 ? 'un millón ' : convertirGrupo(millones) + ' millones ';
        }
        if (miles > 0) {
            result += miles === 1 ? 'mil ' : convertirGrupo(miles) + ' mil ';
        }
        if (resto > 0) {
            result += convertirGrupo(resto);
        }
    }

    result = result.trim();

    if (isCurrency) {
        const centavos = Math.round((number - Math.floor(number)) * 100);
        const centavosStr = centavos.toString().padStart(2, '0');
        return \`\${result} pesos \${centavosStr}/100 M.N.\`;
    }
    
    return result;
}

function formatearConLetra(valor, isCurrency = false) {
    if (!valor || valor === 'XXXXX' || valor === 'XXX') return valor;
    if (isCurrency) {
        return \`$\${parseFloat(valor).toLocaleString('en-US', {minimumFractionDigits: 2})} (\${numeroALetras(valor)})\`;
    }
    const num = parseFloat(valor);
    if (!isNaN(num)) {
        return \`\${valor} (\${numeroALetras(num)})\`;
    }
    return valor;
}

function setupEventListeners() {
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea reiniciar el formulario? Se perderán todos los datos.')) {
            location.reload();
        }
    });

    // Make steps clickable
    document.querySelectorAll('.step').forEach((step, index) => {
        step.style.cursor = 'pointer';
        step.addEventListener('click', () => {
            navigateToSection(index + 1);
        });
    });
}

function setupAdminHandlers() {
    const setupHandler = (role) => {
        const typeSelect = document.getElementById(`${role}Socio`); // gerenteSocio, apoderadoSocio
        const socioSelect = document.getElementById(`selector${role.charAt(0).toUpperCase() + role.slice(1)}`); // selectorGerente
        const container = document.getElementById(`containerSelector${role.charAt(0).toUpperCase() + role.slice(1)}`);

        if (!typeSelect || !socioSelect) return;

        typeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'SOCIO') {
                if (container) container.style.display = 'block';
                populateSociosSelect(socioSelect.id);
            } else {
                if (container) container.style.display = 'none';
                socioSelect.value = "";
            }
        });

        socioSelect.addEventListener('change', (e) => {
            if (e.target.value !== "") {
                fillSocioData(e.target.value, role);
            }
        });
    };

    setupHandler('gerente');
    setupHandler('apoderado');
    setupHandler('comisario');
}

function populateSociosSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Seleccione un Socio --</option>';

    // Iterar sobre el array global de socios
    if (typeof socios !== 'undefined' && Array.isArray(socios)) {
        socios.forEach((socio) => {
            // Obtenemos el nombre del input del DOM porque el array solo tiene estructura
            const nombreInput = document.getElementById(`socio${socio.index}_nombre`);
            const nombre = nombreInput ? nombreInput.value : `Socio ${socio.index + 1}`;

            if (nombre && nombre.trim() !== '') {
                const option = document.createElement('option');
                option.value = socio.index;
                option.textContent = nombre;
                select.appendChild(option);
            }
        });
    }

    if (currentValue) select.value = currentValue;
}

function fillSocioData(socioIndex, role) {
    // Helper para obtener valor de un campo del socio
    const getSocioValue = (field) => {
        const el = document.getElementById(`socio${socioIndex}_${field}`);
        return el ? el.value : '';
    };

    // Helper para establecer valor en el campo destino
    const setTargetValue = (targetId, val) => {
        const el = document.getElementById(targetId);
        if (el) el.value = val;
    };

    // Construir prefijo de ID
    const suffix = role === 'gerente' ? 'Gerente' : 'Apoderado';

    // Mapeo de campos comunes
    setTargetValue(`nombre${suffix}`, getSocioValue('nombre'));
    
    // Solo gerente y apoderado tienen estos campos en el formulario actual
    if (role !== 'comisario') {
        setTargetValue(`nacionalidad${suffix}`, getSocioValue('nacionalidad'));
        setTargetValue(`domicilio${suffix}`, getSocioValue('domicilio'));
    }

    // Mapeo específico para Apoderado
    if (role === 'apoderado') {
        setTargetValue(`claveElector${suffix}`, getSocioValue('claveElector'));
        setTargetValue(`lugarNacimiento${suffix}`, getSocioValue('lugarNacimiento'));
        setTargetValue(`fechaNacimiento${suffix}`, getSocioValue('fechaNacimiento'));
        setTargetValue(`estadoCivil${suffix}`, getSocioValue('estadoCivil'));
        setTargetValue(`ocupacion${suffix}`, getSocioValue('ocupacion'));
    }
}

// Helper global para formato de moneda
function formatCurrency(amount) {
    if (!amount) return '0.00';
    // Eliminar todo lo que no sea número o punto (por si el usuario ingresó comas)
    const cleanAmount = String(amount).replace(/[^0-9.]/g, '');
    const number = parseFloat(cleanAmount);
    if (isNaN(number)) return '0.00';
    return number.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
window.nextSection = function (section) {
    // Validar sección actual antes de avanzar
    if (!validateCurrentSection()) {
        return;
    }

    // Guardar datos de la sección actual
    saveFormData();

    // Si vamos a la sección de aportaciones, generar formulario
    if (section === 4) {
        generateAportacionesForm();
    }

    // Auto-completar Denominación Autorizada (Sección 2)
    if (section === 2) {
        const denominacion = document.getElementById('denominacion').value;
        const auto = document.getElementById('denominacionAutorizada');
        if (auto && !auto.value) { // Solo si está vacío para no sobrescribir cambios manuales
            auto.value = denominacion;
        }
    }

    // Si vamos a Administración (Sección 5), poblar selectores
    if (section === 5) {
        populateSociosSelect('selectorGerente');
        populateSociosSelect('selectorApoderado');
        populateSociosSelect('selectorComisario');
    }

    // Si vamos a vista previa, generar preview
    if (section === 6) {
        generatePreview();
    }

    navigateToSection(section);
}

window.prevSection = function (section) {
    saveFormData();
    navigateToSection(section);
}

function navigateToSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));

    // Mostrar sección actual
    document.getElementById(`section${section}`).classList.add('active');

    // Actualizar indicador de progreso
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === section) {
            step.classList.add('active');
        } else if (index + 1 < section) {
            step.classList.add('completed');
        }
    });

    currentSection = section;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentSection() {
    // Validación básica - puedes expandir según necesites
    if (currentSection === 3 && socios.length === 0) {
        alert('Debe agregar al menos un socio.');
        return false;
    }
    return true;
}

function saveFormData() {
    const inputs = document.querySelectorAll(`#section${currentSection} input, #section${currentSection} select, #section${currentSection} textarea`);
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
}

// ===== GESTIÓN DE SOCIOS =====
window.addSocio = function () {
    const socioIndex = socioCounter++;
    socios.push({
        index: socioIndex,
        data: {}
    });

    const container = document.getElementById('sociosContainer');
    const socioCard = createSocioCard(socioIndex);
    container.appendChild(socioCard);
}

function createSocioCard(index) {
    const card = document.createElement('div');
    card.className = 'socio-card';
    card.id = `socio-${index}`;

    card.innerHTML = `
        <div class="socio-header">
            <h3 class="socio-title">Socio ${index + 1}</h3>
            ${index > 0 ? `<button type="button" class="btn-remove" onclick="removeSocio(${index})">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Eliminar
            </button>` : ''}
        </div>
        
        <div class="form-grid">
            <div class="form-group full-width">
                <label for="socio${index}_nombre">Nombre Completo</label>
                <input type="text" id="socio${index}_nombre" placeholder="Nombre completo del socio">
            </div>
            
            <div class="form-group">
                <label for="socio${index}_nacionalidad">Nacionalidad</label>
                <input type="text" id="socio${index}_nacionalidad" value="Mexicana" readonly>
            </div>
            
            <div class="form-group">
                <label for="socio${index}_lugarNacimiento">Lugar de Nacimiento</label>
                <input type="text" id="socio${index}_lugarNacimiento" placeholder="Ciudad, Estado">
            </div>
            
            <div class="form-group">
                <label for="socio${index}_fechaNacimiento">Fecha de Nacimiento</label>
                <input type="date" id="socio${index}_fechaNacimiento">
            </div>
            
            <div class="form-group">
                <label for="socio${index}_estadoCivil">Estado Civil</label>
                <input type="text" id="socio${index}_estadoCivil" placeholder="Ej: Soltero/Casado">
            </div>
            
            <div class="form-group">
                <label for="socio${index}_ocupacion">Ocupación</label>
                <input type="text" id="socio${index}_ocupacion" placeholder="Ej: Empresario">
            </div>
            
            <div class="form-group full-width">
                <label for="socio${index}_domicilio">Domicilio Completo</label>
                <input type="text" id="socio${index}_domicilio" placeholder="Calle, número, colonia, código postal">
            </div>
            
            <div class="form-group">
                <label for="socio${index}_identificacionTipo">Tipo de Identificación</label>
                <select id="socio${index}_identificacionTipo">
                    <option value="INE">INE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="LICENCIA DE CONDUCIR">Licencia de Conducir</option>
                    <option value="OTRO">Otro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="socio${index}_claveElector">Número de Identificación</label>
                <input type="text" id="socio${index}_claveElector" placeholder="Clave/Número">
            </div>
            
            <div class="form-group">
                <label for="socio${index}_institutoExpide">Instituto que Expide</label>
                <input type="text" id="socio${index}_institutoExpide" placeholder="Ej: INE, SRE">
            </div>
        </div>
    `;

    return card;
}

window.removeSocio = function (index) {
    if (confirm('¿Está seguro de eliminar este socio?')) {
        const card = document.getElementById(`socio-${index}`);
        card.remove();
        socios = socios.filter(s => s.index !== index);
    }
}

// ===== APORTACIONES =====
function generateAportacionesForm() {
    const container = document.getElementById('aportacionesContainer');
    container.innerHTML = '';

    // Obtener datos de socios
    const sociosData = [];
    socios.forEach((socio, idx) => {
        const nombre = document.getElementById(`socio${socio.index}_nombre`)?.value || `Socio ${idx + 1}`;
        sociosData.push({
            index: socio.index,
            nombre: nombre
        });
    });

    // Crear formulario de aportaciones
    sociosData.forEach((socio, idx) => {
        const aportacionDiv = document.createElement('div');
        aportacionDiv.className = 'aportacion-item';
        
        // Recuperar valores previos si existen
        const prevMonto = formData[`aportacion${socio.index}_monto`] || '';
        const prevPartes = formData[`aportacion${socio.index}_partes`] || '';
        const prevPorcentaje = formData[`aportacion${socio.index}_porcentaje`] || '0.00';

        aportacionDiv.innerHTML = `
            <h4 style="margin-bottom: 1rem; color: var(--primary-800);">${socio.nombre}</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label for="aportacion${socio.index}_monto">Monto de Aportación ($)</label>
                    <input type="number" id="aportacion${socio.index}_monto" placeholder="0.00" step="0.01" onchange="calculateParticipation()" value="${prevMonto}">
                </div>
                
                <div class="form-group">
                    <label for="aportacion${socio.index}_partes">Número de Partes Sociales</label>
                    <input type="number" id="aportacion${socio.index}_partes" value="1" onchange="calculateParticipation()" readonly>
                </div>
                
                <div class="form-group">
                    <label for="aportacion${socio.index}_porcentaje">Porcentaje de Participación (%)</label>
                    <input type="number" id="aportacion${socio.index}_porcentaje" placeholder="0.00" step="0.01" readonly value="${prevPorcentaje}">
                </div>
            </div>
        `;
        container.appendChild(aportacionDiv);
    });

    // Agregar resumen
    const summary = document.createElement('div');
    summary.className = 'aportacion-summary';
    summary.innerHTML = `
        <h3>Resumen Total</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Total Aportado</div>
                <div class="summary-value" id="totalMonto">$0.00</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Partes</div>
                <div class="summary-value" id="totalPartes">0</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Porcentaje</div>
                <div class="summary-value" id="totalPorcentaje">0%</div>
            </div>
        </div>
    `;
    container.appendChild(summary);
}

window.calculateParticipation = function () {
    let totalMonto = 0;
    let totalPartes = 0;

    socios.forEach(socio => {
        const monto = parseFloat(document.getElementById(`aportacion${socio.index}_monto`)?.value || 0);
        const partes = parseInt(document.getElementById(`aportacion${socio.index}_partes`)?.value || 0);

        totalMonto += monto;
        totalPartes += partes;
    });

    // Calcular porcentajes
    socios.forEach(socio => {
        const monto = parseFloat(document.getElementById(`aportacion${socio.index}_monto`)?.value || 0);
        const porcentaje = totalMonto > 0 ? (monto / totalMonto * 100).toFixed(2) : 0;
        document.getElementById(`aportacion${socio.index}_porcentaje`).value = porcentaje;
    });

    // Actualizar resumen
    document.getElementById('totalMonto').textContent = `$${totalMonto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalPartes').textContent = totalPartes;
    document.getElementById('totalPorcentaje').textContent = '100.00%';
}

// ===========================
// VISTA PREVIA DEL DOCUMENTO
// ===========================
function generatePreview() {
    const preview = document.getElementById('previewContent');
    const data = collectAllData();
    
    // Guardar en historial automáticamente
    saveToHistory(data);

    // Helper para resaltar datos o mostrar advertencia si falta
    const hl = (val) => {
        if (!val || val === 'XXXXX' || val === 'XXX' || val === '0.00' || val === '0' || val === 'undefined' || val === '' || val === 'NaN') {
            return `<span class="empty-field">${val || 'XXXXX'}</span>`;
        }
        return `<span class="highlight-data">${val}</span>`;
    };

    const sociosHl = data.sociosDescripcion;

    preview.innerHTML = `
        <div class="preview-header-info" style="background: var(--primary-50); border: 2px solid var(--primary-200); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem; box-shadow: var(--shadow-md);">
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div style="background: var(--primary-600); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div>
                    <h4 style="color: var(--primary-800); margin-bottom: 0.5rem; font-size: 1.1rem;">Modo de Revisión Visual</h4>
                    <p style="font-size: 0.95rem; color: var(--primary-700); margin: 0; line-height: 1.5;">
                        Los datos ingresados aparecen <span class="highlight-data" style="padding: 2px 8px;">RESALTADOS EN AMARILLO</span> para que puedas verificarlos fácilmente. 
                        Si algún dato falta o es incorrecto, se mostrará en <span class="empty-field" style="padding: 2px 8px;">ROJO</span>. 
                        <strong>Este formato es solo para tu revisión y no aparecerá en el archivo Word final.</strong>
                    </p>
                </div>
            </div>
        </div>

        <div class="document-preview-paper" contenteditable="true">
            <h3 style="text-align: center;">ESCRITURA PÚBLICA NÚMERO ${hl(data.numeroEscritura)}</h3>
            <h3 style="text-align: center;">VOLUMEN ${hl(data.volumen)}</h3>
            
            <p>En la Ciudad de ${hl(data.ciudad)}, ${hl(data.estado)}, México, a los ${hl(data.dia)} días del mes de ${hl(data.mes)} del año ${hl(data.anio)}, ante mí, ${hl(data.notario)}, con ejercicio y residencia en esta Demarcación Notarial, COMPARECIERON:</p>
            
            <p>Los señores ${hl(data.sociosNombres)}, todos por su propio derecho y quienes dijeron:</p>
            
            <p>Que vienen a constituir y constituyen una "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE", conforme a la Ley General de Sociedades Mercantiles y en base a los siguientes:</p>
            
            <h3 style="text-align: center;">ANTECEDENTES</h3>
            
            <p>ÚNICO. Para la constitución de esta Sociedad, se solicitó y obtuvo la Autorización de Uso de la Denominación o Razón Social "${hl(data.denominacionAutorizada)}", expedida por la Secretaría de Economía, que consta únicamente al anverso de ${hl(data.numeroHojas)} hojas, con Clave Única de Documento (CUD) ${hl(data.cud)}, la cual se agrega al apéndice y al testimonio de esta escritura bajo la LETRA "${hl(data.letraApendice)}".- Conforme al artículo (22) veintidós del Reglamento para la Autorización de Uso de Denominaciones y Razones Sociales, el suscrito Notario explicó a los comparecientes el contenido y efectos de dicho precepto, así como las obligaciones establecidas en el mismo a cargo de la Sociedad que usará la denominación o razón social autorizada, y que consisten en las siguientes: “I. Responder por cualquier daño, perjuicio o afectación que pudiera causar el uso indebido o no autorizado de una Denominación o Razón Social otorgada mediante la presente Autorización, conforme a la Ley de Inversión Extranjera y al Reglamento para la Autorización de Uso de Denominaciones y Razones Sociales, y II. Proporcionar a la Secretaría de Economía la información y documentación que le sea requerida por escrito o a través del Sistema en relación con el uso de la Denominación o Razón Social otorgada mediante la presente Autorización, al momento de haberla reservado, durante el tiempo en que se encuentre en uso, y después de que se haya dado el Aviso de Liberación respecto de la misma.- Las obligaciones establecidas en las fracciones anteriores, deberán constar en el instrumento mediante el cual se formalice la constitución de la Sociedad o Asociación o el cambio de su Denominación o Razón Social.”</p>
            
            <h3 style="text-align: center;">CLÁUSULAS</h3>
            
            <p>ÚNICA. Los señores ${hl(data.sociosNombres)}, constituyen una Sociedad de Responsabilidad Limitada de Capital Variable conforme a los siguientes:</p>
            
            <h3 style="text-align: center;">ESTATUTOS</h3>
            <h4 style="text-align: center;">DENOMINACIÓN, DOMICILIO, DURACIÓN, OBJETO Y NACIONALIDAD</h4>
            
            <p>ARTÍCULO PRIMERO.- DENOMINACIÓN.- La Sociedad se constituye bajo la denominación "${hl(data.denominacion)}", la que deberá ir seguida de las palabras "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE" o por su abreviatura "S. DE R.L. DE C.V."</p>
            
            <p>ARTÍCULO SEGUNDO.- DOMICILIO.- El domicilio de la Sociedad es en la Ciudad de ${hl(data.ciudad)}, ${hl(data.estado)}; sin embargo, podrá establecer locales, oficinas, sucursales, agencias y señalar domicilios convencionales en cualquier parte de la República Mexicana o en el extranjero, sin que se entienda por ello cambio de domicilio.</p>
            
            <p>ARTÍCULO TERCERO.- DURACIÓN.- La duración de la Sociedad es ${hl(data.duracion)} a partir de la fecha de firma de esta escritura.</p>
            
            <p>ARTÍCULO CUARTO.- OBJETO.- La Sociedad tendrá por objeto:</p>
            <p>1.- ${hl(data.objetoSocial)}</p>
            
            <p>En relación y para la consecución de dichos fines, la sociedad podrá realizar cualquiera de los siguientes actos:</p>
            <p style="font-size: 0.9rem; color: var(--gray-600); font-style: italic;">(Las facultades legales completas aparecerán en el documento final generado de la a) a la o)...)</p>
            
            <p>ARTÍCULO QUINTO.- NACIONALIDAD.- La Sociedad se constituye conforme a las leyes de los Estados Unidos Mexicanos, por lo que es de NACIONALIDAD MEXICANA.</p>
            
            <p>ARTÍCULO SEXTO.- CLAUSULA ADMISIÓN DE EXTRANJEROS.- La Sociedad se constituye con cláusula de admisión de extranjeros...</p>
            
            <h3 style="text-align: center;">CAPITAL SOCIAL Y PARTES SOCIALES</h3>
            
            <p>ARTÍCULO SÉPTIMO. El capital social es variable. El capital mínimo fijo sin derecho a retiro es de ${hl(data.capitalFijo)}, el cual estará representado por partes sociales, nominativas, íntegramente suscritas y pagadas.</p>
            
            <p>ARTÍCULO OCTAVO. Los socios no podrán ser titulares de más de una parte social...</p>
            
            <h3 style="text-align: center;">ASAMBLEA DE SOCIOS</h3>
            <p>ARTÍCULO DECIMO SEXTO. La Asamblea de Socios es el órgano supremo de la sociedad...</p>
            
            <h3 style="text-align: center;">ADMINISTRACIÓN DE LA SOCIEDAD</h3>
            <p>ARTÍCULO VIGÉSIMO NOVENO. La administración de la sociedad estará a cargo de uno o más Gerentes, según determine la Asamblea de Socios.</p>
            
            <h3 style="text-align: center;">ARTÍCULOS TRANSITORIOS</h3>
            
            <p>Los socios reunidos en Asamblea General de Socios, aprueban por unanimidad las siguientes resoluciones:</p>
            <p>PRIMERO. La parte mínima fija del capital social se constituye por la cantidad de ${hl(data.capitalFijo)}, conforme a lo siguiente:</p>
            
            ${generateAportacionesPreview(data, true)}
            
            <p>Los comparecientes declaran, bajo formal protesta de decir verdad, que con anterioridad a la fecha de esta escritura pagaron en efectivo la totalidad de sus participaciones.</p>
            <p>SEGUNDO. Los socios acuerdan que la Sociedad se administre por un GERENTE, y para ocupar ese cargo nombran a ${hl(data.nombreGerente)}, a quien se le otorgan los poderes y facultades que se establecen en el artículo trigésimo primero de los estatutos sociales. ${data.eximeCaucion === 'SI' ? hl('Se exime al Gerente de la obligación de caucionar su gestión.') : hl('El Gerente deberá caucionar su gestión.')}</p>
            <p>TERCERO. Los socios acuerdan nombrar como APODERADO LEGAL a ${hl(data.nombreApoderado)}. Facultades otorgadas: ${hl(data.facultadesApoderado.join(', '))}</p>
            
            <h3 style="text-align: center;">GENERALES</h3>
            
            <p>${hl(data.sociosDescripcion)}</p>

            <p>EL SEÑOR ${hl(data.nombreApoderado)}, quien dijo ser de nacionalidad ${hl(data.nacionalidadApoderado)}, haber nacido en ${hl(data.lugarNacimientoApoderado)}, el día ${hl(data.fechaNacimientoApoderado)}, de estado civil ${hl(data.estadoCivilApoderado)}, de ocupación ${hl(data.ocupacionApoderado)} y con domicilio en ${hl(data.domicilioApoderado)}, quien se identificó con credencial para votar con fotografía con clave de elector número ${hl(data.claveElectorApoderado)}.</p>
            
            ${data.gerenteSocio === 'EXTERNO' ? `
            <p>EL SEÑOR ${hl(data.nombreGerente)}, de nacionalidad ${hl(data.nacionalidadGerente)}, con domicilio en ${hl(data.domicilioGerente)}, quien desempeña el cargo de GERENTE de la sociedad.</p>
            ` : ''}
            
            <h3 style="text-align: center;">EL SUSCRITO NOTARIO CERTIFICA:</h3>
            
            <p>1.- Que los otorgantes manifestaron que se reconocen su personalidad jurídica y que se identificaron legalmente ante el Suscrito Notario, con los documentos citados.</p>
            <p>2.- Que los otorgantes ${hl(data.sociosNombres)}, en este acto me exhiben sus cédulas de identificación fiscal.</p>
            
            <div style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--gray-300);">
                <h3 style="text-align: center; margin-bottom: 3rem;">FIRMAS</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; text-align: center;">
                    ${data.socios.map(socio => `
                        <div>
                            <div style="border-bottom: 1px solid black; margin-bottom: 0.5rem; width: 80%; margin-left: auto; margin-right: auto;"></div>
                            <strong>${hl(socio.nombre)}</strong>
                        </div>
                    `).join('')}
                    
                    <div>
                        <div style="border-bottom: 1px solid black; margin-bottom: 0.5rem; width: 80%; margin-left: auto; margin-right: auto;"></div>
                        <strong>${hl(data.notario)}</strong><br>
                        <span>NOTARIO PÚBLICO</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function generateAportacionesPreview(data, highlight = false) {
    let html = '<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">';
    html += '<tr style="background: var(--gray-200);"><th style="padding: 0.5rem; border: 1px solid var(--gray-300);">Socio</th><th style="padding: 0.5rem; border: 1px solid var(--gray-300);">Monto</th><th style="padding: 0.5rem; border: 1px solid var(--gray-300);">Partes</th><th style="padding: 0.5rem; border: 1px solid var(--gray-300);">%</th></tr>';

    const sociosData = data.socios || [];

    const hl = (val) => {
        if (!highlight) return val;
        // Si el valor contiene un símbolo de moneda o porcentaje, lo manejamos
        if (!val || val === 'XXXXX' || val === '0.00' || val === '0' || val === '$0.00' || val === '0.00%') {
            return `<span class="empty-field">${val || 'XXXXX'}</span>`;
        }
        return `<span class="highlight-data">${val}</span>`;
    };

    sociosData.forEach(socio => {
        const montoFormateado = socio.aportacionLetra;
        const porcentajeFormateado = (socio.porcentaje || '0.00') + '%';
        
        html += `<tr>
            <td style="padding: 0.5rem; border: 1px solid var(--gray-300);">${hl(socio.nombre)}</td>
            <td style="padding: 0.5rem; border: 1px solid var(--gray-300);">${hl(montoFormateado)}</td>
            <td style="padding: 0.5rem; border: 1px solid var(--gray-300);">${hl(socio.partes)}</td>
            <td style="padding: 0.5rem; border: 1px solid var(--gray-300);">${hl(porcentajeFormateado)}</td>
        </tr>`;
    });

    html += '</table>';
    return html;
}




// ===== RECOLECCIÓN DE DATOS =====
function collectAllData() {
    const getValue = (id) => {
        const element = document.getElementById(id);
        return element?.value || 'XXXXX';
    };

    // Procesar fecha
    const fecha = new Date(getValue('fechaConstitucion'));
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Recolectar datos detallados de socios
    const sociosData = socios.map(s => {
        const aportacionMonto = getValue(`aportacion${s.index}_monto`);
        const partes = getValue(`aportacion${s.index}_partes`);
        return {
            index: s.index,
            nombre: getValue(`socio${s.index}_nombre`),
            nacionalidad: getValue(`socio${s.index}_nacionalidad`),
            lugarNacimiento: getValue(`socio${s.index}_lugarNacimiento`),
            fechaNacimiento: getValue(`socio${s.index}_fechaNacimiento`),
            estadoCivil: getValue(`socio${s.index}_estadoCivil`),
            ocupacion: getValue(`socio${s.index}_ocupacion`),
            domicilio: getValue(`socio${s.index}_domicilio`),
            identificacionTipo: getValue(`socio${s.index}_identificacionTipo`),
            claveElector: getValue(`socio${s.index}_claveElector`),
            institutoExpide: getValue(`socio${s.index}_institutoExpide`),
            aportacion: aportacionMonto,
            aportacionLetra: formatearConLetra(aportacionMonto, true),
            partes: partes,
            porcentaje: getValue(`aportacion${s.index}_porcentaje`)
        };
    });

    const sociosNombres = sociosData.map(s => s.nombre).join(', ');
    
    // Generar descripción detallada para la sección de comparecencia (solo nombres en el proemio, generales al final)
    const sociosDescripcion = sociosData.map(s => {
        return `${s.nombre}, de nacionalidad ${s.nacionalidad}, nacido en ${s.lugarNacimiento}, el día ${s.fechaNacimiento}, de estado civil ${s.estadoCivil}, de ocupación ${s.ocupacion}, quien se identifica con ${s.identificacionTipo} número ${s.claveElector} expedida por ${s.institutoExpide} y con domicilio en ${s.domicilio}`;
    }).join('; ');

    // Facultades Apoderado
    const facultadesElements = document.querySelectorAll('input[name="facultades"]:checked');
    const facultadesSeleccionadas = Array.from(facultadesElements).map(el => el.value);

    let dia = isNaN(fecha.getDate()) ? 'XXX' : fecha.getDate();
    let anio = isNaN(fecha.getFullYear()) ? '2025' : fecha.getFullYear();

    return {
        // Escritura
        numeroEscritura: formatearConLetra(getValue('numeroEscritura')),
        volumen: formatearConLetra(getValue('volumen')),
        notario: getValue('nombreNotario'),

        // Fecha
        dia: formatearConLetra(dia),
        mes: isNaN(fecha.getMonth()) ? 'XXX' : meses[fecha.getMonth()],
        anio: formatearConLetra(anio),

        // Sociedad
        denominacion: getValue('denominacion'),
        ciudad: getValue('ciudad'),
        estado: getValue('estado'),
        duracion: getValue('duracion'),
        objetoSocial: getValue('objetoSocial'),

        // Capital
        capitalFijo: formatearConLetra(getValue('capitalFijo'), true),
        valorParte: formatearConLetra(getValue('valorParte'), true),
        formaAdministracion: getValue('formaAdministracion'),

        // Autorización
        denominacionAutorizada: getValue('denominacionAutorizada'),
        cud: getValue('cud'),
        fechaExpedicion: getValue('fechaExpedicion'),
        numeroHojas: formatearConLetra(getValue('numeroHojas')),
        letraApendice: getValue('letraApendice'),

        // Administración
        nombreGerente: getValue('nombreGerente'),
        gerenteSocio: getValue('gerenteSocio'),
        nacionalidadGerente: getValue('nacionalidadGerente'),
        domicilioGerente: getValue('domicilioGerente'),
        eximeCaucion: getValue('eximeCaucion'),

        nombreApoderado: getValue('nombreApoderado'),
        nacionalidadApoderado: getValue('nacionalidadApoderado'),
        lugarNacimientoApoderado: getValue('lugarNacimientoApoderado'),
        fechaNacimientoApoderado: getValue('fechaNacimientoApoderado'),
        estadoCivilApoderado: getValue('estadoCivilApoderado'),
        ocupacionApoderado: getValue('ocupacionApoderado'),
        domicilioApoderado: getValue('domicilioApoderado'),
        claveElectorApoderado: getValue('claveElectorApoderado'),
        facultadesApoderado: facultadesSeleccionadas,

        // Socios
        socios: sociosData,
        sociosNombres: sociosNombres,
        sociosDescripcion: sociosDescripcion
    };
}

// ===== GENERACIÓN DE DOCUMENTO =====
window.generateDocument = async function () {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> Generando...';
    btn.disabled = true;

    try {
        const data = collectAllData();
        const doc = await createWordDocument(data);

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Escritura_${data.denominacion.replace(/\s+/g, '_')}_${Date.now()}.docx`);

        alert('¡Documento generado exitosamente!');
    } catch (error) {
        console.error('Error al generar documento:', error);
        alert('Error al generar el documento. Por favor, intente nuevamente.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function createWordDocument(data) {
    // Configurar tamaño de página Legal (21.6 x 35.6 cm)
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    size: {
                        width: convertInchesToTwip(8.5), // 21.6 cm
                        height: convertInchesToTwip(14), // 35.6 cm
                    },
                    margin: {
                        top: convertInchesToTwip(1),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(1.5),
                    },
                },
            },
            children: [
                // Encabezado
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `ESCRITURA PÚBLICA NÚMERO ${data.numeroEscritura} `,
                            bold: true,
                            size: 24,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: `VOLUMEN ${data.volumen} `,
                            bold: true,
                            size: 24,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),

                // Contenido principal
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `----- En la Ciudad de ${data.ciudad}, ${data.estado}, México, a los ${data.dia} días del mes de ${data.mes} del año ${data.anio}, ante mí, ${data.notario}, con ejercicio y residencia en esta Demarcación Notarial, COMPARECIERON: ----------------------------------------------`,
                            size: 22,
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: `----- Los señores ${data.sociosNombres}, todos por su propio derecho y quienes dijeron: --------------------------- `,
                            size: 22,
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: '----- Que vienen a constituir y constituyen una "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE", conforme a la Ley General de Sociedades Mercantiles y en base a los siguientes:-------------------------',
                            size: 22,
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                }),

                // ANTECEDENTES
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'ANTECEDENTES',
                            bold: true,
                            size: 24,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: `ÚNICO. Para la constitución de esta Sociedad, se solicitó y obtuvo la Autorización de Uso de la Denominación o Razón Social "${data.denominacionAutorizada}", expedida por la Secretaría de Economía, que consta únicamente al anverso de ${data.numeroHojas} hojas, con Clave Única de Documento (CUD) ${data.cud}, la cual se agrega al apéndice y al testimonio de esta escritura bajo la LETRA "${data.letraApendice}".- Conforme al artículo (22) veintidós del Reglamento para la Autorización de Uso de Denominaciones y Razones Sociales, el suscrito Notario explicó a los comparecientes el contenido y efectos de dicho precepto, así como las obligaciones establecidas en el mismo a cargo de la Sociedad que usará la denominación o razón social autorizada, y que consisten en las siguientes: “I. Responder por cualquier daño, perjuicio o afectación que pudiera causar el uso indebido o no autorizado de una Denominación o Razón Social otorgada mediante la presente Autorización, conforme a la Ley de Inversión Extranjera y al Reglamento para la Autorización de Uso de Denominaciones y Razones Sociales, y II. Proporcionar a la Secretaría de Economía la información y documentación que le sea requerida por escrito o a través del Sistema en relación con el uso de la Denominación o Razón Social otorgada mediante la presente Autorización, al momento de haberla reservado, durante el tiempo en que se encuentre en uso, y después de que se haya dado el Aviso de Liberación respecto de la misma.- Las obligaciones establecidas en las fracciones anteriores, deberán constar en el instrumento mediante el cual se formalice la constitución de la Sociedad o Asociación o el cambio de su Denominación o Razón Social.”`,
                            size: 22,
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                }),

                // CLÁUSULAS
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'CLÁUSULAS',
                            bold: true,
                            size: 24,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: `----- ÚNICA.Los señores ${data.sociosNombres}, constituyen una Sociedad de Responsabilidad Limitada de Capital Variable conforme a los siguientes: `,
                            size: 22,
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                }),

                // ESTATUTOS
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'ESTATUTOS',
                            bold: true,
                            size: 24,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'DENOMINACIÓN, DOMICILIO, DURACIÓN, OBJETO Y NACIONALIDAD',
                            bold: true,
                            size: 24,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                }),

                // Artículos (continúa con el resto del documento...)
                ...generateArticulos(data),

                // Firmas
                ...generateFirmas(data),
            ],
        }],
    });

    return doc;
}

function generateArticulos(data) {
    const paragraphs = [];

    // ARTÍCULO PRIMERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO PRIMERO.- DENOMINACIÓN.- La Sociedad se constituye bajo la denominación "${data.denominacion}", la que deberá ir seguida de las palabras "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE" o por su abreviatura "S. DE R.L. DE C.V."--`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO SEGUNDO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `------ARTÍCULO SEGUNDO.- DOMICILIO.- El domicilio de la Sociedad es en la Ciudad de ${data.ciudad}, ${data.estado}; sin embargo, podrá establecer locales, oficinas, sucursales, agencias y señalar domicilios convencionales en cualquier parte de la República Mexicana o en el extranjero, sin que se entienda por ello cambio de domicilio.--------------------------------------------------------------------------------------------------------------------- `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO TERCERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO TERCERO.- DURACIÓN.- La duración de la Sociedad es ${data.duracion} a partir de la fecha de firma de esta escritura.--`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO CUARTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO CUARTO.- OBJETO.- La Sociedad tendrá por objeto: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----1. - ${data.objetoSocial} `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // Actividades Secundarias if present
    if (data.actividadesSecundarias && data.actividadesSecundarias !== 'XXXXX' && data.actividadesSecundarias.trim() !== '') {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----2. - ${data.actividadesSecundarias} `,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        }));
    }

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- En relación y para la consecución de dichos fines, la Sociedad podrá realizar cualquiera de los siguientes actos: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    const actividades = [
        'a) Adquirir, enajenar, arrendar, subarrendar o por cualquier título obtener la propiedad, uso, goce, disfrute, posesión, disposición, comercio, operación y gravamen, ya sea por cuenta propia o de terceros, de toda clase de bienes muebles o inmuebles o derechos reales o personales sobre los mismos, que sean necesarios para el logro de sus fines sociales.',
        'b) Formar parte como asociada o socia de otras asociaciones o sociedades.',
        'c) Fungir como representante, mandatario, apoderado o intermediario de cualquier persona física o moral, pública o privada, nacional o extranjera.',
        'd) Contratar trabajadores, empleados, prestadores de servicios o proveedores.',
        'e) Actuar como contratista, proveedor o prestador de servicios de los Gobiernos Federal, Estatales y Municipales; de instituciones, organizaciones, entidades o empresas públicas o privadas; y de personas físicas o morales.',
        'f) Participar en cualquier licitación, concurso o procedimiento para la adjudicación de contratos, bienes o servicios ante autoridades, dependencias, organismos, institutos o entidades Federales, Estatales o Municipales, así como personas físicas o morales.',
        'g) Adquirir directa o indirectamente la propiedad, titularidad, uso, aprovechamiento, disfrute, explotación o derechos respecto de concesiones, permisos, licencias, autorizaciones, subsidios o estímulos de cualquier naturaleza; o propiedad industrial o intelectual, conforme a las disposiciones legales aplicables.',
        'h) Obtener cualquier clase de préstamo o financiamiento.',
        'i) Contratar y celebrar convenios respecto de cuentas bancarias y de inversión, así como girar cheques en contra de las mismas.',
        'j) Importar, exportar, adquirir, comercializar o distribuir cualquier clase de bienes que se relacionen con los fines sociales.',
        'k) Emitir, suscribir, negociar y avalar títulos de crédito en operaciones relacionada con los fines sociales cualquier tipo operación a favor propio o de tercero.',
        'l) Obtener y otorgar préstamos, así como garantías reales o personales en relación con el objeto social / cualquier tipo operación a favor propio o de tercero.',
        'm) Establecer oficinas y sucursales en el país o en el extranjero para el cumplimiento del objeto social.',
        'n) Celebrar o realizar toda clase de actos, operaciones, contratos o convenios, cualquiera que sea su naturaleza, que sean permitidos por las leyes y sean necesarios para cumplir o realizar los fines sociales.',
        'ñ) Cualquier otra que sea necesaria para realizar el objeto social.',
        'o) Cualquier acto de comercio de manera legal, relacionado con su objeto social.'
    ];

    actividades.forEach(act => {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- ${act} `,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
        }));
    });

    // ARTÍCULO QUINTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO QUINTO.- NACIONALIDAD.- La Sociedad se constituye conforme a las leyes de los Estados Unidos Mexicanos, por lo que es de NACIONALIDAD MEXICANA.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO SEXTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO SEXTO.- CLAUSULA ADMISIÓN DE EXTRANJEROS.- La Sociedad se constituye con cláusula de admisión de extranjeros, conforme a lo dispuesto en el artículo (15) quince de la Ley de Inversión Extranjera y en el artículo (14) catorce del Reglamento de la Ley de Inversión Extranjera y del Registro Nacional de Inversiones Extranjeras, por lo que los socios extranjeros actuales o futuros se obligan ante la Secretaría de Relaciones Exteriores a considerarse como nacionales respecto de: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- I. Las partes sociales o derechos que adquieran de la Sociedad; `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- II. Los bienes, derechos, concesiones, participaciones o intereses de los que sea titular la Sociedad; y, `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- III. Los derechos y obligaciones que deriven de los contratos en que sea parte la Sociedad.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- Con motivo de lo anterior, los socios extranjeros de la Sociedad, actuales o futuros, renuncian a invocar la protección de sus gobiernos, bajo la pena, en caso contrario, de perder en beneficio de la Nación Mexicana los derechos y bienes que hubiesen adquirido, en términos de lo establecido en el artículo (27) veintisiete, fracción (I) uno romano, de la Constitución Política de los Estados Unidos Mexicanos.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // CAPITAL SOCIAL Y PARTES SOCIALES
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'CAPITAL SOCIAL Y PARTES SOCIALES',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    // ARTÍCULO SÉPTIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO SÉPTIMO. El capital social es variable. El capital mínimo fijo sin derecho a retiro es de $${formatCurrency(data.capitalFijo)} (MONEDA NACIONAL), el cual estará representado por partes sociales, nominativas, íntegramente suscritas y pagadas.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- La parte variable del capital social será ilimitada y se podrá aumentar o disminuir por retiro total o parcial de las aportaciones de los socios conforme a lo establecido en la Ley General de Sociedades Mercantiles y estos Estatutos.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- Cualquier aumento o disminución del capital se deberá registrar en el libro de registro correspondiente.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- Los aumentos en la parte mínima fija o en la parte variable del capital social se realizarán mediante resolución de la Asamblea de Socios.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- Las disminuciones en la parte mínima fija y en la parte variable del capital requerirán de resolución de la Asamblea de Socios. La Sociedad podrá amortizar partes sociales con utilidades que legalmente se puedan destinar al pago de dividendos.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO OCTAVO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO OCTAVO.- Los socios no podrán ser titulares de más de una parte social. En caso de adquisición total o parcial de una parte social o de aportaciones adicionales, la parte social se incrementará en la cantidad que corresponda, excepto cuando las partes sociales confieran distintos derechos, en cuyo caso las partes sociales se podrán mantener por separado.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO NOVENO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO NOVENO.- Los socios tendrán derecho de preferencia para realizar aportaciones con motivo del incremento del capital social, en la proporción que corresponda a sus partes sociales, el que se deberán ejercer dentro de los tres días naturales posteriores a la fecha de la Asamblea en las que se apruebe el aumento, mediante comunicado escrito que se entregue al Gerente de la Sociedad. Las cantidades respecto de las cuales no se ejerza dicho derecho, se distribuirá proporcionalmente entre los socios que estén interesados en realizar las aportaciones correspondientes.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DÉCIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO.- Para que los socios puedan ceder sus partes sociales se requerirá el consentimiento de los socios que representen la mayoría del capital social. En ese supuesto, los otros socios tendrán el derecho del tanto para adquirir las partes sociales cuya cesión se autorice, el que deberán ejercer dentro de los quince días naturales siguientes a la fecha de la Asamblea en la que se haya otorgado la autorización respectiva.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- La transmisión de partes sociales por herencia no requerirá el consentimiento de los socios.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // SOCIOS
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'SOCIOS',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    // ARTÍCULO DECIMO PRIMERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO PRIMERO.- Para ser admitido como socio se requerirá el consentimiento de los socios que representen la mayoría del capital social.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DECIMO SEGUNDO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO SEGUNDO.- La Sociedad llevará un Libro de Registro de Socios en el que se indicará el nombre, domicilio y aportaciones de cada socio, así como la transmisión de las partes sociales.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DECIMO TERCERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO TERCERO.- En virtud de que la Sociedad se constituye bajo el régimen de responsabilidad limitada, cada socio responderá de las obligaciones sociales hasta por el monto de sus aportaciones al capital social.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DECIMO CUARTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO CUARTO.- Los socios tendrán los siguientes derechos: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    const derechos = [
        '1. Concurrir a las Asambleas con derecho de voz y voto.',
        '2. Ser propuestos para ocupar cargos en la Sociedad.',
        '3. Vigilar que las aportaciones y el patrimonio se destinen al cumplimiento de los objetos sociales.',
        '4. Los demás derechos previstos en estos estatutos.'
    ];

    derechos.forEach(der => {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- ${der} `,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
        }));
    });

    // ARTÍCULO DECIMO QUINTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO QUINTO.- Los socios tendrán las siguientes obligaciones: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100, before: 100 },
    }));

    const obligaciones = [
        '1. Respetar y hacer cumplir los estatutos de la Sociedad, así como las normas y políticas que apruebe la Asamblea de Socios.',
        '2. Abstenerse de votar en la Asamblea respecto de cualquier asunto en el que tengan un interés en conflicto.',
        '3. Acatar y cumplir todas las resoluciones y acuerdos que adopte la Asamblea de Socios.',
        '4. Desempeñar con esmero, cuidado y diligencia los cargos, puestos o comisiones que le confiera la Asamblea de Socios.',
        '5. Las demás obligaciones previstas en estos estatutos.'
    ];

    obligaciones.forEach(obl => {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- ${obl} `,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
        }));
    });

    // ASAMBLEA DE SOCIOS
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'ASAMBLEA DE SOCIOS',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    // ARTÍCULO DECIMO SEXTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO SEXTO.- La Asamblea de Socios es el órgano supremo de la Sociedad; estará integrada únicamente por los socios que formen parte de la misma; y podrá acordar y ratificar todos los actos de la Sociedad, y estará facultado para tocar todos los temas que se mencionan en el artículo 78 (setenta y ocho) de la Ley General de Sociedades Mercantiles.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- CADA SOCIO TENDRÁ DERECHO A PARTICIPAR EN LAS DECISIONES DE LAS ASAMBLEAS, GOZANDO DE UN VOTO POR CADA $1,000.00 (MIL PESOS 00 / 100 MONEDA NACIONAL) DE SU APORTACIÓN, COMO SE MENCIONA EN EL ARTÍCULO 79 (SETENTA Y NUEVE) DE LA LEY ANTES DICHA.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DECIMO SEPTIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO SÉPTIMO.- Las Asambleas deberán celebrarse en el domicilio social, salvo caso fortuito o de fuerza mayor.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DECIMO OCTAVO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO OCTAVO.- Las convocatorias para las Asambleas Generales de Socios se realizarán por el Gerente o Consejo de Gerentes; por omisión de éste por el Comisario; en caso de incumplimiento de los primeros, por socios cuyas partes sociales representen más de la tercera parte del capital social; o por una autoridad jurisdiccional, conforme a lo establecido en la Ley.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO DECIMO NOVENO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO DÉCIMO NOVENO.- Las convocatorias para las Asambleas deberán ser firmadas por quien las haga y contendrán el orden del día, el lugar, fecha y hora de la reunión. No podrá tratarse asunto alguno que no esté incluido expresamente en ella, salvo los casos en que asistan o esté representada la totalidad de los socios y se acuerde por unanimidad de votos que se trate determinado asunto.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `Las convocatorias deberán publicarse conforme a lo establecido en la Ley General de Sociedades Mercantiles.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO.Las Asambleas podrán reunirse sin previa convocatoria y sus acuerdos serán válidos si al momento de la votación están presentes la totalidad de socios.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO PRIMERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO PRIMERO.Los socios, bajo su responsabilidad, podrán ser representados en las asambleas por la persona o personas que designen mediante simple carta poder firmada ante dos testigos.Dichos poderes podrán ser generales; o bien, indicar en ellos las instrucciones necesarias para el ejercicio del derecho de voto.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- No podrán ser apoderados los empleados de la Sociedad o los miembros de los órganos de administración o de vigilancia de la Sociedad.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO SEGUNDO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO SEGUNDO.Para asistir a las asambleas los socios deberán estar inscritos en el Libro de Registro de Socios.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO TERCERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO TERCERO.Las asambleas serán presididas por el Gerente o, en su ausencia, por el socio nombrado por mayoría de votos de los socios presentes.El Presidente nombrará un escrutador de entre los socios o representantes de socios presentes, quien formulará la lista de asistencia y certificará la presencia del quórum requerido en estos estatutos.Hecho lo anterior, el Presidente declarará instalada la asamblea y procederá a tratar los asuntos del orden del día.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO CUARTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO CUARTO.Las decisiones en asamblea serán tomadas conforme a lo establecido en el artículo 77(setenta y siete) de la mencionada Ley.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO QUINTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO QUINTO.A solicitud de los socios que representen la tercera parte de partes sociales en que se divide el capital social, se podrá aplazar por el término de tres días y sin necesidad de nueva convocatoria, la votación de cualquier asunto respecto del cual los socios consideren que no cuentan con suficiente información o que sea necesario realizar previamente un determinado acto.Este aplazamiento sólo podrá realizarse por una sola vez para el mismo asunto.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO SEXTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO SEXTO.Una vez que se declare instalada la asamblea, los socios no podrán abandonarla para evitar su celebración, salvo que se trate de asamblea reunida sin publicación de convocatoria.Los socios que se retiren o los que no concurran a la reanudación de una asamblea en el caso previsto en el artículo inmediato anterior, se entenderá que emiten su voto en el sentido de la mayoría de los presentes.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO SEPTIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO SEPTIMO.De cada Asamblea se elaborará el acta correspondiente, la que se asentará en el libro respectivo o se protocolizará ante fedatario público, y deberá contener: la fecha de su celebración; los nombres de los asistentes; el número de votos emitidos; los acuerdos que se tomen, que se consignarán a la letra; y, la firma de las personas que funjan como Presidente y Secretario de la misma.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO OCTAVO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO OCTAVO.Los acuerdos tomados en contravención de estos estatutos serán nulos.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ADMINISTRACIÓN DE LA SOCIEDAD
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'ADMINISTRACIÓN DE LA SOCIEDAD',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    // ARTÍCULO VIGÉSIMO NOVENO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO VIGÉSIMO NOVENO.- La administración de la Sociedad estará a cargo de uno o más Gerentes, según determine la Asamblea de Socios.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO TRIGÉSIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO TRIGÉSIMO.- El o los Gerentes podrán ser socios o personas extrañas a la Sociedad y garantizarán el desempeño de sus funciones en la forma y términos que determine la Asamblea de Socios. Durarán en funciones hasta que sus sucesores sean designados y tomen posesión de sus cargos.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO TRIGÉSIMO PRIMERO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO TRIGÉSIMO PRIMERO.- El o los Gerentes tendrán la representación legal de la Sociedad y tendrán los poderes y facultades para PLEITOS Y COBRANZAS, ACTOS DE ADMINISTRACIÓN, PODER LABORAL, PODER GENERAL PARA ACTOS DE DOMINIO, PODER PARA SUSCRIBIR TÍTULOS Y OPERACIONES DE CRÉDITO, PODER CAMBIARIO, y FACULTADES PARA CONFERIR PODERES.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // A) PODER GENERAL PARA PLEITOS Y COBRANZAS
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- A).- PODER GENERAL PARA PLEITOS Y COBRANZAS.- Representar a la Sociedad ante toda clase de personas físicas y morales y ante toda clase de autoridades ya sean estas Administrativas, Judiciales, Militares, Fiscales, del trabajo o de cualquier otra índole, ya fueren Federal, Estatal, Municipal y del Distrito Federal, con todas las facultades generales PARA PLEITOS Y COBRANZAS, y aún las especiales que requieran poder o cláusula especial conforme a cualquier ley, sin limitación alguna con facultades para interponer cualquier recurso, en toda clase de juicios tanto en lo principal, como en sus incidentes, aún el extraordinario de amparo, directo o indirecto y desistirse de él, presentar querellas o denuncias, ratificarlas y desistirse de ellas, y constituirse en parte civil cuando proceda la reparación del daño, en los términos del Primer Párrafo del Artículo 2, 554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal; Su correlativo el 2, 831 (dos mil ochocientos treinta y uno) del Código Civil vigente en el Estado de Sonora, y de los concordantes de ambos preceptos de los mismos ordenamientos de los diversos Estados de la República Mexicana, incluyéndose también las facultades enumeradas por los Artículos 2587 (dos mil quinientos ochenta y siete) del primero de dichos Códigos, 2868 (dos mil ochocientos sesenta y ocho) del segundo y los concordantes de los terceros.- En forma enunciativa y no limitativa el podrá: I.- Promover y desistirse de toda clase de acciones, recursos, juicios y procedimientos aún el de amparo.- II.- Transigir.- III.- Articular y absolver posiciones.- IV.- Comprometer en árbitros.- V.- Recusar.- VI.- Recibir pagos y recibir cesión de bienes.- VII.- Firmar todo tipo de contratos o convenios.- VIII.- Formular y ratificar denuncias y querellas del Orden Penal y desistirse de ellas, otorgar el perdón en su caso y constituirse en coadyuvante del Ministerio Público.- IX.- Interponer juicios de amparo y desistirse de ellos.- X.- Gestionar por conducto de las Autoridades correspondientes la reparación del daño provenientes de delitos; intervenir en los procedimientos respectivos y otorgar el perdón cuando lo estime conveniente.- XI.- Exigir a nombre de la Sociedad el cumplimiento de las obligaciones contraídas por terceros.- XII.- Ejercitar el poder ante la Secretaría del Trabajo y Previsión Social, ante el Instituto Mexicano del Seguro Social, SECRETARÍA DE HACIENDA Y CRÉDITO PÚBLICO y ante toda clase de TRIBUNALES JUDICIALES FEDERALES O ESTATALES; XIII.- Promover remates, como postor, realizar pujas, mejorar posturas, pedir la adjudicación de bienes, comparecer o participar en toda clase de concursos o licitaciones y realizar cualquier acto y en cualquier juicio o procedimiento, actuando en nombre y representación de la Sociedad. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- El apoderado o apoderados podrán firmar todo tipo de contratos o convenios o cualquier otro documento que fuere necesario y podrán participar en cualquier licitación municipal, estatal o federal o por el sistema de Compranet, en asuntos relacionados con la presente Sociedad.--------------- `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // B) PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- B).- PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN.- Administrar los bienes y dirigir los negocios de la Sociedad, actuando como apoderado GENERAL PARA ACTOS DE ADMINISTRACIÓN en términos de lo dispuesto por el II (segundo) párrafo del Artículo 2, 831 (dos mil ochocientos treinta y uno) del Código Civil vigente en el Estado de Sonora; II (segundo) párrafo del Artículo 2, 554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal y sus correlativos, los Códigos Civiles de los Estados de la República Mexicana.- En general, tendrá facultades para realizar cualquier acto de administración sea cual fuere su nombre, por lo que representará a la Sociedad ante toda clase de personas, autoridades, organismos, Instituciones de Crédito, Organismo Descentralizados, empresas de participación estatal, etcétera.- Podrá nombrar y remover libremente a los funcionarios y empleados de la Sociedad, otorgarles y modificarles facultades, fijar emolumentos, podrá establecer oficinas, departamentos, sucursales y agencias de la Sociedad, así como suprimirlas y movilizarlas.- Proponer a la Asamblea de accionistas las resoluciones a que juzguen pertinentes y provechosas para los fines de la Sociedad.- Ejercitar la dirección, manejo y control de los asuntos de la Sociedad y de todas sus propiedades, celebrando y vigilando el cumplimiento de toda clase de actos, convenios y contratos que fueren necesarios. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- EL PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN COMPRENDE FACULTADES PARA QUE PUEDA LLEVAR TRAMITES FISCALES O ADMINISTRATIVOS QUE FUERAN NECESARIOS ANTE LA SECRETARIA DE HACIENDA Y CRÉDITO PÚBLICO, ANTE EL SERVICIO DE ADMINISTRACIÓN TRIBUTARIA(SAT), DAR DE ALTA A LA PERSONA MORAL, SOLICITAR LA FIRMA ELECTRÓNICA AVANZADA(FIEL), SOLICITAR DEVOLUCIONES DE IVA Y OTRAS QUE FUEREN NECESARIO, ANTE EL INSTITUTO MEXICANO DEL SEGURO SOCIAL Y / O CUALQUIERA OTRA DEPENDENCIA QUE FUERE NECESARIA. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // C) PODER LABORAL
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- C).- PODER LABORAL Podrá ser ejercitado ante las autoridades del trabajo y servicios sociales que se señalan en el Artículo 523(quinientos veintitrés) de la Ley Federal del Trabajo, así como ante las juntas locales y federales de conciliación y arbitraje; confiriéndose a los profesionistas mencionados las facultades más amplias que en derecho procedan para intervenir en representación de la sociedad en la totalidad del proceso conciliatorio y en la totalidad del proceso de juicio instituido bajo el modelo anterior a la reforma laboral publicada el 01 de mayo de 2019 en todas sus etapas, a la audiencia prevista por el artículo 873 de la ley federal del trabajo de conciliación, demanda y excepciones, a la audiencia prevista por el artículo 880 de ofrecimiento y admisión de pruebas, así como a todas y cada una de las diligencias, desahogos y etapas del juicio laboral anterior a la reforma mencionada; así mismo, se confiere a los profesionistas mencionados las más amplias facultades para que intervengan en representación de la sociedad en la totalidad del proceso conciliatorio ante los centros de conciliación, locales y federales, así como a la totalidad del proceso de juicio instituido bajo el nuevo modelo derivado de la reforma laboral publicada en el diario oficial de la federación el 01 de mayo de 2019, a fin de que representen a la sociedad tanto en la audiencia preliminar prevista por los artículos 873 - E, 873 - F y 873 - G de la ley federal del trabajo, así como a la audiencia de juicio prevista por los artículos 873 - H, 873 - I, 873 - J, 873 - K y demás relativos y aplicables, con amplias facultades para realizar defensas y excepciones, presentar replicas, contrarréplicas, ofrecer y desahogar pruebas, proponer y absolver posiciones, promover cualquier tipo de acción, excepción, defensa, aclaración, incidente, recurso, recusación, proponer arreglos conciliatorios, para tomar decisiones y para suscribir convenios en términos del invocado dispositivo legal; así también podrán señalar domicilios para recibir notificaciones en términos de lo dispuesto por el Artículo 739(setecientos treinta y nueve) de la Ley Federal del Trabajo.Poder General para llevar a cabo actos de rescisión en términos de los dispuesto por los Artículos 46(cuarenta y seis) y 47(cuarenta y siete) de la Ley Federal del Trabajo. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // D) PODER GENERAL (RESCISIÓN)
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- D).- PODER GENERAL.- Podrán llevar a cabo actos de rescisión en términos de lo dispuesto por los Artículos 46 y 47 (cuarenta y seis y cuarenta y siete) de la Ley Federal del Trabajo. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // E) PODER GENERAL PARA ACTOS DE DOMINIO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- E).- PODER GENERAL PARA ACTOS DE DOMINIO en los más amplios términos del párrafo Tercero del Artículo 2, 831 (dos mil ochocientos treinta y uno) del Código Civil vigente en el Estado de Sonora y sus correlativos el 2, 554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal y sus correlativos y concordantes de los Códigos Civiles de los Estados de la República Mexicana, actos como vender, gravar, pignorar, hipotecar, ceder, donar, dar en prenda, fianza, etcétera, los bienes de la Sociedad.- Celebrar cualquier acto de riguroso dominio. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // F) PODER PARA SUSCRIBIR TÍTULOS Y OPERACIONES DE CRÉDITO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- F).- PODER PARA SUSCRIBIR TÍTULOS Y OPERACIONES DE CRÉDITO.- Podrá realizar y celebrar cualquier tipo de actos, contratos y operaciones de créditos, pero en asuntos estrictamente relacionados con la Sociedad, tales como librar, aceptar, suscribir, girar, avalar, endosar, descontar, títulos de crédito etcétera, incluyendo cheques, en términos del Artículo 9 (noveno) de la Ley General de Títulos y de Operaciones de Créditos. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // G) PODER CAMBIARIO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- G).- PODER CAMBIARIO.- Para ejercerse en toda la extensión de la República Mexicana y en el extranjero, pero tan amplio como en derecho sea necesario, para emitir, aceptar, girar, librar, endosar, certificar, descontar, efectuar y realizar en cualquier forma de suscripción, títulos y operaciones de crédito, títulos valor con o sin garantía e instrumentos de pago, así como todo tipo de convenios, contratos, negocios, actos jurídicos y operaciones que estén relacionadas directa o indirectamente con los mismos, en los términos más amplios que establecen los artículos 9º. (noveno), fracción I (primera), párrafo final, 85 (ochenta y cinco), 174 (ciento setenta y cuatro) y 196 (ciento noventa y seis) de la Ley General de Títulos y Operaciones de Crédito; afianzar, coafianzar, y en general garantizar en nombre de la Sociedad Poderdante en forma individual, solidaria, subsidiaria o mancomunada, según corresponda a los intereses de la Sociedad Poderdante, con o sin contraprestación, incluso con prenda, hipoteca, fideicomiso o bajo cualquier otra forma de garantía permitida por la ley, obligaciones a cargo de la Sociedad Poderdante, pudiendo por lo tanto suscribir títulos de crédito, convenios, contratos y demás documentos que fueren necesarios o convenientes para el otorgamiento de dichas garantías; se incluyen las facultades de abrir y firmar cuentas de cheques en las instituciones bancarias, de disponer de sus fondos y las de cancelación de las mismas, en su caso, así como para que autorice a terceras personas a realizar los actos dentro de los que al propio Gerente o al órgano de administración en su caso, se le otorgan y confieren, de depósito en otras instituciones u organizaciones auxiliares de crédito y, de obligar a la Sociedad Mandante, en cualquier forma que legalmente estime necesaria dentro de las operaciones propias de sus autorizaciones, y en forma enunciativa y no limitativa podrá además realizar toda clase de operaciones con instituciones de crédito, nacionales y extranjeras, con intermediarios del mercado de valores, organizaciones auxiliares del crédito, sociedades de inversión, casas de bolsa, para disponer o depositar fondos, títulos de crédito o títulos de valor, desde luego dentro de las atribuciones que por este instrumento le otorga el órgano supremo de la Sociedad. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // H) FACULTADES PARA CONFERIR PODERES
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- H).- FACULTADES PARA CONFERIR PODERES generales o especiales, mandatos judiciales o facultades administrativas, y revocar en cualquier tiempo tales poderes; así como para sustituir o delegar en cualquier persona, sean o no accionistas, las facultades que le son conferidas, reservándose su ejercicio. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // I)
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- I).- Llevar a cabo todos los actos, operaciones y negocios de la Sociedad y celebrar todos los contratos y convenios y suscribir toda clase de documentos y escrituras que considere convenientes para el mejor desarrollo del objeto social. -- - `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));



    // EJERCICIOS SOCIALES
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'EJERCICIOS SOCIALES',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    // ARTÍCULO TRIGÉSIMO QUINTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO TRIGÉSIMO QUINTO.- Los ejercicios sociales serán de un año a partir del (1º) primero de enero y hasta el (31) treinta y uno de diciembre de cada año, excepción hecha del primer ejercicio que iniciará en la fecha de constitución de la Sociedad.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // DISOLUCIÓN Y LIQUIDACIÓN
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'DISOLUCIÓN Y LIQUIDACIÓN',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    // ARTÍCULO TRIGÉSIMO SEXTO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO TRIGÉSIMO SEXTO.- La Sociedad se disolverá por las siguientes causas: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    const causasDisolucion = [
        'a) Por acuerdo de la Asamblea General de Socios;',
        'b) Por dejar de cumplir o por que se vuelva imposible el objeto social;',
        'c) Por resolución judicial definitiva e inapelable;',
        'd) Por haber concluido el plazo de duración; y,',
        'e) Por cualquier otra causa que establezcan las leyes.'
    ];

    causasDisolucion.forEach(causa => {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- ${causa} `,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
        }));
    });

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- En caso de liquidación, la Asamblea General de Socios que haya acordado la disolución nombrará un liquidador. Si la liquidación tiene por causa la expiración del término fijado para la duración de la Sociedad, se convocará a la Asamblea para que haga el nombramiento de liquidador.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULO TRIGÉSIMO SEPTIMO
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ARTÍCULO TRIGÉSIMO SÉPTIMO.- El liquidador tendrá las facultades que le conceda la Asamblea General de Socios que lo nombre, las que deberán ser suficientes para representar a la Sociedad durante el proceso de liquidación, recuperar y realizar los activos, y liquidar los pasivos.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // ARTÍCULOS TRANSITORIOS
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'ARTÍCULOS TRANSITORIOS',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- Los socios reunidos en Asamblea General de Socios, aprueban por unanimidad las siguientes resoluciones: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- PRIMERO.- La parte mínima fija del capital social se constituye por la cantidad de $${formatCurrency(data.capitalFijo)} (MONEDA NACIONAL), conforme a lo siguiente: `,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // Tabla de aportaciones (simplificada para Word)
    paragraphs.push(...generateAportacionesWord(data));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- Los comparecientes declaran, bajo formal protesta de decir verdad, que con anterioridad a la fecha de esta escritura pagaron en efectivo la totalidad de sus participaciones.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- SEGUNDO.- Los socios acuerdan que la Sociedad se administre por un GERENTE, y para ocupar ese cargo nombran a ${data.nombreGerente}, a quien se le otorgan los poderes y facultades que se establecen en el Artículo Trigésimo Primero de los estatutos sociales, el cual se tiene por reproducido como si se insertase a la letra.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- ${data.eximeCaucion === 'SI' ? 'Se exime al Gerente de la obligación de caucionar su gestión.' : 'El Gerente deberá caucionar su gestión.'}`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- TERCERO.- Los socios acuerdan nombrar como APODERADO LEGAL a ${data.nombreApoderado}. Facultades otorgadas: ${data.facultadesApoderado.join(', ')}`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    // GENERALES
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'GENERALES',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: `----- EL SEÑOR ${data.nombreApoderado}, quien dijo ser de nacionalidad ${data.nacionalidadApoderado}, haber nacido en ${data.lugarNacimientoApoderado}, el día ${data.fechaNacimientoApoderado}, de estado civil ${data.estadoCivilApoderado}, de ocupación ${data.ocupacionApoderado} y con domicilio en ${data.domicilioApoderado}, quien se identificó con credencial para votar con fotografía con clave de elector número ${data.claveElectorApoderado}.`,
            size: 22,
        })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
    }));

    if (data.gerenteSocio === 'EXTERNO') {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- EL SEÑOR ${data.nombreGerente}, de nacionalidad ${data.nacionalidadGerente}, con domicilio en ${data.domicilioGerente}, quien desempeña el cargo de GERENTE de la sociedad.`,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        }));
    }

    // EL SUSCRITO NOTARIO CERTIFICA
    paragraphs.push(new Paragraph({
        children: [new TextRun({
            text: 'EL SUSCRITO NOTARIO CERTIFICA:',
            bold: true,
            size: 24,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
    }));

    const certificaciones = [
        `1. - Que los otorgantes manifestaron que se reconocen su personalidad jurídica y que se identificaron legalmente ante el Suscrito Notario, con los documentos citados, los cuales en copia simple agrego al testimonio y al legajo apéndice, marcadas con la letra "C", quienes a mi juicio, son hábiles para contratar y obligarse.`,
        `2. - Que los otorgantes ${data.sociosNombres}, en este acto me exhiben sus cédulas de identificación fiscal, expedida por el Servicio de Administración Tributaria de la Secretaria de Hacienda y Crédito Público, mismas que en copia fotostática agrego al testimonio y apéndice de este instrumento marcadas con las letras "D", por lo que me cercioré que el Registro Federal de Contribuyentes que en sus generales han declarado, concuerdan fiel y exactamente con las Cédulas de Identificación Fiscal.`,
        `3. - Que manifestaron bajo protesta de decir verdad, estar al corriente en el cumplimiento de sus obligaciones legales, fiscales y tributarias sin haberlo acreditado al momento de la celebración del presente acto jurídico.`,
        `4. - Que advertí a los comparecientes que deberán acreditarme dentro del plazo del mes siguiente a la fecha de firma de la presente escritura, haber presentado la solicitud de inscripción de la Sociedad en el Registro Federal de Contribuyentes, y que en caso de no exhibirme dicha solicitud, procederé a dar el aviso correspondiente a las autoridades fiscales competentes.`,
        `5. - Que leyeron la escritura por sí mismos y se les explicó el valor y las consecuencias legales del contenido de la misma.`,
        `6. - Que les expliqué la necesidad de su inscripción en los registros correspondientes.`,
        `7. - Que se manifestaron conformes con los términos de la escritura, ratificándola y firmándola ante el Suscrito Notario de todo lo cual DOY FE.`
    ];

    certificaciones.forEach(cert => {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- ${cert} `,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        }));
    });

    return paragraphs;
}

function generateFirmas(data) {
    const paragraphs = [];
    const sociosArray = data.sociosNombres.split(', ');

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: 'FIRMAS',
                    bold: true,
                    size: 24,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
        })
    );

    sociosArray.forEach(nombre => {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: '_______________________________',
                        size: 22,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 400, after: 100 },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: nombre,
                        size: 22,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            })
        );
    });

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: '_______________________________',
                    size: 22,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: data.notario,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: 'Notario Público',
                    size: 22,
                }),
            ],
            alignment: AlignmentType.CENTER,
        })
    );

    return paragraphs;
}

function generateAportacionesWord(data) {
    const paragraphs = [];
    const socios = data.socios || [];

    socios.forEach((socio, index) => {
        paragraphs.push(new Paragraph({
            children: [new TextRun({
                text: `----- ${socio.nombre}: ${socio.aportacionLetra} (${socio.porcentaje}%)`,
                size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
        }));
    });

    return paragraphs;
}

// ===========================
// SISTEMA DE HISTORIAL (LOCALSTORAGE)
// ===========================
window.showHistory = function() {
    const modal = document.getElementById('historyModal');
    modal.style.display = 'flex';
    renderHistory();
};

window.closeHistory = function() {
    document.getElementById('historyModal').style.display = 'none';
};

function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('sociedad_history') || '[]');
    
    const now = new Date();
    const historyItem = {
        id: Date.now(),
        date: now.toLocaleString('es-MX'),
        denominacion: data.denominacion || 'Sin nombre',
        data: data
    };

    if (history.length > 0 && history[0].denominacion === historyItem.denominacion) {
        history[0] = historyItem;
    } else {
        history.unshift(historyItem);
    }

    if (history.length > 10) history.pop();
    localStorage.setItem('sociedad_history', JSON.stringify(history));
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;

    const history = JSON.parse(localStorage.getItem('sociedad_history') || '[]');
    
    if (history.length === 0) {
        list.innerHTML = '<p class="empty-msg">No hay historial guardado todavía.</p>';
        return;
    }

    list.innerHTML = history.map((item, index) => `
        <div class="history-item">
            <div class="history-info">
                <span class="history-name">${item.denominacion}</span>
                <span class="history-date">${item.date}</span>
            </div>
            <div class="history-actions">
                <button class="btn-load" onclick="loadFromHistory(${index})">
                    <i class="fas fa-file-import"></i> Cargar
                </button>
                <button class="btn-delete" onclick="deleteHistoryItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.deleteHistoryItem = function(index) {
    if (confirm('¿Eliminar este registro del historial?')) {
        let history = JSON.parse(localStorage.getItem('sociedad_history') || '[]');
        history.splice(index, 1);
        localStorage.setItem('sociedad_history', JSON.stringify(history));
        renderHistory();
    }
};

window.loadFromHistory = function(index) {
    const history = JSON.parse(localStorage.getItem('sociedad_history') || '[]');
    const item = history[index];
    if (!item) return;

    if (confirm('¿Deseas cargar los datos de "' + item.denominacion + '"? Esto reemplazará lo que hayas escrito ahora.')) {
        const data = item.data;
        
        // 1. Limpiar socios actuales y resetear contadores
        document.getElementById('sociosContainer').innerHTML = '';
        socios = [];
        socioCounter = 0; // REESTABLECER EL CONTADOR GLOBAL

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined && val !== 'XXXXX' && val !== 'XXX') {
                el.value = val;
                formData[id] = val;
            }
        };

        // 2. Poblar campos de la sociedad
        setVal('denominacion', data.denominacion);
        setVal('ciudad', data.ciudad);
        setVal('estado', data.estado);
        setVal('duracion', data.duracion);
        setVal('objetoSocial', data.objetoSocial);
        setVal('capitalFijo', data.capitalFijo);
        setVal('valorParte', data.valorParte);
        setVal('nombreNotario', data.notario);
        setVal('numeroEscritura', data.numeroEscritura);
        setVal('volumen', data.volumen);
        setVal('denominacionAutorizada', data.denominacionAutorizada);
        setVal('cud', data.cud);
        setVal('fechaExpedicion', data.fechaExpedicion);
        setVal('numeroHojas', data.numeroHojas);
        setVal('letraApendice', data.letraApendice);
        setVal('nombreGerente', data.nombreGerente);
        setVal('nacionalidadGerente', data.nacionalidadGerente);
        setVal('domicilioGerente', data.domicilioGerente);
        setVal('nombreApoderado', data.nombreApoderado);
        setVal('nacionalidadApoderado', data.nacionalidadApoderado);
        setVal('domicilioApoderado', data.domicilioApoderado);
        setVal('lugarNacimientoApoderado', data.lugarNacimientoApoderado);
        setVal('fechaNacimientoApoderado', data.fechaNacimientoApoderado);
        setVal('estadoCivilApoderado', data.estadoCivilApoderado);
        setVal('ocupacionApoderado', data.ocupacionApoderado);
        setVal('claveElectorApoderado', data.claveElectorApoderado);

        // Limpiar checkboxes
        document.querySelectorAll('input[name="facultades"]').forEach(cb => cb.checked = false);
        if (data.facultadesApoderado && Array.isArray(data.facultadesApoderado)) {
            data.facultadesApoderado.forEach(facultad => {
                const cb = document.querySelector(`input[name="facultades"][value="${facultad}"]`);
                if (cb) cb.checked = true;
            });
        }

        // 3. Recrear socios uno por uno
        if (data.socios && Array.isArray(data.socios)) {
            data.socios.forEach((s, idx) => {
                addSocio(); // Esto usa socioCounter y lo incrementa
                
                // Ahora que la card existe, llenamos sus campos
                // addSocio() incrementó socioCounter, por lo que el índice usado fue socioCounter - 1
                const currentIdx = idx; 
                setVal(`socio${currentIdx}_nombre`, s.nombre);
                setVal(`socio${currentIdx}_nacionalidad`, s.nacionalidad);
                setVal(`socio${currentIdx}_domicilio`, s.domicilio);
                setVal(`socio${currentIdx}_identificacionTipo`, s.identificacionTipo);
                setVal(`socio${currentIdx}_claveElector`, s.claveElector);
                setVal(`socio${currentIdx}_institutoExpide`, s.institutoExpide);
                setVal(`socio${currentIdx}_lugarNacimiento`, s.lugarNacimiento);
                setVal(`socio${currentIdx}_fechaNacimiento`, s.fechaNacimiento);
                setVal(`socio${currentIdx}_estadoCivil`, s.estadoCivil);
                setVal(`socio${currentIdx}_ocupacion`, s.ocupacion);
            });
        }

        // 4. Volver al inicio y cerrar
        currentSection = 1;
        navigateToSection(1); // Usar navigateToSection para asegurar que se actualicen las clases de steps
        closeHistory();
        
        alert('Datos cargados con éxito.');
    }
};

window.onclick = function(event) {
    const modalHist = document.getElementById('historyModal');
    const modalPrev = document.getElementById('modalPreview');
    if (event.target == modalHist) modalHist.style.display = "none";
    if (event.target == modalPrev) modalPrev.style.display = "none";
}

