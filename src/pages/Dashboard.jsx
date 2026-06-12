import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import {
  ChatBubbleOutline as ChatIcon,
  TaskAlt as TaskIcon,
  NoteAlt as NoteIcon,
  NotificationsNone as ReminderIcon,
  CalendarMonth as CalendarIcon,
  FolderOpen as FileIcon,
  Language as TranslateIcon,
  MenuBook as DictionaryIcon,
  Calculate as MathIcon,
  EventBusy as EventEmptyIcon
} from '@mui/icons-material';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/dashboard.css';

const ACCENT = '#a8e63d';

const stats = (data) => [
  { label: 'AI Chats',  value: data.chats,     icon: <ChatIcon fontSize="small" />, color: ACCENT,    bg: 'rgba(168,230,61,0.1)',   border: 'rgba(168,230,61,0.18)',   path: '/chat' },
  { label: 'Tasks',     value: data.tasks,     icon: <TaskIcon fontSize="small" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.18)',   path: '/tasks' },
  { label: 'Notes',     value: data.notes,     icon: <NoteIcon fontSize="small" />, color: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.18)',   path: '/notes' },
  { label: 'Reminders', value: data.reminders, icon: <ReminderIcon fontSize="small" />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.18)',    path: '/reminders' },
  { label: 'Events',    value: data.events,    icon: <CalendarIcon fontSize="small" />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.18)',   path: '/calendar' },
  { label: 'Files',     value: data.files,     icon: <FileIcon fontSize="small" />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',    border: 'rgba(6,182,212,0.18)',    path: '/files' },
];

const tools = [
  { name: 'AI Chat',     desc: 'Intelligent conversations for brainstorming, coding help, and writing assistance.',  icon: <ChatIcon />, color: ACCENT,    bg: 'rgba(168,230,61,0.1)',  border: 'rgba(168,230,61,0.18)',  tag: 'Popular', tagBg: 'rgba(168,230,61,0.12)', tagColor: ACCENT,    path: '/chat' },
  { name: 'Tasks',       desc: 'Create and organize tasks with AI assistance, due dates, and priority management.',  icon: <TaskIcon />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.18)', tag: null,      tagBg: '',                     tagColor: '',        path: '/tasks' },
  { name: 'Notes',       desc: 'Rich notes with AI summaries, formatting, and easy sharing capabilities.',           icon: <NoteIcon />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.18)', tag: null,      tagBg: '',                     tagColor: '',        path: '/notes' },
  { name: 'Reminders',   desc: 'Smart reminders with context detection, notifications, and calendar sync.',          icon: <ReminderIcon />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.18)',  tag: null,      tagBg: '',                     tagColor: '',        path: '/reminders' },
  { name: 'Calendar',    desc: 'Schedule and manage events, meetings, and appointments with ease.',                  icon: <CalendarIcon />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.18)', tag: null,      tagBg: '',                     tagColor: '',        path: '/calendar' },
  { name: 'Translator',  desc: 'Instant translation across 100+ languages with pronunciation guides.',               icon: <TranslateIcon />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.18)',  tag: 'New',     tagBg: 'rgba(6,182,212,0.12)', tagColor: '#06b6d4', path: '/translator' },
  { name: 'Dictionary',  desc: 'Definitions, synonyms, pronunciations, and save your favorites.',                    icon: <DictionaryIcon />, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',border: 'rgba(167,139,250,0.18)',tag: null,      tagBg: '',                     tagColor: '',        path: '/dictionary' },
  { name: 'Math Solver', desc: 'Solve equations with step-by-step explanations and visualizations.',                 icon: <MathIcon />, color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.18)', tag: null,      tagBg: '',                     tagColor: '',        path: '/math' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user }          = useSelector((s) => s.auth);
  const { conversations } = useSelector((s) => s.chat);
  const { notes }         = useSelector((s) => s.notes);
  const { events }        = useSelector((s) => s.calendar);
  const { files }         = useSelector((s) => s.files);
  const { tasks }         = useSelector((s) => s.tasks);
  const { reminders }     = useSelector((s) => s.reminders);

  const statData = {
    chats: conversations.length || 0,
    tasks: tasks.length || 0,
    notes: notes.length || 0,
    reminders: reminders.length || 0,
    events: events.length || 0,
    files: files.length || 0,
  };

  // Calendar helpers
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const calDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(firstDay);
    d.setDate(d.getDate() - firstDay.getDay() + i);
    return d;
  });

  return (
    <ErrorBoundary>
      <div className="dash">
        <div className="dash-grid-bg" />
        <div className="dash-glow" />

        <div className="dash-inner">

          {/* ── WELCOME ── */}
          <div className="dash-welcome">
            <div>
              <div className="dash-welcome-label">
                <span className="dash-welcome-dot">✦</span>
                <span className="dash-welcome-tag">Dashboard</span>
              </div>
              <h1 className="dash-welcome-title">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}
              </h1>
              <p className="dash-welcome-sub">Here's what's happening with your productivity today</p>
            </div>
            <button className="dash-new-chat-btn" onClick={() => navigate('/chat')}>
              + New Chat
            </button>
          </div>

          {/* ── STATS ── */}
          <div className="dash-section">
            <div className="dash-section-head">
              <div>
                <div className="dash-section-label">Overview</div>
                <h2 className="dash-section-title">Your activity</h2>
              </div>
            </div>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              {stats(statData).map((s) => (
                <div
                  key={s.label}
                  className="stat-card"
                  onClick={() => navigate(s.path)}
                  style={{ '--hover-border': s.color, '--hover-shadow': s.color }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.color + '55';
                    e.currentTarget.style.boxShadow = `0 8px 28px ${s.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="stat-icon" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            
            {/* Canvas Data Visualization using Recharts */}
            <div className="dash-section-head" style={{ marginTop: '2rem' }}>
              <div>
                <div className="dash-section-label">Analytics</div>
                <h2 className="dash-section-title">Activity Breakdown</h2>
              </div>
            </div>
            <div style={{ height: 300, background: 'rgba(15, 20, 9, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(168, 230, 61, 0.12)', borderRadius: '16px', padding: '1rem', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Chats', value: statData.chats, fill: '#a8e63d' },
                  { name: 'Tasks', value: statData.tasks, fill: '#f59e0b' },
                  { name: 'Notes', value: statData.notes, fill: '#10b981' },
                  { name: 'Reminders', value: statData.reminders, fill: '#ef4444' },
                  { name: 'Events', value: statData.events, fill: '#8b5cf6' },
                  { name: 'Files', value: statData.files, fill: '#06b6d4' }
                ]} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: 'rgba(10,13,7,0.9)', border: '1px solid rgba(168,230,61,0.2)', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── TOOLS ── */}
          <div className="dash-section">
            <div className="dash-section-head">
              <div>
                <div className="dash-section-label">Quick Actions</div>
                <h2 className="dash-section-title">Your tools</h2>
              </div>
            </div>
            <div className="tools-grid">
              {tools.map((t) => (
                <div
                  key={t.name}
                  className="tool-card"
                  onClick={() => navigate(t.path)}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = t.color + '50';
                    e.currentTarget.style.boxShadow = `0 12px 36px ${t.color}14`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="tool-card-top">
                    <div className="tool-icon" style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}>
                      {t.icon}
                    </div>
                    {t.tag && (
                      <span className="tool-tag" style={{ background: t.tagBg, color: t.tagColor, border: `1px solid ${t.color}30` }}>
                        {t.tag}
                      </span>
                    )}
                  </div>
                  <p className="tool-name">{t.name}</p>
                  <p className="tool-desc">{t.desc}</p>
                  <div className="tool-open" style={{ color: t.color }}>
                    Open <span className="tool-open-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CALENDAR ── */}
          <div className="dash-section" style={{ marginBottom: 0 }}>
            <div className="dash-section-head">
              <div>
                <div className="dash-section-label">Schedule</div>
                <h2 className="dash-section-title">Calendar & Events</h2>
              </div>
              <button className="dash-view-all" onClick={() => navigate('/calendar')}>View All</button>
            </div>

            <div className="cal-grid">
              {/* Mini Calendar */}
              <div className="cal-card">
                <div className="cal-month">
                  {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="cal-days-header">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={i} className="cal-day-name">{d}</div>
                  ))}
                </div>
                <div className="cal-days">
                  {calDays.map((d, i) => {
                    const isToday = d.toDateString() === today.toDateString();
                    const isOther = d.getMonth() !== today.getMonth();
                    const hasEvent = events.some(e => e.date && new Date(e.date).toDateString() === d.toDateString());
                    return (
                      <div
                        key={i}
                        className={`cal-day${isToday ? ' today' : ''}${isOther ? ' other-month' : ''}`}
                        onClick={() => navigate('/calendar')}
                      >
                        {d.getDate()}
                        {hasEvent && !isToday && <div className="cal-day-dot" />}
                      </div>
                    );
                  })}
                </div>
                <div className="cal-stats">
                  {[
                    { l: 'Total',    v: events.length,                                                                                    c: ACCENT },
                    { l: 'Today',    v: events.filter(e => new Date(e.date).toDateString() === today.toDateString()).length,               c: '#f59e0b' },
                    { l: 'Upcoming', v: events.filter(e => new Date(e.date) > today).length,                                              c: '#10b981' },
                  ].map(s => (
                    <div key={s.l} style={{ textAlign: 'center' }}>
                      <div className="cal-stat-val" style={{ color: s.c }}>{s.v}</div>
                      <div className="cal-stat-label">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events */}
              <div className="events-card">
                <div className="events-header">
                  <h3 className="events-title">Upcoming Events</h3>
                  <span className="events-count-badge">{events.length} events</span>
                </div>

                {events.length === 0 ? (
                  <div className="events-empty">
                    <div className="events-empty-icon"><EventEmptyIcon fontSize="large" sx={{ opacity: 0.8 }} /></div>
                    <div>
                      <p className="events-empty-title">No upcoming events</p>
                      <p className="events-empty-sub">Add your first event to get started</p>
                    </div>
                    <button className="events-add-btn" onClick={() => navigate('/calendar')}>Add Event</button>
                  </div>
                ) : (
                  <div className="events-list">
                    {events.slice(0, 7).map((ev, i) => (
                      <div key={i} className="event-item" onClick={() => navigate('/calendar')}>
                        <div className="event-bar" style={{ background: ev.color || ACCENT }} />
                        <div>
                          <div className="event-name">{ev.title}</div>
                          <div className="event-date">
                            {ev.date
                              ? new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                              : 'No date'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </ErrorBoundary>
  );
}
