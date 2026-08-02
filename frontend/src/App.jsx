import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { animate, stagger } from 'animejs';
import {
  AlertTriangle, Cpu, RefreshCw, ChevronLeft, ChevronRight,
  Play, Activity, ShieldCheck, Database, Terminal, Sparkles,
  Search, X, ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/logs';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [jumpValue, setJumpValue] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedWarnKey, setDismissedWarnKey] = useState(null);

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const aiCardRef = useRef(null);
  const metricsRef = useRef(null);

  // Initial load entrance animations — animejs v4: animate(targets, params)
  useEffect(() => {
    if (headerRef.current) {
      animate(headerRef.current, {
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 900,
        easing: 'easeOutExpo'
      });
    }

    if (metricsRef.current) {
      animate(metricsRef.current.children, {
        translateY: [24, 0],
        opacity: [0, 1],
        delay: stagger(110, { start: 250 }),
        duration: 700,
        easing: 'easeOutExpo'
      });
    }
  }, []);

  // Staggered log row animation on data change
  useEffect(() => {
    if (logs.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('.log-row');
      if (rows.length) {
        animate(rows, {
          translateX: [-18, 0],
          opacity: [0, 1],
          delay: stagger(55),
          easing: 'easeOutCubic',
          duration: 450
        });
      }
    }
  }, [logs]);

  // Cyber scan-line animation while AI diagnosis runs
  useEffect(() => {
    let scanAnimation;
    if (loadingAi && aiCardRef.current) {
      const scanLine = aiCardRef.current.querySelector('.scan-line');
      if (scanLine) {
        scanAnimation = animate(scanLine, {
          top: ['0%', '100%'],
          opacity: [0.9, 0.15],
          easing: 'easeInOutSine',
          duration: 1600,
          direction: 'alternate',
          loop: true
        });
      }
    }
    return () => {
      if (scanAnimation && scanAnimation.pause) scanAnimation.pause();
    };
  }, [loadingAi]);

  const fetchLogs = async (currentPage = 0, size = pageSize) => {
    setLoadingLogs(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/paged?page=${currentPage}&size=${size}`);
      setLogs(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setPage(currentPage);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchAiSummary = async () => {
    setLoadingAi(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/ai-summary`);
      setAiSummary(response.data.summary || response.data);
    } catch (err) {
      setAiSummary('Failed to generate AI diagnosis. Ensure backend is active.');
    } finally {
      setLoadingAi(false);
    }
  };

  const triggerError = async (e) => {
    animate(e.currentTarget, {
      scale: [1, 0.92, 1.05, 1],
      duration: 450,
      easing: 'easeOutElastic(1, .5)'
    });

    try {
      await axios.get(`${API_BASE_URL}/test-error`);
    } catch (err) {
      fetchLogs(0);
    }
  };

  useEffect(() => {
    fetchLogs(0);
  }, []);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    fetchLogs(0, newSize);
  };

  const handleJump = () => {
    const target = parseInt(jumpValue, 10);
    if (!Number.isNaN(target) && target >= 1 && target <= totalPages) {
      fetchLogs(target - 1);
    }
    setJumpValue('');
  };

  // Minimal markdown-to-React renderer: handles **bold** spans and blank-line
  // separated paragraphs, which is all the Groq summary format actually uses.
  const renderMarkdown = (text) => {
    if (!text) return null;
    return String(text)
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph, pIdx) => {
        const parts = paragraph.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return (
          <p key={pIdx} style={{ margin: pIdx === 0 ? '0 0 0.9rem 0' : '0.9rem 0' }}>
            {parts.map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i} style={{ color: '#f4f6fa' }}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        );
      });
  };

  const getBadgeStyle = (level) => {
    switch (level?.toUpperCase()) {
      case 'ERROR':
        return { background: 'rgba(248, 81, 73, 0.14)', color: '#ff8b82', border: '1px solid rgba(248, 81, 73, 0.35)', boxShadow: '0 0 12px rgba(248, 81, 73, 0.18)' };
      case 'WARN':
        return { background: 'rgba(240, 165, 0, 0.14)', color: '#ffc457', border: '1px solid rgba(240, 165, 0, 0.35)', boxShadow: '0 0 12px rgba(240, 165, 0, 0.18)' };
      default:
        return { background: 'rgba(45, 212, 191, 0.14)', color: '#5eead4', border: '1px solid rgba(45, 212, 191, 0.35)', boxShadow: '0 0 12px rgba(45, 212, 191, 0.16)' };
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  // Filtering + sorting operate on the currently loaded page of logs — the
  // backend endpoint only paginates, so this narrows what's visible per page
  // rather than querying across the full dataset.
  const displayedLogs = useMemo(() => {
    let result = [...logs];

    if (filterLevel !== 'ALL') {
      result = result.filter((l) => l.level?.toUpperCase() === filterLevel);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((l) =>
        l.message?.toLowerCase().includes(q) || l.serviceName?.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      const dir = sortDir === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (sortField === 'timestamp') {
          return (new Date(a.timestamp) - new Date(b.timestamp)) * dir;
        }
        const av = (a[sortField] || '').toString().toLowerCase();
        const bv = (b[sortField] || '').toString().toLowerCase();
        return av.localeCompare(bv) * dir;
      });
    }

    return result;
  }, [logs, filterLevel, searchQuery, sortField, sortDir]);

  // Most recent WARN-level entry on the current page, surfaced as a banner
  // unless the person has already dismissed that exact log.
  const activeWarning = useMemo(() => {
    const warn = logs.find((l) => l.level?.toUpperCase() === 'WARN');
    if (!warn) return null;
    const key = `${warn.id ?? warn.timestamp}`;
    return key === dismissedWarnKey ? null : { ...warn, key };
  }, [logs, dismissedWarnKey]);

  return (
    <div style={{
      fontFamily: "'Söhne', 'Inter', system-ui, -apple-system, sans-serif",
      backgroundColor: '#08090d',
      backgroundImage:
        'radial-gradient(circle at 12% -10%, rgba(94, 234, 212, 0.07) 0%, transparent 55%),' +
        'radial-gradient(circle at 100% 0%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),' +
        'linear-gradient(180deg, #08090d 0%, #0b0d13 100%)',
      minHeight: '100vh',
      color: '#eef1f6',
      padding: '2.5rem 3.25rem',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseWarn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(240, 165, 0, 0.35); }
          50% { box-shadow: 0 0 0 6px rgba(240, 165, 0, 0); }
        }
        .spin { animation: spin 1s linear infinite; }
        ::selection { background: rgba(94, 234, 212, 0.25); }
        button { font-family: inherit; }
        button:focus-visible { outline: 2px solid #5eead4; outline-offset: 2px; }
        button:hover { filter: brightness(1.08); }
        @media (prefers-reduced-motion: reduce) {
          .spin { animation: none; }
        }
      `}</style>

      {/* Header */}
      <header ref={headerRef} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: '1.4rem', opacity: 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0d9488, #6366f1)',
              padding: '0.55rem', borderRadius: '11px', display: 'flex',
              boxShadow: '0 0 24px rgba(94, 234, 212, 0.25)'
            }}>
              <Cpu size={24} color="#fff" />
            </div>
            <h1 style={{
              fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em',
              background: 'linear-gradient(to right, #ffffff, #9aa5b5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Telemetry &amp; AI Log Analyzer
            </h1>
          </div>
          <p style={{ color: '#66707f', margin: '0.4rem 0 0 0', fontSize: '0.85rem', letterSpacing: '0.01em' }}>
            Spring AOP Exception Interception · PostgreSQL · Groq LLM Diagnostics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button
            onClick={triggerError}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #9f1239)',
              color: '#fff', border: 'none', padding: '0.65rem 1.3rem', borderRadius: '9px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 0 18px rgba(225, 29, 72, 0.28)',
              transition: 'filter 0.15s ease'
            }}>
            <Play size={16} /> Trigger Test Error
          </button>

          <button
            onClick={() => fetchLogs(page)}
            style={{
              background: 'rgba(30, 35, 46, 0.75)', color: '#9aa5b5',
              border: '1px solid rgba(255,255,255,0.09)', padding: '0.65rem 1.3rem',
              borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: '0.5rem', fontSize: '0.85rem', backdropFilter: 'blur(8px)',
              transition: 'filter 0.15s ease'
            }}>
            <RefreshCw size={16} className={loadingLogs ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </header>

      {/* Active WARN-level alert banner */}
      {activeWarning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.9rem',
          background: 'linear-gradient(135deg, rgba(240,165,0,0.14), rgba(240,165,0,0.05))',
          border: '1px solid rgba(240, 165, 0, 0.4)', borderRadius: '13px',
          padding: '0.9rem 1.2rem', marginBottom: '1.5rem',
          boxShadow: '0 0 22px rgba(240, 165, 0, 0.12)'
        }}>
          <div style={{
            width: '2.2rem', height: '2.2rem', borderRadius: '50%',
            background: 'rgba(240, 165, 0, 0.18)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            animation: 'pulseWarn 1.8s ease-in-out infinite'
          }}>
            <AlertTriangle size={18} color="#ffc457" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', color: '#ffc457', textTransform: 'uppercase' }}>
              Active Warning · {activeWarning.serviceName || 'System'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#f4f6fa', marginTop: '0.15rem' }}>
              {activeWarning.message}
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#66707f', flexShrink: 0 }}>
            {new Date(activeWarning.timestamp).toLocaleTimeString()}
          </span>
          <button
            onClick={() => setDismissedWarnKey(activeWarning.key)}
            aria-label="Dismiss warning"
            style={{
              background: 'transparent', border: 'none', color: '#66707f',
              cursor: 'pointer', padding: '0.3rem', display: 'flex', flexShrink: 0
            }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics */}
      <div ref={metricsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.85rem' }}>
        <div style={cardStyle}>
          <Activity color="#5eead4" size={24} />
          <div>
            <div style={labelStyle}>Total Ingested Telemetry</div>
            <div style={valueStyle}>{totalElements.toLocaleString()} Logs</div>
          </div>
        </div>

        <div style={cardStyle}>
          <Database color="#a78bfa" size={24} />
          <div>
            <div style={labelStyle}>Persistence Layer</div>
            <div style={valueStyle}>PostgreSQL 16 Engine</div>
          </div>
        </div>

        <div style={cardStyle}>
          <ShieldCheck color="#4ade80" size={24} />
          <div>
            <div style={labelStyle}>AOP Interceptor Status</div>
            <div style={{ ...valueStyle, color: '#4ade80' }}>Active &amp; Guarding</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.5rem' }}>

        {/* Log table */}
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3rem' }}>
            <h2 style={panelTitleStyle}>
              <Terminal size={18} color="#5eead4" /> Live System Telemetry Stream
            </h2>
            <span style={{
              fontSize: '0.75rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)',
              padding: '0.2rem 0.65rem', borderRadius: '20px', border: '1px solid rgba(74, 222, 128, 0.2)'
            }}>
              ● LIVE FEED
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 220px' }}>
              <Search size={14} color="#66707f" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search message or service…"
                style={searchInputStyle}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#66707f', cursor: 'pointer', display: 'flex' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  style={filterChipStyle(filterLevel === lvl, lvl)}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <table ref={tableRef} style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.4rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#66707f', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={sortableThStyle} onClick={() => toggleSort('timestamp')}>
                  <span style={thInnerStyle}>Timestamp {sortIcon('timestamp')}</span>
                </th>
                <th style={sortableThStyle} onClick={() => toggleSort('level')}>
                  <span style={thInnerStyle}>Severity {sortIcon('level')}</span>
                </th>
                <th style={sortableThStyle} onClick={() => toggleSort('serviceName')}>
                  <span style={thInnerStyle}>Service {sortIcon('serviceName')}</span>
                </th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Message Payload</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.length > 0 ? (
                displayedLogs.map((log) => {
                  const isWarn = log.level?.toUpperCase() === 'WARN';
                  return (
                    <tr key={log.id} className="log-row" style={{
                      backgroundColor: isWarn ? 'rgba(240, 165, 0, 0.07)' : 'rgba(30, 35, 46, 0.45)',
                      borderRadius: '8px', fontSize: '0.825rem', opacity: 0,
                      borderLeft: isWarn ? '2px solid rgba(240, 165, 0, 0.5)' : '2px solid transparent'
                    }}>
                      <td style={{ padding: '0.75rem 0.8rem', color: '#9aa5b5', borderRadius: '8px 0 0 8px' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: '0.75rem 0.8rem' }}>
                        <span style={{ ...getBadgeStyle(log.level), padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.7rem' }}>
                          {log.level}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, color: '#c7cedb' }}>{log.serviceName || 'System'}</td>
                      <td style={{
                        padding: '0.75rem 0.8rem', color: '#e2e8f0', borderRadius: '0 8px 8px 0',
                        maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {log.message}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#66707f' }}>
                    {logs.length > 0 ? 'No logs match the current filter' : 'No telemetry records returned'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
            gap: '0.75rem', marginTop: '1.3rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#66707f', fontSize: '0.8rem' }}>
                Page <strong style={{ color: '#eef1f6' }}>{page + 1}</strong> of <strong style={{ color: '#eef1f6' }}>{totalPages || 1}</strong>
              </span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#66707f', fontSize: '0.78rem' }}>
                Rows
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  style={selectStyle}>
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#66707f', fontSize: '0.78rem' }}>
                Go to
                <input
                  type="number"
                  min={1}
                  max={totalPages || 1}
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                  placeholder={String(page + 1)}
                  style={jumpInputStyle}
                />
                <button onClick={handleJump} style={goBtnStyle}>Go</button>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page === 0}
                onClick={() => fetchLogs(page - 1)}
                style={pageBtnStyle(page === 0)}>
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => fetchLogs(page + 1)}
                style={pageBtnStyle(page >= totalPages - 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* AI diagnosis panel */}
        <div ref={aiCardRef} style={{ ...panelStyle, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="scan-line" style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #5eead4, transparent)',
            opacity: 0, pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3rem' }}>
            <h2 style={{ ...panelTitleStyle, color: '#f0a500' }}>
              <Sparkles size={20} color="#f0a500" /> Groq AI Diagnosis
            </h2>
            <button
              onClick={fetchAiSummary}
              style={{
                background: 'linear-gradient(135deg, #4338ca, #3730a3)', color: '#fff', border: 'none',
                padding: '0.5rem 1rem', borderRadius: '9px', cursor: 'pointer', fontSize: '0.8rem',
                fontWeight: 600, boxShadow: '0 0 18px rgba(67, 56, 202, 0.3)', transition: 'filter 0.15s ease'
              }}>
              {loadingAi ? 'Scanning…' : 'Run Diagnosis'}
            </button>
          </div>

          <div style={{
            flex: 1, backgroundColor: 'rgba(6, 7, 11, 0.85)', borderRadius: '11px', padding: '1.3rem',
            border: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', fontSize: '0.825rem',
            lineHeight: 1.65, color: '#c7cedb'
          }}>
            {loadingAi ? (
              <div style={{ color: '#5eead4', textAlign: 'center', padding: '3rem 1rem' }}>
                <Sparkles size={28} className="spin" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
                Streaming recent exception telemetry to Groq Llama-3…
              </div>
            ) : aiSummary ? (
              <div>{renderMarkdown(aiSummary)}</div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#4c5566' }}>
                <AlertTriangle size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5, display: 'block' }} />
                Click <strong>"Run Diagnosis"</strong> to trigger Groq LLM root-cause analysis on active telemetry.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'rgba(15, 17, 23, 0.65)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '13px', padding: '1.05rem 1.3rem', display: 'flex', alignItems: 'center',
  gap: '1rem', backdropFilter: 'blur(14px)', opacity: 0
};

const labelStyle = { color: '#66707f', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' };
const valueStyle = { fontSize: '1.35rem', fontWeight: 700, color: '#f4f6fa', marginTop: '0.15rem' };

const panelStyle = {
  backgroundColor: 'rgba(15, 17, 23, 0.65)', borderRadius: '15px', padding: '1.6rem',
  border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(14px)',
  boxShadow: '0 24px 48px rgba(0,0,0,0.45)'
};

const panelTitleStyle = {
  fontSize: '1.1rem', margin: 0, fontWeight: 700, display: 'flex',
  alignItems: 'center', gap: '0.5rem', color: '#e2e8f0'
};

const pageBtnStyle = (disabled) => ({
  background: 'rgba(30, 35, 46, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.09)',
  padding: '0.4rem 0.8rem', borderRadius: '7px', cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.3 : 1, transition: 'filter 0.15s ease'
});

const selectStyle = {
  background: 'rgba(30, 35, 46, 0.8)', color: '#eef1f6', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.78rem', cursor: 'pointer'
};

const jumpInputStyle = {
  width: '3.2rem', background: 'rgba(30, 35, 46, 0.8)', color: '#eef1f6',
  border: '1px solid rgba(255,255,255,0.09)', borderRadius: '6px', padding: '0.25rem 0.5rem',
  fontSize: '0.78rem'
};

const goBtnStyle = {
  background: 'rgba(45, 212, 191, 0.14)', color: '#5eead4', border: '1px solid rgba(45, 212, 191, 0.35)',
  borderRadius: '6px', padding: '0.25rem 0.65rem', fontSize: '0.78rem', cursor: 'pointer',
  fontWeight: 600, transition: 'filter 0.15s ease'
};

const searchInputStyle = {
  width: '100%', background: 'rgba(30, 35, 46, 0.7)', color: '#eef1f6',
  border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px',
  padding: '0.5rem 2rem 0.5rem 2.1rem', fontSize: '0.82rem', boxSizing: 'border-box'
};

const levelAccent = {
  ALL: '#5eead4', INFO: '#5eead4', WARN: '#ffc457', ERROR: '#ff8b82'
};

const filterChipStyle = (active, lvl) => ({
  background: active ? `${levelAccent[lvl]}22` : 'rgba(30, 35, 46, 0.7)',
  color: active ? levelAccent[lvl] : '#66707f',
  border: `1px solid ${active ? `${levelAccent[lvl]}55` : 'rgba(255,255,255,0.09)'}`,
  borderRadius: '7px', padding: '0.5rem 0.75rem', fontSize: '0.72rem', fontWeight: 700,
  letterSpacing: '0.03em', cursor: 'pointer', transition: 'filter 0.15s ease'
});

const sortableThStyle = { padding: '0.6rem 0.8rem', cursor: 'pointer', userSelect: 'none' };
const thInnerStyle = { display: 'inline-flex', alignItems: 'center', gap: '0.3rem' };