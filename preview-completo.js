// FUNCIÓN COMPLETA PARA PREVIEW - Copiar esta función a app.js reemplazando generatePreview

function generatePreview() {
    const preview = document.getElementById('previewContent');
    const data = collectAllData();

    preview.innerHTML = `
        <h3>ESCRITURA PÚBLICA NÚMERO ${data.numeroEscritura}</h3>
        <h3>VOLUMEN ${data.volumen}</h3>
        
        <p>En la Ciudad de ${data.ciudad}, ${data.estado}, México, a los ${data.dia} días del mes de ${data.mes} del año ${data.anio}, ante mí, ${data.notario}, con ejercicio y residencia en esta Demarcación Notarial, COMPARECIERON:</p>
        
        <p>Los señores ${data.sociosNombres}, todos por su propio derecho y quienes dijeron:</p>
        
        <p>Que vienen a constituir y constituyen una "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE", conforme a la Ley General de Sociedades Mercantiles y en base a los siguientes:</p>
        
        <h3>ANTECEDENTES</h3>
        
        <p>ÚNICO. Para la constitución de esta sociedad, se solicitó y obtuvo la Autorización de Uso de la Denominación o Razón Social "${data.denominacionAutorizada}", expedida por la Secretaría de Economía, que consta únicamente al anverso de ${data.numeroHojas} hojas, con Clave Única de Documento (CUD) ${data.cud}, la cual se agrega al apéndice y al testimonio de esta escritura bajo la LETRA "${data.letraApendice}".- Conforme al artículo (22) veintidós del Reglamento para la Autorización de Uso de Denominaciones y Razones Sociales, el suscrito Notario explicó a los comparecientes el contenido y efectos de dicho precepto, así como las obligaciones establecidas en el mismo a cargo de la sociedad que usará la denominación o razón social autorizada.</p>
        
        <h3>CLÁUSULAS</h3>
        
        <p>ÚNICA. Los señores ${data.sociosNombres}, constituyen una Sociedad de Responsabilidad Limitada de Capital Variable conforme a los siguientes:</p>
        
        <h3>ESTATUTOS</h3>
        <h3>DENOMINACIÓN, DOMICILIO, DURACIÓN, OBJETO Y NACIONALIDAD</h3>
        
        <p>ARTÍCULO PRIMERO.- DENOMINACIÓN.- La sociedad se constituye bajo la denominación "${data.denominacion}", la que deberá ir seguida de las palabras "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE" o por su abreviatura "S. DE R.L. DE C.V."</p>
        
        <p>ARTÍCULO SEGUNDO.- DOMICILIO.- El domicilio de la sociedad es en la Ciudad de ${data.ciudad}, ${data.estado}; sin embargo, podrá establecer locales, oficinas, sucursales, agencias y señalar domicilios convencionales en cualquier parte de la República Mexicana o en el extranjero, sin que se entienda por ello cambio de domicilio.</p>
        
        <p>ARTÍCULO TERCERO.- DURACIÓN.- La duración de la sociedad es ${data.duracion} a partir de la fecha de firma de esta escritura.</p>
        
        <p>ARTÍCULO CUARTO.- OBJETO.- La sociedad tendrá por objeto:</p>
        <p>1.- ${data.objetoSocial}</p>
        
        <p>En relación y para la consecución de dichos fines, la sociedad podrá realizar cualquiera de los siguientes actos:</p>
        <p>a) Adquirir, enajenar, arrendar, subarrendar o por cualquier título obtener la propiedad, uso, goce, disfrute, posesión, disposición, comercio, operación y gravamen, ya sea por cuenta propia o de terceros, de toda clase de bienes muebles o inmuebles o derechos reales o personales sobre los mismos, que sean necesarios para el logro de sus fines sociales.</p>
        <p>b) Formar parte como asociada o socia de otras asociaciones o sociedades.</p>
        <p>c) Fungir como representante, mandatario, apoderado o intermediario de cualquier persona física o moral, pública o privada, nacional o extranjera.</p>
        <p>d) Contratar trabajadores, empleados, prestadores de servicios o proveedores.</p>
        <p>e) Actuar como contratista, proveedor o prestador de servicios de los Gobiernos Federal, Estatales y Municipales; de instituciones, organizaciones, entidades o empresas públicas o privadas; y de personas físicas o morales.</p>
        <p>f) Participar en cualquier licitación, concurso o procedimiento para la adjudicación de contratos, bienes o servicios ante autoridades, dependencias, organismos, institutos o entidades Federales, Estatales o Municipales, así como personas físicas o morales.</p>
        <p>g) Adquirir directa o indirectamente la propiedad, titularidad, uso, aprovechamiento, disfrute, explotación o derechos respecto de concesiones, permisos, licencias, autorizaciones, subsidios o estímulos de cualquier naturaleza; o propiedad industrial o intelectual, conforme a las disposiciones legales aplicables.</p>
        <p>h) Obtener cualquier clase de préstamo o financiamiento.</p>
        <p>i) Contratar y celebrar convenios respecto de cuentas bancarias y de inversión, así como girar cheques en contra de las mismas.</p>
        <p>j) Importar, exportar, adquirir, comercializar o distribuir cualquier clase de bienes que se relacionen con los fines sociales.</p>
        <p>k) Emitir, suscribir, negociar y avalar títulos de crédito en operaciones relacionada con los fines sociales cualquier tipo operación a favor propio o de tercero.</p>
        <p>l) Obtener y otorgar préstamos, así como garantías reales o personales en relación con el objeto social / cualquier tipo operación a favor propio o de tercero.</p>
        <p>m) Establecer oficinas y sucursales en el país o en el extranjero para el cumplimiento del objeto social.</p>
        <p>n) Celebrar o realizar toda clase de actos, operaciones, contratos o convenios, cualquiera que sea su naturaleza, que sean permitidos por las leyes y sean necesarios para cumplir o realizar los fines sociales.</p>
        <p>ñ) Cualquier otra que sea necesaria para realizar el objeto social.</p>
        <p>o) Cualquier acto de comercio de manera legal, relacionado con su objeto social.</p>
        
        <p>ARTÍCULO QUINTO.- NACIONALIDAD.- La sociedad se constituye conforme a las leyes de los Estados Unidos Mexicanos, por lo que es de NACIONALIDAD MEXICANA.</p>
        
        <p>ARTÍCULO SEXTO.- CLAUSULA ADMISIÓN DE EXTRANJEROS.- La sociedad se constituye con cláusula de admisión de extranjeros, conforme a lo dispuesto en el artículo (15) quince de la Ley de Inversión Extranjera y en el artículo (14) catorce del Reglamento de la Ley de Inversión Extranjera y del Registro Nacional de Inversiones Extranjeras, por lo que los socios extranjeros actuales o futuros se obligan ante la Secretaría de Relaciones Exteriores a considerarse como nacionales respecto de:</p>
        <p>I. Las partes sociales o derechos que adquieran de la sociedad;</p>
        <p>II. Los bienes, derechos, concesiones, participaciones o intereses de los que sea titular la sociedad; y,</p>
        <p>III. Los derechos y obligaciones que deriven de los contratos en que sea parte la sociedad.</p>
        <p>Con motivo de lo anterior, los socios extranjeros de la sociedad, actuales o futuros, renuncian a invocar la protección de sus gobiernos, bajo la pena, en caso contrario, de perder en beneficio de la Nación Mexicana los derechos y bienes que hubiesen adquirido, en términos de lo establecido en el artículo (27) veintisiete, fracción (I) uno romano, de la Constitución Política de los Estados Unidos Mexicanos.</p>
        
        <h3>CAPITAL SOCIAL Y PARTES SOCIALES</h3>
        
        <p>ARTÍCULO SÉPTIMO. El capital social es variable. El capital mínimo fijo sin derecho a retiro es de $${data.capitalFijo}, el cual estará representado por partes sociales, nominativas, íntegramente suscritas y pagadas.</p>
        <p>La parte variable del capital social será ilimitada y se podrá aumentar o disminuir por retiro total o parcial de las aportaciones de los socios conforme a lo establecido en la Ley General de Sociedades Mercantiles y estos Estatutos.</p>
        <p>Cualquier aumento o disminución del capital se deberá registrar en el libro de registro correspondiente.</p>
        <p>Los aumentos en la parte mínima fija o en la parte variable del capital social se realizarán mediante resolución de la Asamblea de Socios.</p>
        <p>Las disminuciones en la parte mínima fija y en la parte variable del capital requerirán de resolución de la Asamblea de Socios. La sociedad podrá amortizar partes sociales con utilidades que legalmente se puedan destinar al pago de dividendos.</p>
        
        <p>ARTÍCULO OCTAVO. Los socios no podrán ser titulares de más de una parte social. En caso de adquisición total o parcial de una parte social o de aportaciones adicionales, la parte social se incrementará en la cantidad que corresponda, excepto cuando las partes sociales confieran distintos derechos, en cuyo caso las partes sociales se podrán mantener por separado.</p>
        
        <p>ARTÍCULO NOVENO. Los socios tendrán derecho de preferencia para realizar aportaciones con motivo del incremento del capital social, en la proporción que corresponda a sus partes sociales, el que se deberán ejercer dentro de los tres días naturales posteriores a la fecha de la asamblea en las que se apruebe el aumento, mediante comunicado escrito que se entregue al gerente de la sociedad. Las cantidades respecto de las cuales no se ejerza dicho derecho, se distribuirá proporcionalmente entre los socios que estén interesados en realizar las aportaciones correspondientes.</p>
        
        <p>ARTÍCULO DÉCIMO. Para que los socios puedan ceder sus partes sociales se requerirá el consentimiento de los socios que representen la mayoría del capital social. En ese supuesto, los otros socios tendrán el derecho del tanto para adquirir las partes sociales cuya cesión se autorice, el que deberán ejercer dentro de los quince días naturales siguientes a la fecha de la Asamblea en la que se haya otorgado la autorización respectiva.</p>
        <p>La transmisión de partes sociales por herencia no requerirá el consentimiento de los socios.</p>
        
        <h3>SOCIOS</h3>
        
        <p>ARTÍCULO DECIMO PRIMERO. Para ser admitido como socio se requerirá el consentimiento de los socios que representen la mayoría del capital social.</p>
        <p>ARTÍCULO DECIMO SEGUNDO. La sociedad llevará un Libro de Registro de Socios en el que se indicará el nombre, domicilio y aportaciones de cada socio, así como la transmisión de las partes sociales.</p>
        <p>ARTÍCULO DECIMO TERCERO. En virtud de que la sociedad se constituye bajo el régimen de responsabilidad limitada, cada socio responderá de las obligaciones sociales hasta por el monto de sus aportaciones al capital social.</p>
        <p>ARTÍCULO DECIMO CUARTO. Los socios tendrán los siguientes derechos:</p>
        <p>1. Concurrir a las Asambleas con derecho de voz y voto.</p>
        <p>2. Ser propuestos para ocupar cargos en la sociedad.</p>
        <p>3. Vigilar que las aportaciones y el patrimonio se destinen al cumplimiento de los objetos sociales.</p>
        <p>4. Los demás derechos previstos en estos estatutos.</p>
        <p>ARTÍCULO DECIMO QUINTO. Los socios tendrán las siguientes obligaciones:</p>
        <p>1. Respetar y hacer cumplir los estatutos de la sociedad, así como las normas y políticas que apruebe la Asamblea de Socios.</p>
        <p>2. Abstenerse de votar en la Asamblea respecto de cualquier asunto en el que tengan un interés en conflicto.</p>
        <p>3. Acatar y cumplir todas las resoluciones y acuerdos que adopte la Asamblea de Socios.</p>
        <p>4. Desempeñar con esmero, cuidado y diligencia los cargos, puestos o comisiones que le confiera la Asamblea de Socios.</p>
        <p>5. Las demás obligaciones previstas en estos estatutos.</p>
        
        <h3>ASAMBLEA DE SOCIOS</h3>
        
        <p>ARTÍCULO DECIMO SEXTO. La Asamblea de Socios es el órgano supremo de la sociedad; estará integrada únicamente por los socios que formen parte de la misma; y podrá acordar y ratificar todos los actos de la sociedad, y estará facultado para tocar todos los temas que se mencionan en el artículo 78 (setenta y ocho) de la Ley General de Sociedades Mercantiles.</p>
        <p>CADA SOCIO TENDRÁ DERECHO A PARTICIPAR EN LAS DECISIONES DE LAS ASAMBLEAS, GOZANDO DE UN VOTO POR CADA $1,000.00 (MIL PESOS 00/100 MONEDA NACIONAL) DE SU APORTACIÓN, COMO SE MENCIONA EN EL ARTÍCULO 79 (SETENTA Y NUEVE) DE LA LEY ANTES DICHA.</p>
        <p>ARTÍCULO DECIMO SEPTIMO. Las asambleas deberán celebrarse en el domicilio social, salvo caso fortuito o de fuerza mayor.</p>
        <p>ARTÍCULO DECIMO OCTAVO. Las convocatorias para las Asambleas Generales de Socios se realizarán por el Gerente o Consejo de Gerentes; por omisión de éste por el Comisario; en caso de incumplimiento de los primeros, por socios cuyas partes sociales representen más de la tercera parte del capital social; o por una autoridad jurisdiccional, conforme a lo establecido en la Ley.</p>
        <p>ARTÍCULO DECIMO NOVENO. Las convocatorias para las asambleas deberán ser firmadas por quien las haga y contendrán el orden del día, el lugar, fecha y hora de la reunión. No podrá tratarse asunto alguno que no esté incluido expresamente en ella, salvo los casos en que asistan o esté representada la totalidad de los socios y se acuerde por unanimidad de votos que se trate determinado asunto.</p>
        <p>Las convocatorias deberán publicarse conforme a lo establecido en la Ley General de Sociedades Mercantiles.</p>
        <p>ARTÍCULO VIGÉSIMO. Las Asambleas podrán reunirse sin previa convocatoria y sus acuerdos serán válidos si al momento de la votación están presentes la totalidad de socios.</p>
        <p>ARTÍCULO VIGÉSIMO PRIMERO. Los socios, bajo su responsabilidad, podrán ser representados en las asambleas por la persona o personas que designen mediante simple carta poder firmada ante dos testigos. Dichos poderes podrán ser generales; o bien, indicar en ellos las instrucciones necesarias para el ejercicio del derecho de voto.</p>
        <p>No podrán ser apoderados los empleados de la sociedad o los miembros de los órganos de administración o de vigilancia de la sociedad.</p>
        <p>ARTÍCULO VIGÉSIMO SEGUNDO. Para asistir a las asambleas los socios deberán estar inscritos en el Libro de Registro de Socios.</p>
        <p>ARTÍCULO VIGÉSIMO TERCERO. Las asambleas serán presididas por el Gerente o, en su ausencia, por el socio nombrado por mayoría de votos de los socios presentes. El Presidente nombrará un escrutador de entre los socios o representantes de socios presentes, quien formulará la lista de asistencia y certificará la presencia del quórum requerido en estos estatutos. Hecho lo anterior, el Presidente declarará instalada la asamblea y procederá a tratar los asuntos del orden del día.</p>
        <p>ARTÍCULO VIGÉSIMO CUARTO. Las decisiones en asamblea serán tomadas conforme a lo establecido en el artículo 77 (setenta y siete) de la mencionada Ley.</p>
        <p>ARTÍCULO VIGÉSIMO QUINTO. A solicitud de los socios que representen la tercera parte de partes sociales en que se divide el capital social, se podrá aplazar por el término de tres días y sin necesidad de nueva convocatoria, la votación de cualquier asunto respecto del cual los socios consideren que no cuentan con suficiente información o que sea necesario realizar previamente un determinado acto. Este aplazamiento sólo podrá realizarse por una sola vez para el mismo asunto.</p>
        <p>ARTÍCULO VIGÉSIMO SEXTO. Una vez que se declare instalada la asamblea, los socios no podrán abandonarla para evitar su celebración, salvo que se trate de asamblea reunida sin publicación de convocatoria. Los socios que se retiren o los que no concurran a la reanudación de una asamblea en el caso previsto en el artículo inmediato anterior, se entenderá que emiten su voto en el sentido de la mayoría de los presentes.</p>
        <p>ARTÍCULO VIGÉSIMO SEPTIMO. De cada Asamblea se elaborará el acta correspondiente, la que se asentará en el libro respectivo o se protocolizará ante fedatario público, y deberá contener: la fecha de su celebración; los nombres de los asistentes; el número de votos emitidos; los acuerdos que se tomen, que se consignarán a la letra; y, la firma de las personas que funjan como Presidente y Secretario de la misma.</p>
        <p>ARTÍCULO VIGÉSIMO OCTAVO. Los acuerdos tomados en contravención de estos estatutos serán nulos.</p>
        
        <h3>ADMINISTRACIÓN DE LA SOCIEDAD</h3>
        
        <p>ARTÍCULO VIGÉSIMO NOVENO. La administración de la sociedad estará a cargo de uno o más Gerentes, según determine la Asamblea de Socios.</p>
        <p>ARTÍCULO TRIGÉSIMO. El o los Gerentes podrán ser socios o personas extrañas a la sociedad y garantizarán el desempeño de sus funciones en la forma y términos que determine la Asamblea de Socios. Durarán en funciones hasta que sus sucesores sean designados y tomen posesión de sus cargos.</p>
        <p>ARTÍCULO TRIGÉSIMO PRIMERO. El o los Gerentes tendrán la representación legal de la sociedad y tendrá los poderes y facultades para PLEITOS Y COBRANZAS, ACTOS DE ADMINISTRACIÓN, PODER LABORAL, PODER GENERAL PARA ACTOS DE DOMINIO, PODER PARA SUSCRIBIR TÍTULOS Y OPERACIONES DE CRÉDITO, PODER CAMBIARIO, y FACULTADES PARA CONFERIR PODERES.</p>
        
        <h3>VIGILANCIA</h3>
        
        <p>ARTÍCULO TRIGÉSIMO SEGUNDO. La vigilancia de las operaciones sociales estará encomendada a uno o varios Comisarios, según determine la Asamblea de Socios, quienes podrán ser socios o personas ajenas a la sociedad.</p>
        <p>El o los Comisarios continuarán en el desempeño de sus funciones aun cuando hubiere concluido el plazo para el cual hayan sido designados, mientras no se hagan nuevos nombramientos y los designados no tomen posesión del cargo.</p>
        <p>ARTÍCULO TRIGÉSIMO TERCERO. No podrán ser nombradas ni desempeñar el cargo de Comisario las personas que sean cónyuges o tengan parentesco consanguíneo con el Gerente, en línea recta sin límite de grado o en colateral hasta el cuarto grado.</p>
        <p>ARTÍCULO TRIGÉSIMO CUARTO. El o los Comisarios tendrán las facultades y obligaciones necesarias para la vigilancia ilimitada todas las operaciones de la sociedad.</p>
        
        <h3>EJERCICIOS SOCIALES</h3>
        
        <p>ARTÍCULO TRIGÉSIMO QUINTO. Los ejercicios sociales serán de un año a partir del (1º) primero de enero y hasta el (31) treinta y uno de diciembre de cada año, excepción hecha del primer ejercicio que iniciará en la fecha de constitución de la sociedad.</p>
        
        <h3>DISOLUCIÓN Y LIQUIDACIÓN</h3>
        
        <p>ARTÍCULO TRIGÉSIMO SEXTO. La sociedad se disolverá por las siguientes causas:</p>
        <p>a) Por acuerdo de la Asamblea General de Socios;</p>
        <p>b) Por dejar de cumplir o por que se vuelva imposible el objeto social;</p>
        <p>c) Por resolución judicial definitiva e inapelable;</p>
        <p>d) Por haber concluido el plazo de duración; y,</p>
        <p>e) Por cualquier otra causa que establezcan las leyes.</p>
        <p>En caso de liquidación, la Asamblea General de Socios que haya acordado la disolución nombrará un liquidador. Si la liquidación tiene por causa la expiración del término fijado para la duración de la sociedad, se convocará a la Asamblea para que haga el nombramiento de liquidador.</p>
        <p>ARTÍCULO TRIGÉSIMO SEPTIMO. El liquidador tendrá las facultades que le conceda la Asamblea General de Socios que lo nombre, las que deberá ser suficientes para representar a la sociedad durante el proceso de liquidación, recuperar y realizar los activos, y liquidar los pasivos.</p>
        
        <h3>ARTÍCULOS TRANSITORIOS</h3>
        
        <p>Los socios reunidos en Asamblea General de Socios, aprueban por unanimidad las siguientes resoluciones:</p>
        <p>PRIMERO. La parte mínima fija del capital social se constituye por la cantidad de $${data.capitalFijo}, conforme a lo siguiente:</p>
        
        ${generateAportacionesPreview(data)}
        
        <p>Los comparecientes declaran, bajo formal protesta de decir verdad, que con anterioridad a la fecha de esta escritura pagaron en efectivo la totalidad de sus participaciones.</p>
        <p>SEGUNDO. Los socios acuerdan que la sociedad se administre por un GERENTE, y para ocupar ese cargo nombran a ${data.nombreGerente}, a quien se le otorgan los poderes y facultades que se establecen en el artículo trigésimo primero de los estatutos sociales, el cual se tiene por reproducido como si se insertase a la letra.</p>
        <p>Se exime al Gerente de la obligación de caucionar su gestión.</p>
        <p>TERCERO. Los socios acuerdan nombrar como APODERADO LEGAL a ${data.nombreApoderado}.</p>
        
        <h3>GENERALES</h3>
        
        <p>EL SEÑOR ${data.nombreApoderado}, quien dijo ser ${data.nacionalidadApoderado}, haber nacido en ${data.lugarNacimientoApoderado}, el día ${data.fechaNacimientoApoderado}, de estado civil ${data.estadoCivilApoderado}, de ocupación ${data.ocupacionApoderado} y con domicilio en ${data.domicilioApoderado}, quien se identificó credencial para votar con fotografía con clave de elector número ${data.claveElectorApoderado}.</p>
        
        <h3>EL SUSCRITO NOTARIO CERTIFICA:</h3>
        
        <p>1.- Que los otorgantes manifestaron que se reconocen su personalidad jurídica y que se identificaron legalmente ante el Suscrito Notario, con los documentos citados, los cuales en copia simple agrego al testimonio y al legajo apéndice, marcadas con la letra "C", quienes a mi juicio, son hábiles para contratar y obligarse.</p>
        <p>2.- Que los otorgantes ${data.sociosNombres}, en este acto me exhiben sus cédulas de identificación fiscal, expedida por el Servicio de Administración Tributaria de la Secretaria de Hacienda y Crédito Público, mismas que en copia fotostática agrego al testimonio y apéndice de este instrumento marcadas con las letras "D", por lo que me cercioré que el Registro Federal de Contribuyentes que en sus generales han declarado, concuerdan fiel y exactamente con las Cédulas de Identificación Fiscal.</p>
        <p>3.- Que manifestaron bajo protesta de decir verdad, estar al corriente en el cumplimiento de sus obligaciones legales, fiscales y tributarias sin haberlo acreditado al momento de la celebración del presente acto jurídico.</p>
        <p>4.- Que advertí a los comparecientes que deberán acreditarme dentro del plazo del mes siguiente a la fecha de firma de la presente escritura, haber presentado la solicitud de inscripción de la sociedad en el Registro Federal de Contribuyentes, y que en caso de no exhibirme dicha solicitud, procederé a dar el aviso correspondiente a las autoridades fiscales competentes.</p>
        <p>5.- Que leyeron la escritura por sí mismos y se les explicó el valor y las consecuencias legales del contenido de la misma.</p>
        <p>6.- Que les expliqué la necesidad de su inscripción en los registros correspondientes.</p>
        <p>7.- Que se manifestaron conformes con los términos de la escritura, ratificándola y firmándola ante el Suscrito Notario de todo lo cual DOY FE.</p>
        
        <p style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--gray-300);">
            <strong>FIRMAS:</strong><br><br>
            ${data.sociosNombres.split(', ').map(nombre => `
                _______________________________<br>
                ${nombre}<br><br>
            `).join('')}
            
            _______________________________<br>
            ${data.notario}<br>
            Notario Público
        </p>
    `;
}
