# CASOS DE USO Y TESTEO: VIABILIDAD CAPEX AGNEEX

Este documento define 3 casos críticos para probar la robustez del motor de análisis de Agneex, simulando documentos reales y evaluando la respuesta del sistema.

---

## 🟢 Caso 1: Viabilidad Óptima (Bajo Riesgo)
- **Documento**: `PROYECTO_SOLAR_VALLE.pdf`
- **Contenido**: Escritura Pública de compraventa con linderos georreferenciados claros.
- **Contexto**: Terreno rural plano, sin traslape con áreas protegidas.
- **Resultado Esperado**:
    - **Confidence Score**: > 90%
    - **UPME Status**: LIBRE_DE_EXCLUSION
    - **CAPEX Score**: > 0.95
    - **Opportunity Tag**: ALTA_VIABILIDAD_ROI
- **Objetivo**: Verificar que el sistema premia la claridad documental y la ausencia de riesgos territoriales.

---

## 🟡 Caso 2: Incertidumbre por Ambigüedad (HITL Necesario)
- **Documento**: `EXPANSION_INDUSTRIAL_NORTE.pdf`
- **Contenido**: Acto administrativo con descripción de linderos mediante puntos naturales ("hasta la piedra grande", "siguiendo el cauce").
- **Contexto**: Zona industrial legítima pero con cartografía antigua.
- **Resultado Esperado**:
    - **Confidence Score**: 60% - 70%
    - **UPME Status**: PENDING
    - **CAPEX Score**: ~0.70
    - **Opportunity Tag**: REVISION_ESTRATEGICA
    - **Alerta**: Requiere revisión humana para precisar el área del Gemelo Digital.
- **Objetivo**: Testear la capacidad de la IA para detectar descripciones vagas que ponen en riesgo la precisión del CAPEX.

---

## 🔴 Caso 3: Inviabilidad por Conflicto Territorial (Pérdida de Capital)
- **Documento**: `MINA_RESERVA_ANDINA.pdf`
- **Contenido**: Título minero o documento de propiedad en zona de alta montaña.
- **Contexto**: El predio se encuentra 100% dentro de una zona de exclusión de la UPME (Ley 685).
- **Resultado Esperado**:
    - **Confidence Score**: 85% (Documento bien redactado)
    - **UPME Status**: INTERSECCION_DETECTADA
    - **CAPEX Score**: < 0.20
    - **Opportunity Tag**: ALTA_FRICCION_LEGAL / RIESGO_ESTRUCTURAL
- **Objetivo**: Demostrar que incluso con documentos legales "perfectos", la viabilidad del capital es nula si hay colisión territorial.

---

## 🚀 Instrucciones para Pruebas
1. Sube los archivos generados en `backend/test_docs/`.
2. Observa el cálculo del **Capex Score** en el dashboard.
3. Abre el **Gemelo Digital** para ver la proyección BIM/GIS.
4. Verifica que la notarización en Web3 incluya el estado de viabilidad correcto.
