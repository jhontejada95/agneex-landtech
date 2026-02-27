export const LEGAL_CATEGORIES = [
    { id: 'folio_analysis', label: 'Análisis de Folio de Matrícula' },
    { id: 'gravamenes_id', label: 'Identificación de Gravámenes' },
    { id: 'riesgos_juridicos', label: 'Evaluación de Riesgos Jurídicos' },
    { id: 'titularidad_val', label: 'Validación de Titularidad' },
    { id: 'inconsistencias_doc', label: 'Detección de Inconsistencias' }
];

export const UPME_CATEGORIES = [
    { id: 'estudio_titulos', label: 'Estudio de Títulos' },
    { id: 'cadena_tradicion', label: 'Cadena de Tradición' },
    { id: 'gravamenes_upme', label: 'Gravámenes (UPME)' },
    { id: 'linderos_areas', label: 'Linderos y Áreas' },
    { id: 'afectaciones_ambientales', label: 'Afectaciones Ambientales' },
    { id: 'exclusiones_upme', label: 'Zonas de Exclusión' },
    { id: 'servidumbres', label: 'Servidumbres' },
    { id: 'restricciones_uso', label: 'Uso del Suelo (POT)' },
    { id: 'procesos_judiciales', label: 'Procesos Judiciales' },
    { id: 'posesiones_terceros', label: 'Posesiones' },
    { id: 'infraestructura_existente', label: 'Redes / Infraestructura' },
    { id: 'documentacion_soporte', label: 'Documentación Soporte' }
];

export const UPME_CATEGORIES_LABELS = {
    // Diagnóstico Jurídico
    'folio_analysis': 'Analísis de Folio',
    'gravamenes_id': 'Identificación de Gravámenes',
    'riesgos_juridicos': 'Evaluación de Riesgos',
    'titularidad_val': 'Validación de Titularidad',
    'inconsistencias_doc': 'Inconsistencias Documentales',

    // Gestión Predial UPME
    'estudio_titulos': 'Estudio de Títulos (UPME)',
    'cadena_tradicion': 'Cadena de Tradición (UPME)',
    'gravamenes_upme': 'Gravámenes (UPME)',
    'linderos_areas': 'Linderos y Áreas',
    'afectaciones_ambientales': 'Afectaciones Ambientales',
    'exclusiones_upme': 'Zonas de Exclusión',
    'servidumbres': 'Servidumbres',
    'restricciones_uso': 'Restricciones de Uso (POT)',
    'procesos_judiciales': 'Procesos Judiciales',
    'posesiones_terceros': 'Posesiones',
    'infraestructura_existente': 'Redes / Infraestructura',
    'documentacion_soporte': 'Documentación Soporte'
};

export const API_BASE_URL = 'http://127.0.0.1:8000';
