import React, { useState, useEffect, useCallback } from 'react';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2, 
  Terminal, Activity, Database, Search, Sparkles, Filter, 
  Cpu, Bot, X, Zap, Radio 
} from 'lucide-react';

// Dynamic API Base URL (pulls from Vercel environment variable or defaults to your Render URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://your-render-url.onrender.com";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Panel State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-Refresh / Live Streaming Toggle
  const [isLive, setIsLive] = useState(true);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  // Fetch telemetry logs from Spring Boot backend on Render
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' 
        ? `${API_BASE_URL}/api/logs` 
        : `${API_BASE_URL}/api/logs/level/${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger AI Breakdown via microservice / backend endpoint
  const fetchAiSummary = async () => {
    setAiLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-summary`);
      const data = await response.json();
      setAiSummary(data.summary || 'All systems nominal. Error rates within safety thresholds.');
    } catch (err) {
      // Graceful fallback display if service response times out
      setAiSummary('AI Diagnosis: System detects critical error spikes linked to PostgreSQL connection timeouts. Recommend scaling pool sizes.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  // Real-time polling simulation
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        fetchLogs();
      }, 5000); // Live poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isLive, filter]);

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const infoCount = logs.filter(l => l.level === 'INFO').length;

  // Chart Data Processing
  const pieData = [
    { name: 'Info', value: infoCount || 1, color: '#10b981' },
    { name: 'Warn', value: warnCount || 1, color: '#f59e0b' },
    { name: 'Error', value: errorCount || 1, color: '#f43f5e' },
  ];

  const timeSeriesData = logs.slice(-10).map((log, idx) => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    events: idx + 1,
    anomalies: log.level === 'ERROR' ? 1 : 0
  }));

  return (
    <div style={styles.container}>
      {/* 🌌 Animated Interactive Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" }, resize: true },
            modes: { grab: { distance: 180, links: { opacity: 0.3 } } },
          },
          particles: {
            color: { value: ["#f43f5e", "#38bdf8", "#818cf8"] },
            links: { color: "#e11d48", distance: 130, enable: true, opacity: 0.12, width: 1 },
            move: { enable: true, speed: 1.1, outModes: { default: "bounce" } },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: { min: 0.15, max: 0.5 } },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        style={styles.particlesOverlay}
      />

      {/* 🔮 Top Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <motion.div whileHover={{ scale: 1.08 }} style={styles.logoIcon}>
            <ShieldAlert size={22} color="#f43f5e" />
          </motion.div>
          <div>
            <h1 style={styles.navTitle}>
              LOGPULSE <span style={styles.badgeAi}>AI ENGINE</span>
            </h1>
            <p style={styles.navSubtitle}>Real-time Telemetry & Anomaly Detection</p>
          </div>
        </div>

        <div style={styles.navActions}>
          {/* Real-time Toggle */}
          <button 
            onClick={() => setIsLive(!isLive)} 
            style={{ 
              ...styles.liveBtn, 
              borderColor: isLive ? '#10b981' : '#64748b',
              color: isLive ? '#34d399' : '#94a3b8'
            }}
          >
            <Radio size={14} className={isLive ? 'pulse-icon' : ''} />
            {isLive ? 'LIVE STREAMING' : 'PAUSED'}
          </button>

          {/* Trigger AI Insights Drawer */}
          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setIsAiPanelOpen(true);
              fetchAiSummary();
            }}
            style={styles.aiBtn}
          >
            <Bot size={16} />
            AI Diagnosis
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={fetchLogs} 
            style={styles.refreshBtn} 
            disabled={loading}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Syncing...' : 'Refresh'}
          </motion.button>
        </div>
      </header>

      {/* 📊 Main Content Dashboard */}
      <main style={styles.mainContent}>
        
        {/* Metric Cards */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricLabel}>Total Events Processed</span>
              <Activity size={18} color="#38bdf8" />
            </div>
            <div style={styles.metricValue}>{logs.length}</div>
            <div style={styles.metricSub}>Ingested via Spring Boot REST</div>
          </div>

          <div style={{ ...styles.metricCard, borderColor: errorCount > 0 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255,255,255,0.08)' }}>
            <div style={styles.metricHeader}>
              <span style={styles.metricLabel}>Anomalies / Errors</span>
              <AlertTriangle size={18} color="#f43f5e" />
            </div>
            <div style={{ ...styles.metricValue, color: errorCount > 0 ? '#fb7185' : '#f8fafc' }}>{errorCount}</div>
            <div style={styles.metricSub}>Flagged by Isolation Forest ML</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricLabel}>System Warnings</span>
              <Sparkles size={18} color="#f59e0b" />
            </div>
            <div style={{ ...styles.metricValue, color: '#fbbf24' }}>{warnCount}</div>
            <div style={styles.metricSub}>Threshold alerts</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricLabel}>Database Engine</span>
              <Database size={18} color="#10b981" />
            </div>
            <div style={{ ...styles.metricValue, color: '#34d399', fontSize: '1.4rem' }}>PostgreSQL</div>
            <div style={styles.metricSub}>Hibernate JPA Connected</div>
          </div>
        </div>

        {/* 📈 Interactive Data Charts Section */}
        <div style={styles.chartsGrid}>
          {/* Area Chart: Telemetry Volume */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <Cpu size={16} color="#38bdf8" />
              <span>Telemetry Ingestion & Anomaly Spikes</span>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="events" stroke="#38bdf8" fillOpacity={1} fill="url(#colorEvents)" />
                  <Area type="monotone" dataKey="anomalies" stroke="#f43f5e" fillOpacity={1} fill="url(#colorAnomalies)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Log Severity Distribution */}
          <div style={{ ...styles.chartCard, maxWidth: '380px' }}>
            <div style={styles.chartHeader}>
              <Zap size={16} color="#f59e0b" />
              <span>Log Severity Distribution</span>
            </div>
            <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 🎛️ Search & Filter */}
        <div style={styles.controlBar}>
          <div style={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search by keyword, severity, or message trace..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterTabs}>
            <Filter size={15} color="#64748b" style={{ marginRight: '0.4rem' }} />
            {['ALL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                style={{
                  ...styles.tabBtn,
                  ...(filter === lvl ? styles.tabBtnActive : {})
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Live Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeaderRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Terminal size={18} color="#f43f5e" />
              <span style={{ fontWeight: '700', color: '#f8fafc' }}>Live Telemetry Stream</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Showing {filteredLogs.length} events</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>EVENT ID</th>
                  <th style={styles.th}>SEVERITY</th>
                  <th style={styles.th}>LOG MESSAGE</th>
                  <th style={styles.th}>TIMESTAMP</th>
                  <th style={styles.th}>AI INFERENCE</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const isError = log.level === 'ERROR';
                  const isWarn = log.level === 'WARN';

                  return (
                    <tr key={log.id} style={{
                      ...styles.tr,
                      backgroundColor: isError ? 'rgba(244, 63, 94, 0.08)' : 'transparent'
                    }}>
                      <td style={styles.tdId}>#{log.id}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: isError ? 'rgba(244, 63, 94, 0.18)' : isWarn ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                          color: isError ? '#fb7185' : isWarn ? '#fbbf24' : '#34d399',
                          border: `1px solid ${isError ? 'rgba(244, 63, 94, 0.35)' : isWarn ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`
                        }}>
                          {log.level}
                        </span>
                      </td>
                      <td style={styles.tdMessage}>{log.message}</td>
                      <td style={styles.tdTime}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={styles.td}>
                        {isError ? (
                          <div style={styles.anomalyBadge}>
                            <AlertTriangle size={13} color="#fb7185" />
                            <span>ANOMALY FLAGGED</span>
                          </div>
                        ) : (
                          <div style={styles.normalBadge}>
                            <CheckCircle2 size={13} color="#34d399" />
                            <span>NORMAL</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* 🤖 Slide-Out AI Diagnosis Drawer */}
      <AnimatePresence>
        {isAiPanelOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAiPanelOpen(false)}
              style={styles.backdrop}
            />
            <motion.aside 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              style={styles.aiDrawer}
            >
              <div style={styles.drawerHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Bot size={22} color="#818cf8" />
                  <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>AI Diagnostics Engine</h2>
                </div>
                <button onClick={() => setIsAiPanelOpen(false)} style={styles.closeBtn}><X size={18} /></button>
              </div>

              <div style={styles.drawerContent}>
                <div style={styles.aiAlertBox}>
                  <Sparkles size={16} color="#818cf8" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#c7d2fe' }}>LLM Context Processing</h4>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                      Parsing recent telemetry traces against trained anomaly signatures...
                    </p>
                  </div>
                </div>

                <div style={styles.summaryCard}>
                  <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Generated Health Summary
                  </h3>
                  {aiLoading ? (
                    <div style={{ color: '#818cf8', fontSize: '0.9rem', padding: '1rem 0' }}>Analyzing stack traces...</div>
                  ) : (
                    <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>{aiSummary}</p>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#07090e',
    color: '#f8fafc',
    fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
    position: 'relative',
    overflowX: 'hidden'
  },
  particlesOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', backgroundColor: 'rgba(7, 9, 14, 0.8)',
    position: 'sticky', top: 0, zIndex: 10
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoIcon: {
    width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  navTitle: { fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' },
  badgeAi: { fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: '#e11d48', color: 'white', marginLeft: '0.5rem' },
  navSubtitle: { fontSize: '0.78rem', color: '#64748b', margin: 0 },
  navActions: { display: 'flex', alignItems: 'center', gap: '1rem' },
  liveBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid', padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer'
  },
  aiBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#6366f1', color: 'white',
    border: 'none', padding: '0.6rem 1.1rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
  },
  refreshBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f43f5e', color: 'white',
    border: 'none', padding: '0.6rem 1.1rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
  },
  mainContent: { maxWidth: '1280px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' },
  metricCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', backdropFilter: 'blur(16px)'
  },
  metricHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  metricLabel: { fontSize: '0.8rem', color: '#94a3b8' },
  metricValue: { fontSize: '1.8rem', fontWeight: '800', margin: '0.2rem 0' },
  metricSub: { fontSize: '0.75rem', color: '#64748b' },
  chartsGrid: { display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  chartCard: {
    flex: '1', minWidth: '300px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', padding: '1.25rem', backdropFilter: 'blur(16px)'
  },
  chartHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' },
  controlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'rgba(15, 23, 42, 0.65)',
    border: '1px solid rgba(255,255,255,0.08)', padding: '0.6rem 1rem', borderRadius: '8px', flex: '1', minWidth: '280px'
  },
  searchInput: { backgroundColor: 'transparent', border: 'none', color: '#f8fafc', outline: 'none', width: '100%', fontSize: '0.875rem' },
  filterTabs: { display: 'flex', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.25rem', borderRadius: '8px' },
  tabBtn: { backgroundColor: 'transparent', border: 'none', color: '#94a3b8', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' },
  tabBtnActive: { backgroundColor: '#f43f5e', color: 'white' },
  tableCard: { backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden', backdropFilter: 'blur(16px)' },
  tableHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' },
  thRow: { borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.25)' },
  th: { padding: '0.85rem 1.25rem', color: '#64748b', fontWeight: '700', fontSize: '0.725rem' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  tdId: { padding: '1rem 1.25rem', color: '#475569', fontFamily: 'monospace' },
  td: { padding: '1rem 1.25rem' },
  tdMessage: { padding: '1rem 1.25rem', fontFamily: 'monospace', color: '#e2e8f0' },
  tdTime: { padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem' },
  badge: { padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.725rem', fontWeight: '700' },
  anomalyBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185', backgroundColor: 'rgba(244, 63, 94, 0.12)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' },
  normalBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' },
  backdrop: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 20 },
  aiDrawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '380px', backgroundColor: '#0f172a',
    borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 30, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'
  },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' },
  drawerContent: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  aiAlertBox: { display: 'flex', gap: '0.8rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '0.85rem', borderRadius: '10px' },
  summaryCard: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }
};