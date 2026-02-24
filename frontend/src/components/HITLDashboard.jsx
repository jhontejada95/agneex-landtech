import { useState } from 'react'
import './HITLDashboard.css'

const MOCK_ALERTS = [
    { id: 'EXP-001', predio: 'Lote 12-A – La Guajira', riesgo: 'ALTO', conflicto: 'Traslape de linderos detectado', confianzaIA: 61 },
    { id: 'EXP-002', predio: 'Folio 890-233 – César', riesgo: 'MEDIO', conflicto: 'Gravamen hipotecario sin levantar', confianzaIA: 74 },
    { id: 'EXP-003', predio: 'Matrícula 004-12345 – Córdoba', riesgo: 'ALTO', conflicto: 'Titular fallecido sin sucesión', confianzaIA: 55 },
]

const RISK_COLORS = {
    ALTO: '#ef4444',
    MEDIO: '#f59e0b',
    BAJO: '#10b981',
}

export default function HITLDashboard() {
    const [selected, setSelected] = useState(MOCK_ALERTS[0])
    const [status, setStatus] = useState(null) // 'approved' | 'rejected' | 'notarized'

    const handleAction = (action) => {
        setStatus(action)
    }

    return (
        <div className="hitl-root">
            {/* Header */}
            <div className="hitl-header">
                <div>
                    <h1 className="hitl-title">Panel de Revisión HITL</h1>
                    <p className="hitl-subtitle">Documentos con ambigüedad detectada por la IA que requieren validación experta</p>
                </div>
                <div className="hitl-stats">
                    <div className="stat-chip glass"><span>⚡</span> {MOCK_ALERTS.length} pendientes</div>
                </div>
            </div>

            {/* Alert Cards */}
            <div className="alerts-strip">
                {MOCK_ALERTS.map((alert) => (
                    <button
                        key={alert.id}
                        className={`alert-card glass ${selected.id === alert.id ? 'alert-active' : ''}`}
                        onClick={() => { setSelected(alert); setStatus(null) }}
                    >
                        <div className="alert-top">
                            <span className="alert-id">{alert.id}</span>
                            <span className="risk-badge" style={{ background: RISK_COLORS[alert.riesgo] + '22', color: RISK_COLORS[alert.riesgo] }}>
                                {alert.riesgo}
                            </span>
                        </div>
                        <p className="alert-predio">{alert.predio}</p>
                        <div className="ia-confidence">
                            <span>IA: {alert.confianzaIA}%</span>
                            <div className="confidence-bar">
                                <div className="confidence-fill" style={{ width: `${alert.confianzaIA}%`, background: RISK_COLORS[alert.riesgo] }} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Split View */}
            <div className="split-view">
                {/* Document Viewer */}
                <div className="doc-viewer glass">
                    <div className="panel-label">📄 Documento Original</div>
                    <div className="doc-mock">
                        <div className="doc-line doc-line--header" />
                        <div className="doc-line" />
                        <div className="doc-line doc-line--short" />
                        <div className="doc-line" />
                        <div className="doc-line" />
                        <div className="doc-line doc-line--highlight" />
                        <div className="doc-line" />
                        <div className="doc-line doc-line--short" />
                        <div className="doc-line" />
                        <div className="doc-line" />
                        <div className="doc-stamp" />
                    </div>
                    <p className="doc-filename">Folio_Matricula_{selected.id}.pdf</p>
                </div>

                {/* AI Analysis */}
                <div className="ai-panel glass">
                    <div className="panel-label">🤖 Análisis de la IA</div>

                    <div className="conflict-box">
                        <span className="conflict-icon">⚠️</span>
                        <div>
                            <p className="conflict-label">Conflicto Detectado</p>
                            <p className="conflict-desc">{selected.conflicto}</p>
                        </div>
                    </div>

                    <div className="ai-detail">
                        <div className="detail-row">
                            <span className="detail-key">Predio</span>
                            <span className="detail-val">{selected.predio}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Expediente</span>
                            <span className="detail-val">{selected.id}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Confianza IA</span>
                            <span className="detail-val" style={{ color: RISK_COLORS[selected.riesgo] }}>{selected.confianzaIA}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Nivel de Riesgo</span>
                            <span className="detail-val" style={{ color: RISK_COLORS[selected.riesgo] }}>{selected.riesgo}</span>
                        </div>
                    </div>

                    <p className="expert-label">Decisión del Experto</p>

                    {status && (
                        <div className={`status-banner status-${status}`}>
                            {status === 'approved' && '✅ Viabilidad Validada — pendiente de notarización'}
                            {status === 'rejected' && '❌ Expediente Rechazado y devuelto'}
                            {status === 'notarized' && '🔗 Hito registrado en Blockchain exitosamente'}
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="btn btn-reject" onClick={() => handleAction('rejected')} disabled={status === 'notarized'}>
                            Rechazar
                        </button>
                        <button className="btn btn-approve" onClick={() => handleAction('approved')} disabled={status === 'notarized'}>
                            ✅ Validar Viabilidad
                        </button>
                    </div>

                    <button
                        className={`btn btn-blockchain ${status === 'approved' ? 'glow-blue' : ''}`}
                        disabled={status !== 'approved'}
                        onClick={() => handleAction('notarized')}
                    >
                        🔗 Notarizar en Blockchain
                    </button>
                </div>
            </div>
        </div>
    )
}
