# 🛰️ Workflow Agneex LandTech: Ecosistema Digital Twin & CAPEX

Este diagrama representa el flujo completo de la plataforma, desde la ingesta de documentos hasta la generación del Gemelo Digital y la certificación inmutable en la Blockchain de Arbitrum.

```mermaid
graph TD
    %% Entradas
    subgraph Ingesta["1. INGESTA Y ANALÍTICA (IA)"]
        A[Subida de Documentos] --> B{Motor OCR & Heurística}
        B -->|Extracción| C[Linderos y Entidades]
        B -->|Clasificación| D[Tipo de Documento]
    end

    %% Procesamiento Estratégico
    subgraph Analisis["2. ANÁLISIS DE VIABILIDAD ESTRATÉGICA"]
        C --> E[Cruce espacial GIS]
        E -->|Exclusiones| F{Validación UPME}
        F -->|LIBRE| G[Alta Viabilidad]
        F -->|INTERSECCIÓN| H[Riesgo de Capital]
        
        %% Integración BIM
        I[Planos Infraestructura BIM] --> J[Proyección sobre Terreno]
        J --> K{Cálculo CAPEX Score}
        G --> K
        H --> K
    end

    %% Capa de Datos e Inteligencia
    subgraph Inteligencia["3. INTELIGENCIA PREDIAL"]
        K --> L[Identificación de Patrones]
        L --> M[Detección Oportunidades ROI]
        M --> N[Generación Gemelo Digital]
    end

    %% Salidas y Transparencia
    subgraph Salidas["4. CERTIFICACIÓN Y ACCESO (WEB3)"]
        N --> O[Notarización en Arbitrum Sepolia]
        O --> P[Sello de Inmutabilidad]
        P --> Q[Dashboard de Consulta en Tiempo Real]
    end

    %% Colores y Estilos
    style A fill:#6366f1,stroke:#fff,color:#fff
    style N fill:#4f46e5,stroke:#fff,color:#fff
    style O fill:#10b981,stroke:#fff,color:#fff
    style H fill:#f59e0b,stroke:#fff,color:#fff
    style K fill:#8b5cf6,stroke:#fff,color:#fff
```

## 📋 Resumen de Etapas

1.  **Ingesta de IA**: Se procesan PDFs y textos para extraer el ADN legal del predio.
2.  **Viabilidad GIS/BIM**: Se cruza la ubicación física con la infraestructura proyectada (CAPEX) y las exclusiones del Estado (UPME).
3.  **Gemelo Digital**: Se crea una representación unificada que permite visualizar riesgos y oportunidades de inversión.
4.  **Certificación Web3**: Se guarda un hash inmutable en la blockchain, asegurando que la viabilidad del capital no pueda ser alterada.

---
> *Agneex: Claridad en el territorio, seguridad en la inversión.*
