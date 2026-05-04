// INSTRUCCIONES: 
// 1. Reemplazar la función generateArticulos() en app.js (líneas 652-714) con esta función completa
// 2. Esta función genera TODOS los artículos del documento original con los guiones y formato exacto

function generateArticulos(data) {
    const paragraphs = [];

    // ARTÍCULO PRIMERO
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `----- ARTÍCULO PRIMERO.- DENOMINACIÓN.- La sociedad se constituye bajo la denominación "${data.denominacion}", la que deberá ir seguida de las palabras "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE" o por su abreviatura "S. DE R.L. DE C.V."--`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    // ARTÍCULO SEGUNDO
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `------ ARTÍCULO SEGUNDO.- DOMICILIO.- El domicilio de la sociedad es en la Ciudad de ${data.ciudad}, ${data.estado}; sin embargo, podrá establecer locales, oficinas, sucursales, agencias y señalar domicilios convencionales en cualquier parte de la República Mexicana o en el extranjero, sin que se entienda por ello cambio de domicilio.---------------------------------------------------------------------------------------------------------------------`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    // ARTÍCULO TERCERO
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `----- ARTÍCULO TERCERO.- DURACIÓN.- La duración de la sociedad es ${data.duracion} a partir de la fecha de firma de esta escritura.--\t\t------------------------------------------------------------------------`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    // ARTÍCULO CUARTO
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `----- ARTÍCULO CUARTO.- OBJETO.- La sociedad tendrá por objeto:\t---------------------------------------------------`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `---- 1.- ${data.objetoSocial}`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `----- En relación y para la consecución de dichos fines, la sociedad podrá realizar cualquiera de los siguientes actos: \t\t------------------------------------------------------------------------`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    // Actividades a-o
    const actividades = [
        `----- a) Adquirir, enajenar, arrendar, subarrendar o por cualquier título obtener la propiedad, uso, goce, disfrute, posesión, disposición, comercio, operación y gravamen, ya sea por cuenta propia o de terceros, de toda clase de bienes muebles o inmuebles o derechos reales o personales sobre los mismos, que sean necesarios para el logro de sus fines sociales.\t\t------------------------------------------------------------------------`,
        `----- b) Formar parte como asociada o socia de otras asociaciones o sociedades.\t-------------------------------------`,
        `----- c) Fungir como representante, mandatario, apoderado o intermediario de cualquier persona física o moral, pública o privada, nacional o extranjera.\t\t------------------------------------------------------------------------`,
        `----- d) Contratar trabajadores, empleados, prestadores de servicios o proveedores.`,
        `----- e) Actuar como contratista, proveedor o prestador de servicios de los Gobiernos Federal, Estatales y Municipales; de instituciones, organizaciones, entidades o empresas públicas o privadas; y de personas físicas o morales.\t\t`,
        `----- f) Participar en cualquier licitación, concurso o procedimiento para la adjudicación de contratos, bienes o servicios ante autoridades, dependencias, organismos, institutos o entidades Federales, Estatales o Municipales, así como personas físicas o morales.\t\t`,
        `----- g) Adquirir directa o indirectamente la propiedad, titularidad, uso, aprovechamiento, disfrute, explotación o derechos respecto de concesiones, permisos, licencias, autorizaciones, subsidios o estímulos de cualquier naturaleza; o propiedad industrial o intelectual, conforme a las disposiciones legales aplicables.`,
        `----- h) Obtener cualquier clase de préstamo o financiamiento.`,
        `----- i) Contratar y celebrar convenios respecto de cuentas bancarias y de inversión, así como girar cheques en contra de las mismas.\t\t`,
        `----- j) Importar, exportar, adquirir, comercializar o distribuir cualquier clase de bienes que se relacionen con los fines sociales.\t\t`,
        `----- k) Emitir, suscribir, negociar y avalar títulos de crédito en operaciones relacionada con los fines sociales  cualquier tipo operación a favor propio o de tercero.\t\t`,
        `----- l) Obtener y otorgar préstamos, así como garantías reales o personales en relación con el objeto social / cualquier tipo operación a favor propio o de tercero.\t\t`,
        `----- m) Establecer  oficinas y sucursales en el país o en el extranjero para el cumplimiento del objeto social.`,
        `----- n) Celebrar o realizar toda clase de actos, operaciones, contratos o convenios, cualquiera que sea su naturaleza, que sean permitidos por las leyes y sean necesarios para cumplir o realizar los fines sociales.`,
        `----- ñ) Cualquier otra que sea necesaria para realizar el objeto social.`,
        `---- o) Cualquier acto de comercio de manera legal, relacionado con su objeto social.-`
    ];

    actividades.forEach(actividad => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: actividad, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // ARTÍCULO QUINTO
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `----- ARTÍCULO QUINTO.- NACIONALIDAD.- La sociedad se constituye conforme a las leyes de los Estados Unidos Mexicanos, por lo que es de NACIONALIDAD MEXICANA.`,
                    size: 22,
                }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    // ARTÍCULO SEXTO
    const articuloSexto = [
        `----- ARTÍCULO SEXTO.- CLAUSULA ADMISIÓN DE EXTRANJEROS.- La sociedad se constituye con cláusula de admisión de extranjeros, conforme a lo dispuesto en el artículo (15) quince de la Ley de Inversión Extranjera y en el artículo (14) catorce del Reglamento de la Ley de Inversión Extranjera y del Registro Nacional de Inversiones Extranjeras, por lo que los socios extranjeros actuales o futuros se obligan ante la Secretaría de Relaciones Exteriores a considerarse como nacionales respecto de:`,
        `----- I. Las partes sociales o derechos que adquieran de la sociedad;`,
        `----- II. Los bienes, derechos, concesiones, participaciones o intereses de los que sea titular la sociedad; y,`,
        `----- III. Los derechos y obligaciones que deriven de los contratos en que sea parte la sociedad.`,
        `----- Con motivo de lo anterior, los socios extranjeros de la sociedad, actuales o futuros, renuncian a invocar la protección de sus gobiernos, bajo la pena, en caso contrario, de perder en beneficio de la Nación Mexicana los derechos y bienes que hubiesen adquirido, en términos de lo establecido en el artículo (27) veintisiete, fracción (I) uno romano, de la Constitución Política de los Estados Unidos Mexicanos.`
    ];

    articuloSexto.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // Sección CAPITAL SOCIAL Y PARTES SOCIALES
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\tCAPITAL SOCIAL Y PARTES SOCIALES\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    // ARTÍCULOS SÉPTIMO al DÉCIMO
    const articulosCapital = [
        `----- ARTÍCULO SÉPTIMO. El capital social es variable. El capital mínimo fijo sin derecho a retiro es de $ ${data.capitalFijo}, el cual estará representado por partes sociales, nominativas, íntegramente suscritas y pagadas.\t\t`,
        `----- La parte variable del capital social será ilimitada y se podrá aumentar o disminuir por retiro total o parcial de las aportaciones de los socios conforme a lo establecido en la Ley General de Sociedades Mercantiles y estos Estatutos.\t\t`,
        `----- Cualquier aumento o disminución del capital se deberá registrar en el libro de registro correspondiente.`,
        `----- Los aumentos en la parte mínima fija o en la parte variable del capital social se realizarán mediante resolución de la Asamblea de Socios.\t\t`,
        `----- Las disminuciones en la parte mínima fija y en la parte variable del capital requerirán de resolución de la Asamblea de Socios. La sociedad podrá amortizar partes sociales con utilidades que legalmente se puedan destinar al pago de dividendos.\t\t`,
        `----- ARTÍCULO OCTAVO. Los socios no podrán ser titulares de más de una parte social. En caso de adquisición total o parcial de una parte social o de aportaciones adicionales, la parte social se incrementará en la cantidad que corresponda, excepto cuando las partes sociales confieran distintos derechos, en cuyo caso las partes sociales se podrán mantener por separado.`,
        `----- ARTÍCULO NOVENO. Los socios tendrán derecho de preferencia para realizar aportaciones con motivo del incremento del capital social, en la proporción que corresponda a sus partes sociales, el que se deberán ejercer dentro de los tres días naturales posteriores a la fecha de la asamblea en las que se apruebe el aumento, mediante comunicado escrito que se entregue al gerente de la sociedad. Las cantidades respecto de las cuales no se ejerza dicho derecho, se distribuirá proporcionalmente entre los socios que estén interesados en realizar las aportaciones correspondientes.`,
        `----- ARTÍCULO DÉCIMO. Para que los socios puedan ceder sus partes sociales se requerirá el consentimiento de los socios que representen la mayoría del capital social. En ese supuesto, los otros socios tendrán el derecho del tanto para adquirir las partes sociales cuya cesión se autorice, el que deberán ejercer dentro de los quince días naturales siguientes a la fecha de la Asamblea en la que se haya otorgado la autorización respectiva.\t\t`,
        `----- La transmisión de partes sociales por herencia no requerirá el consentimiento de los socios.`
    ];

    articulosCapital.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // Sección SOCIOS
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\tSOCIOS\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    const articulosSocios = [
        `----- ARTÍCULO DECIMO PRIMERO. Para ser admitido como socio se requerirá el consentimiento de los socios que representen la mayoría del capital social.\t\t`,
        `----- ARTÍCULO DECIMO SEGUNDO. La sociedad llevará un Libro de Registro de Socios en el que se indicará el nombre, domicilio y aportaciones de cada socio, así como la transmisión de las partes sociales.`,
        `----- ARTÍCULO DECIMO TERCERO. En virtud de que la sociedad se constituye bajo el régimen de responsabilidad limitada, cada socio responderá de las obligaciones sociales hasta por el monto de sus aportaciones al capital social.\t\t`,
        `----- ARTÍCULO DECIMO CUARTO. Los socios tendrán los siguientes derechos:`,
        `----- 1. Concurrir a las Asambleas con derecho de voz y voto.`,
        `----- 2. Ser propuestos para ocupar cargos en la sociedad.`,
        `----- 3. Vigilar que las aportaciones y el patrimonio se destinen al cumplimiento de los objetos sociales.`,
        `----- 4. Los demás derechos previstos en estos estatutos.`,
        `----- ARTÍCULO DECIMO QUINTO. Los socios tendrán las siguientes obligaciones:`,
        `----- 1. Respetar y hacer cumplir los estatutos de la sociedad, así como las normas y políticas que apruebe la Asamblea de Socios.\t\t`,
        `----- 2. Abstenerse de votar en la Asamblea respecto de cualquier asunto en el que tengan un interés en conflicto.\t\t`,
        `----- 3. Acatar y cumplir todas las resoluciones y acuerdos que adopte la Asamblea de Socios.`,
        `----- 4. Desempeñar con esmero, cuidado y diligencia los cargos, puestos o comisiones que le confiera la Asamblea de Socios.\t\t`,
        `----- 5. Las demás obligaciones previstas en estos estatutos.`
    ];

    articulosSocios.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // Sección ASAMBLEA DE SOCIOS
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\tASAMBLEA DE SOCIOS\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    const articulosAsamblea = [
        `----- ARTÍCULO DECIMO SEXTO. La Asamblea de Socios es el órgano supremo de la sociedad; estará integrada únicamente por los socios que formen parte de la misma; y podrá acordar y ratificar todos los actos de la sociedad, y estará facultado para tocar todos los temas que se mencionan en el artículo 78 (setenta y ocho)  de la Ley General de Sociedades Mercantiles.`,
        `----- CADA SOCIO TENDRÁ DERECHO A PARTICIPAR EN LAS DECISIONES DE LAS ASAMBLEAS, GOZANDO DE UN VOTO POR CADA $1,000.00 (MIL PESOS 00/100 MONEDA NACIONAL) DE SU APORTACIÓN, COMO SE MENCIONA EN EL ARTÍCULO 79 (SETENTA Y NUEVE) DE LA LEY ANTES DICHA.\t\t`,
        `----- ARTÍCULO DECIMO SEPTIMO. Las asambleas deberán celebrarse en el domicilio social, salvo caso fortuito o de fuerza mayor.\t\t`,
        `----- ARTÍCULO DECIMO OCTAVO. Las convocatorias para las Asambleas Generales de Socios se realizarán por el Gerente o Consejo de Gerentes; por omisión de éste por el Comisario; en caso de incumplimiento de los primeros, por socios cuyas partes sociales representen más de la tercera parte del capital social; o por una autoridad jurisdiccional, conforme a lo establecido en la Ley.`,
        `----- ARTÍCULO DECIMO NOVENO. Las convocatorias para las asambleas deberán ser firmadas por quien las haga y contendrán el orden del día, el lugar, fecha y hora de la reunión. No podrá tratarse asunto alguno que no esté incluido expresamente en ella, salvo los casos en que asistan o esté representada la totalidad de los socios y se acuerde por unanimidad de votos que se trate determinado asunto.`,
        `Las convocatorias deberán publicarse conforme a lo establecido en la Ley General de Sociedades Mercantiles.\t\t`,
        `----- ARTÍCULO VIGÉSIMO. Las Asambleas podrán reunirse sin previa convocatoria y sus acuerdos serán válidos si al momento de la votación están presentes la totalidad de socios.`,
        `----- ARTÍCULO VIGÉSIMO PRIMERO. Los socios, bajo su responsabilidad, podrán ser representados en las asambleas por la persona o personas que designen mediante simple carta poder firmada ante dos testigos. Dichos poderes podrán ser generales; o bien, indicar en ellos las instrucciones necesarias para el ejercicio del derecho de voto.\t\t`,
        `----- No podrán ser apoderados los empleados de la sociedad o los miembros de los órganos de administración o de vigilancia de la sociedad.\t\t`,
        `----- ARTÍCULO VIGÉSIMO SEGUNDO. Para asistir a las asambleas los socios deberán estar inscritos en el Libro de Registro de Socios.\t\t`,
        `----- ARTÍCULO VIGÉSIMO TERCERO. Las asambleas serán presididas por el Gerente o, en su ausencia, por el socio nombrado por mayoría de votos de los socios presentes. El Presidente nombrará un escrutador de entre los socios o representantes de socios presentes, quien formulará la lista de asistencia y certificará la presencia del quórum requerido en estos estatutos. Hecho lo anterior, el Presidente declarará instalada la asamblea y procederá a tratar los asuntos del orden del día.`,
        `----- ARTÍCULO VIGÉSIMO CUARTO. Las decisiones en asamblea serán tomadas conforme a lo establecido en el artículo 77 (setenta y siete) de la mencionada Ley.-`,
        `----- ARTÍCULO VIGÉSIMO QUINTO. A solicitud de los socios que representen la tercera parte de partes sociales en que se divide el capital social, se podrá aplazar por el término de tres días y sin necesidad de nueva convocatoria, la votación de cualquier asunto respecto del cual los socios consideren que no cuentan con suficiente información o que sea necesario realizar previamente un determinado acto. Este aplazamiento sólo podrá realizarse por una sola vez para el mismo asunto.`,
        `----- ARTÍCULO VIGÉSIMO SEXTO. Una vez que se declare instalada la asamblea, los socios no podrán abandonarla para evitar su celebración, salvo que se trate de asamblea reunida sin publicación de convocatoria. Los socios que se retiren o los que no concurran a la reanudación de una asamblea en el caso previsto en el artículo inmediato anterior, se entenderá que emiten su voto en el sentido de la mayoría de los presentes.\t\t`,
        `----- ARTÍCULO VIGÉSIMO SEPTIMO. De cada Asamblea se elaborará el acta correspondiente, la que se asentará en el libro respectivo o se protocolizará ante fedatario público, y deberá contener: la fecha de su celebración; los nombres de los asistentes; el número de votos emitidos; los acuerdos que se tomen, que se consignarán a la letra; y, la firma de las personas que funjan como Presidente y Secretario de la misma.`,
        `----- ARTÍCULO VIGÉSIMO OCTAVO. Los acuerdos tomados en contravención de estos estatutos serán nulos.\t----------------------------------------------------------------------------------------------------------------------------------------`
    ];

    articulosAsamblea.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // Sección ADMINISTRACIÓN
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\tADMINISTRACIÓN DE LA SOCIEDAD\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    const articulosAdministracion = [
        `----- ARTÍCULO VIGÉSIMO NOVENO. La administración de la sociedad estará a cargo de uno o más Gerentes, según determine la Asamblea de Socios.\t\t`,
        `----- ARTÍCULO TRIGÉSIMO. El o los Gerentes podrán ser socios o personas extrañas a la sociedad y garantizarán el desempeño de sus funciones en la forma y términos que determine la Asamblea de Socios. Durarán en funciones hasta que sus sucesores sean designados y tomen posesión de sus cargos.`,
        `----- ARTÍCULO TRIGÉSIMO PRIMERO. El o los Gerentes tendrán la representación legal de la sociedad y, de manera enunciativa y no limitativa, tendrá los poderes y facultades siguientes:`
    ];

    articulosAdministracion.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // PODERES DETALLADOS (A-I)
    const poderes = [
        `----- A).- PODER GENERAL PARA PLEITOS Y COBRANZAS.- Representar a la sociedad ante toda clase de personas físicas y morales y ante toda clase de autoridades ya sean estas Administrativas, Judiciales, Militares, Fiscales, del trabajo o de cualquier otra índole, ya fueren Federal, Estatal, Municipal y del Distrito Federal, con todas las facultades generales  PARA PLEITOS Y COBRANZAS, y aún las especiales que requieran poder o cláusula especial conforme a cualquier ley, sin limitación alguna con facultades para interponer cualquier recurso, en toda clase de juicios tanto en lo principal, como en sus incidentes, aún el extraordinario de amparo, directo o indirecto y desistirse de él, presentar querellas o denuncias, ratificarlas y desistirse de ellas, y constituirse en parte civil cuando proceda la reparación del daño, en los términos del Primer Párrafo del Artículo 2,554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal; Su correlativo el  2,831 (dos mil ochocientos treinta y uno) del Código Civil vigente en el Estado de Sonora, y de los concordantes de ambos preceptos de los mismos ordenamientos de los diversos Estados de la República Mexicana, incluyéndose también las facultades enumeradas por los Artículos 2587 (dos mil quinientos ochenta y siete) del primero de dichos Códigos, 2868 (dos mil ochocientos sesenta y ocho) del segundo y los concordantes de los terceros.- En forma enunciativa y no limitativa el podrá:  I.- Promover y desistirse de toda clase de acciones, recursos, juicios y procedimientos aún el de amparo.- II.- Transigir.- III.- Articular y absolver posiciones.- IV.- Comprometer en árbitros.- V.- Recusar.- VI.- Recibir pagos y recibir cesión de bienes.- VII.- Firmar todo tipo de contratos o convenios.- VIII.- Formular y ratificar denuncias y querellas del Orden Penal y desistirse de ellas, otorgar el perdón en su caso y constituirse en coadyuvante del Ministerio Público.- IX.- Interponer juicios de amparo y desistirse de ellos.- X.- Gestionar por conducto de las Autoridades correspondientes la reparación del daño provenientes de delitos; intervenir en los procedimientos respectivos y otorgar el perdón cuando lo estime conveniente.- XI.- Exigir a nombre de la Sociedad el cumplimiento de las obligaciones contraídas por terceros.- XII.- Ejercitar el poder ante la Secretaría del Trabajo y Previsión Social, ante el Instituto Mexicano del Seguro Social, SECRETARIA DE HACIENDA Y CRÉDITO PUBLICO y ante toda clase de TRIBUNALES JUDICIALES FEDERALES O ESTATALES; XIII.- Promover remates, como postor, realizar pujas, mejorar posturas, pedir la adjudicación de bienes, comparecer o participar en toda clase de concursos o licitaciones y realizar cualquier acto y en cualquier juicio o procedimiento, actuando en nombre y representación de la sociedad.-----------------------------`,
        `----- El apoderado o apoderados podrán firmar todo tipo de contratos o convenios o cualquier otro documento que fuere necesario y podrán participar en cualquier licitación municipal, estatal o federal o por el sistema de Compranet, en asuntos relacionados con la presente sociedad.-----------------------------------------`,
        `----- B).- PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN.- Administrar los bienes y dirigir los negocios de la Sociedad, actuando como apoderado GENERAL PARA ACTOS DE ADMINISTRACIÓN en términos de lo dispuesto por el II (segundo) párrafo del Artículo 2,831 (dos mil ochocientos treinta y uno) del Código Civil vigente en el Estado de Sonora;  II (segundo) párrafo del Artículo 2,554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal y sus correlativos, los Códigos Civiles de los Estados de la República Mexicana.- En general, tendrá facultades para realizar cualquier acto de administración sea cual fuere su nombre, por lo que representará a la Sociedad ante toda clase de personas, autoridades, organismos, Instituciones de Crédito, Organismo Descentralizados, empresas de participación estatal, etcétera.- Podrá nombrar y remover libremente a los funcionarios y empleados de la Sociedad, otorgarles y modificarles facultades, fijar emolumentos, podrá establecer oficinas, departamentos, sucursales y agencias de la sociedad, así como suprimirlas y movilizarlas.- Proponer a la Asamblea de accionistas las resoluciones a que juzguen pertinentes y provechosas para los fines de la sociedad.- Ejercitar la dirección, manejo y control de los asuntos de la sociedad y de todas sus propiedades, celebrando y vigilando el cumplimiento de toda clase de actos, convenios y contratos que fueren necesarios.--------------------------------------`,
        `------ EL PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN COMPRENDE FACULTADES PARA QUE PUEDA LLEVAR TRAMITES FISCALES O ADMINISTRATIVOS QUE FUERAN NECESARIOS ANTE LA SECRETARIA DE HACIENDA Y CRÉDITO PÚBLICO, ANTE EL SERVICIO DE ADMINISTRACIÓN TRIBUTARIA (SAT), DAR DE ALTA A LA PERSONA MORAL, SOLICITAR LA FIRMA ELECTRÓNICA AVANZADA (FIEL), SOLICITAR DEVOLUCIONES DE IVA Y OTRAS QUE FUEREN NECESARIO, ANTE EL INSTITUTO MEXICANO DEL SEGURO SOCIAL Y/O CUALQUIERA OTRA DEPENDENCIA QUE FUERE NECESARIA.---------------------------------------------------------------------------`,
        `----- C).- PODER LABORAL Podrá ser ejercitado ante las autoridades del trabajo y servicios sociales que se señalan en el Artículo 523 (quinientos veintitrés) de la Ley Federal del Trabajo, así como ante las juntas locales y federales de conciliación y arbitraje; confiriéndose a los profesionistas mencionados las facultades más amplias que en derecho procedan para intervenir en representación de la sociedad en la totalidad del proceso conciliatorio y en la totalidad del proceso de juicio instituido bajo el modelo anterior a la reforma laboral publicada el 01 de mayo de 2019 en todas sus etapas, a la audiencia prevista por el artículo 873 de la ley federal del trabajo de conciliación, demanda y excepciones, a la audiencia prevista por el artículo 880 de ofrecimiento y admisión de pruebas, así como a todas y cada una de las diligencias, desahogos y etapas del juicio laboral anterior a la reforma mencionada; así mismo, se confiere a los profesionistas mencionados las más amplias facultades para que intervengan en representación de la sociedad en la totalidad del proceso conciliatorio ante los centros de conciliación, locales y federales, así como a la totalidad del proceso de juicio instituido bajo el nuevo modelo derivado de la reforma laboral publicada en el diario oficial de la federación el 01 de mayo de 2019, a fin de que representen a la sociedad tanto en la audiencia preliminar prevista por los artículos 873-E,873-F y 873-G de la ley federal del trabajo, así como a la audiencia de juicio prevista por los artículos 873-H, 873-I, 873-J, 873-K y demás relativos y aplicables, con amplias facultades para realizar defensas y excepciones, presentar replicas, contrarréplicas, ofrecer y desahogar pruebas, proponer y absolver posiciones, promover cualquier tipo de acción, excepción, defensa, aclaración, incidente, recurso, recusación,  proponer arreglos conciliatorios, para tomar decisiones y para suscribir convenios en términos del invocado dispositivo legal; así también podrán señalar domicilios para recibir notificaciones en términos de lo dispuesto por el Artículo 739 (setecientos treinta y nueve) de la Ley Federal del Trabajo. Poder General para llevar a cabo actos de rescisión en términos de los dispuesto por los Artículos 46 (cuarenta y seis) y 47 (cuarenta y siete) de la Ley Federal del Trabajo.----------------------------------`,
        `----- D).- PODER GENERAL.- Podrán llevar a cabo actos de rescisión en términos de lo dispuesto por los Artículos 46 y 47 (cuarenta y seis y cuarenta y siete) de la Ley Federal del Trabajo.----------------------------------`,
        `----- E).- PODER GENERAL PARA ACTOS DE DOMINIO en los más amplios términos del párrafo Tercero del Artículo 2,831 (dos mil ochocientos treinta y uno) del Código Civil vigente en el Estado de Sonora y sus correlativos el 2,554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal y sus correlativos y concordantes de los Códigos Civiles de los Estados de la República Mexicana, actos como vender, gravar, pignorar, hipotecar, ceder, donar, dar en prenda, fianza, etcétera, los bienes de la Sociedad.- Celebrar cualquier acto de riguroso dominio.---------------\t\t`,
        `----- F).- PODER PARA SUSCRIBIR TÍTULOS Y OPERACIONES DE CRÉDITO.- Podrá Realizar y celebrar cualquier tipo de actos, contratos y operaciones de créditos, pero en asuntos estrictamente relacionados con la Sociedad, tales como librar, aceptar, suscribir, girar, avalar, endosar, descontar, títulos de crédito etcétera, incluyendo cheques, en términos del Artículo 9 (Noveno) de la Ley General de Títulos y de Operaciones de Créditos.--------------------------------------------------------------------`,
        `----- G).- PODER CAMBIARIO.- Para ejercerse en toda la extensión de la república mexicana y en el extranjero, pero tan amplio como en derecho sea necesario, para emitir, aceptar, girar, librar, endosar, certificar, descontar, efectuar y realizar en cualquier forma de suscripción, títulos y operaciones de crédito, títulos valor con o sin garantía e instrumentos de pago, así como todo tipo de convenios, contratos, negocios, actos jurídicos y operaciones que estén relacionadas directa o indirectamente con los mismos, en los términos más amplios que establecen los artículos 9º. (noveno), fracción i (primera), párrafo final, 85 (ochenta y cinco), 174 (ciento setenta y cuatro) y 196 (ciento noventa y seis) de la ley general de títulos y operaciones de crédito; afianzar, coafianzar, y en general garantizar en nombre de la sociedad poderdante en forma individual, solidaria, subsidiaria o mancomunada, según corresponda a los intereses de la sociedad poderdante, con o sin contraprestación, incluso con prenda, hipoteca, fideicomiso o bajo cualquier otra forma de garantía permitida por la ley, obligaciones a cargo de la sociedad poderdante, pudiendo por lo tanto suscribir títulos de crédito, convenios, contratos y demás documentos que fueren necesarios o convenientes para el otorgamiento de dichas garantías; se incluyen las facultades de abrir  y firmar cuentas de cheques en las instituciones bancarias, de disponer de sus fondos y las de cancelación de las mismas, en su caso, así como para que autorice a terceras personas a realizar los actos dentro de los que al propio administrador único o al consejo de administración en su caso, se le otorgan y confieren, de depósito en otras instituciones u organizaciones auxiliares de crédito y, de obligar a la sociedad mandante, en cualquier forma que legalmente estime necesaria dentro de las operaciones propias de sus autorizaciones, y en forma enunciativa y no limitativa podrá además realizar toda clase de operaciones con instituciones de crédito, nacionales y extranjeras, con intermediarios del mercado de valores, organizaciones auxiliares del crédito, sociedades de inversión, casas de bolsa, para disponer o depositar fondos, títulos de crédito o títulos de valor, desde luego dentro de las atribuciones que por este instrumento le otorga el órgano supremo de la sociedad.-----------------------------------------------------------------------------------`,
        `----- H).- FACULTADES PARA CONFERIR PODERES generales o especiales, mandatos judiciales o facultades administrativas, y revocar en cualquier tiempo tales poderes; así como para sustituir o delegar en cualquier persona, sean o no accionistas, las facultades que le son conferidas, reservándose su ejercicio. ---`,
        `----- I).- Llevar a cabo todos los actos, operaciones y negocios de la Sociedad y celebrar todos los contratos y convenios y suscribir toda clase de documentos y escrituras que considere convenientes para el mejor desarrollo del objeto social.-----------------------------------------------------`
    ];

    poderes.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // Sección VIGILANCIA
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\t\tVIGILANCIA\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    const articulosVigilancia = [
        `----- ARTÍCULO TRIGÉSIMO SEGUNDO. La vigilancia de las operaciones sociales estará encomendada a uno o varios Comisarios, según determine la Asamblea de Socios, quienes podrán ser socios o personas ajenas a la sociedad.\t\t`,
        `----- El o los Comisarios continuarán en el desempeño de sus funciones aun cuando hubiere concluido el plazo para el cual hayan sido designados, mientras no se hagan nuevos nombramientos y los designados no tomen posesión del cargo.\t\t`,
        `----- ARTÍCULO TRIGÉSIMO TERCERO. No podrán ser nombradas ni desempeñar el cargo de Comisario las personas que sean cónyuges o tengan parentesco consanguíneo con el Gerente, en línea recta sin límite de grado o en colateral hasta el cuarto grado.\t\t`,
        `----- ARTÍCULO TRIGÉSIMO CUARTO. El o los Comisarios tendrán las facultades y obligaciones necesarias para la vigilancia ilimitada todas las operaciones de la sociedad.`
    ];

    articulosVigilancia.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    // Sección EJERCICIOS SOCIALES
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\tEJERCICIOS SOCIALES\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [new TextRun({
                text: `----- ARTÍCULO TRIGÉSIMO QUINTO. Los ejercicios sociales serán de un año a partir del (1º) primero de enero y hasta el (31) treinta y uno de diciembre de cada año, excepción hecha del primer ejercicio que iniciará en la fecha de constitución de la sociedad.\t\t`,
                size: 22
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        })
    );

    // Sección DISOLUCIÓN Y LIQUIDACIÓN
    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: '\tDISOLUCIÓN Y LIQUIDACIÓN\t', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
        })
    );

    const articulosDisolucion = [
        `----- ARTÍCULO TRIGÉSIMO  SEXTO. La sociedad se disolverá por las siguientes causas:`,
        `----- a) Por acuerdo de la Asamblea General de Socios;`,
        `----- b) Por dejar de cumplir o por que se vuelva imposible el objeto social;`,
        `----- c) Por resolución judicial definitiva e inapelable;\t\t`,
        `----- d) Por haber concluido el plazo de duración; y,\t\t`,
        `----- e) Por cualquier otra causa que establezcan las leyes.`,
        `----- En caso de liquidación, la Asamblea General de Socios que haya acordado la disolución nombrará un liquidador. Si la liquidación tiene por causa la expiración del término fijado para la duración de la sociedad, se convocará a la Asamblea para que haga el nombramiento de liquidador.`,
        `----- ARTÍCULO TRIGÉSIMO SEPTIMO. El liquidador tendrá las facultades que le conceda la Asamblea General de Socios que lo nombre, las que deberá ser suficientes para representar a la sociedad durante el proceso de liquidación, recuperar y realizar los activos, y liquidar los pasivos.`
    ];

    articulosDisolucion.forEach(texto => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: texto, size: 22 })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
            })
        );
    });

    return paragraphs;
}
