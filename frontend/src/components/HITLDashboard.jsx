import { useState, useEffect } from 'react'
import './HITLDashboard.css'

const RISK_COLORS = {
    ALTO: '#ef4444',
    MEDIO: '#f59e0b',
    BAJO: '#10b981',
}

export default function HITLDashboard() {
    const [alerts, setAlerts] = useState([])
    const [selected, setSelected] = useState(null)
    const [status, setStatus] = useState(null) // 'approved' | 'rejected' | 'notarized'
    const [isLoading, setIsLoading] = useState(true)
    const [notarizeLoading, setNotarizeLoading] = useState(false)
    const [blockchainData, setBlockchainData] = useState(null)

    const handleNotarize = async () => {
        if (!selected?.rawId) return;
        setNotarizeLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/v1/notarize/${selected.rawId}`, {
                method: 'POST'
            });
            const data = await res.json();
            if (res.ok) {
                setBlockchainData(data);
                setStatus('notarized');
            } else {
                throw new Error(data.detail || "Error en notarización");
            }
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            setNotarizeLoading(false);
        }
    }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/v1/expedientes')
            .then(res => res.json())
            .then(data => {
                const pendingAlerts = data
                    .filter(exp => exp.requires_human_review)
                    .map(exp => ({
                        id: `EXP-${String(exp.id).padStart(3, '0')}`,
                        rawId: exp.id,
                        predio: exp.entity_identified || exp.document_name,
                        riesgo: exp.severity === 'HIGH' ? 'ALTO' : exp.severity === 'MEDIUM' ? 'MEDIO' : 'BAJO',
                        conflicto: exp.description || exp.alert_type || 'Conflicto detectado',
                        confianzaIA: Math.round(exp.confidence_score * 100),
                        document_name: exp.document_name
                    }));
                setAlerts(pendingAlerts);
                if (pendingAlerts.length > 0) setSelected(pendingAlerts[0]);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

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
                    <div className="stat-chip glass"><span>⚡</span> {alerts.length} pendientes</div>
                </div>
            </div>

            {/* Alert Cards */}
            <div className="alerts-strip">
                {isLoading ? (
                    <div className="text-slate-400 p-4">Cargando expedientes desde Motor IA...</div>
                ) : alerts.length === 0 ? (
                    <div className="text-emerald-400 p-4">✅ No hay expedientes pendientes de revisión en la fila.</div>
                ) : (
                    alerts.map((alert) => (
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
                    ))
                )}
            </div>

            {/* Split View */}
            {selected && (
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
                        <p className="doc-filename">{selected.document_name}</p>
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
                                {status === 'notarized' && (
                                    <div className="flex flex-col items-center">
                                        <p>🔗 Hito registrado en Blockchain exitosamente</p>
                                        <a
                                            href={blockchainData?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs underline mt-1 hover:text-white"
                                        >
                                            Ver recibo en Arbiscan
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="action-buttons">
                            <button className="btn btn-reject" onClick={() => { setStatus('rejected'); setBlockchainData(null) }} disabled={status === 'notarized' || notarizeLoading}>
                                Rechazar
                            </button>
                            <button className="btn btn-approve" onClick={() => { setStatus('approved'); setBlockchainData(null) }} disabled={status === 'notarized' || notarizeLoading}>
                                ✅ Validar Viabilidad
                            </button>
                        </div>

                        <button
                            className={`btn btn-blockchain ${status === 'approved' ? 'glow-blue' : ''}`}
                            disabled={status !== 'approved' || notarizeLoading}
                            onClick={handleNotarize}
                        >
                            {notarizeLoading ? '⏳ Procesando en Arbitrum...' : '🔗 Notarizar en Blockchain'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
