import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ServiceCatalog from '../components/ServiceCatalog'
import DateRangePicker from '../components/DateRangePicker'
import NotificationsPopover from '../components/NotificationsPopover'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getDashboardStats } from '../services/dashboardApi'
import { formatRange, readRange } from '../lib/dateRange'
import { useAuth } from '../context/AuthContext'
import {
  FiActivity,
  FiArrowUpRight,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiChevronRight,
  FiChevronDown,
  FiDatabase,
  FiInfo,
  FiLayers,
  FiMessageCircle,
  FiPlus,
  FiSearch,
  FiSettings,
  FiStar,
  FiTarget,
} from 'react-icons/fi'

const points = (data, max, width = 620, height = 130) => {
  if (!data || data.length === 0) return '';
  return data.map((value, index) => `${(index / (data.length - 1)) * width},${height - (value / max) * height}`).join(' ');
}

const Trend = ({ value }) => <span className="rounded-lg border border-rf-primary/40 bg-rf-primary/15 px-2 py-1 text-xs font-semibold text-rf-text">↗ {value}</span>

const Sparkline = ({ data }) => {
  if (!data) return null;
  const max = Math.max(...data, 1);
  return <svg className="absolute inset-x-5 bottom-4 h-9 w-[calc(100%-40px)]" viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label="KPI trend"><polyline points={data.map((value, index) => `${(index / (data.length - 1)) * 100},${38 - (value / max) * 30}`).join(' ')} fill="none" stroke="#0872FF" strokeWidth="2" /><polyline points={`0,40 ${data.map((value, index) => `${(index / (data.length - 1)) * 100},${38 - (value / max) * 30}`).join(' ')} 100,40`} fill="url(#spark-fill)" /><defs><linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0872FF" stopOpacity=".3" /><stop offset="1" stopColor="#0872FF" stopOpacity="0" /></linearGradient></defs></svg>
}

const IconTile = ({ children }) => <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rf-surface-2 text-lg text-rf-primary-light">{children}</span>

const DashboardIcon = ({ name, className = 'h-5 w-5' }) => {
  const icons = {
    search: FiSearch,
    chart: FiBarChart2,
    sparkle: FiStar,
    database: FiDatabase,
    ranking: FiTarget,
    audit: FiSettings,
    knowledge: FiLayers,
    message: FiMessageCircle,
  }
  const Icon = icons[name] || FiActivity
  return <Icon className={className} aria-hidden="true" />
}

const Dashboard = () => {
  const { user } = useAuth()
  const firstName = (user?.name || 'there').split(/\s+/)[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  
  const [tab, setTab] = useState(() => window.location.pathname === '/services' ? 'Services' : 'Overview')
  const [range, setRange] = useState(readRange)
  const [showRange, setShowRange] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(res => {
        setStats(res.data)
      })
      .catch(err => console.error("Failed to load dashboard:", err))
      .finally(() => setLoading(false))
  }, [])

  if (tab === 'Services') return <><Navbar activeTab={tab} onNavigate={setTab} /><main className="min-h-screen bg-rf-bg px-5 py-10 pb-24 md:ml-[190px] md:px-10"><ServiceCatalog onOrder={() => setTab('Overview')} /></main></>
  
  if (loading) return <div className="min-h-screen bg-rf-bg p-10 text-rf-text">Loading dashboard data...</div>

  const activeSeries = stats?.graphData || [0, 0, 0, 0, 0, 0, 0]
  const graphMax = Math.max(...activeSeries, 10) // Prevents flat line if max is 0

  const dynamicKpis = [
    { label: 'Total URLs', value: stats?.totalUrls || 0, trend: '+0%', data: activeSeries, icon: 'chart' },
    { label: 'Indexed URLs', value: stats?.completedUrls || 0, trend: '+0%', data: activeSeries, icon: 'ranking' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, trend: '+0%', data: activeSeries, icon: 'sparkle' },
    { label: 'Success Rate', value: `${stats?.visibilityScore || 0}%`, trend: '+0%', data: activeSeries, icon: 'database' },
  ]

  return <div className="min-h-screen bg-rf-bg"><Navbar activeTab={tab} onNavigate={setTab} /><main className="mx-auto w-full max-w-[1250px] px-5 py-6 pb-24 md:ml-[190px] md:px-[21px] md:pb-8">
    <header className="mb-6 flex flex-wrap items-start justify-between gap-5"><div><h1 className="text-3xl font-bold tracking-tight text-rf-text md:text-[40px]">{greeting}, {firstName}</h1><p className="mt-2 text-base text-rf-muted md:text-lg">Your visibility is moving in the right direction.</p></div><div className="flex items-center gap-3"><div className="relative"><button type="button" onClick={() => setShowRange((current) => !current)} className="hidden h-11 items-center gap-2 rounded-xl border border-rf-border bg-rf-surface px-3 text-sm text-rf-text sm:flex"><FiCalendar className="h-4 w-4" aria-hidden="true" /> {formatRange(range)}<FiChevronDown className="h-4 w-4" aria-hidden="true" /></button>{showRange && <DateRangePicker range={range} onApply={setRange} onClose={() => setShowRange(false)} />}</div><div className="relative"><button type="button" aria-label="Notifications" onClick={() => setShowNotifications((current) => !current)} className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-rf-border bg-rf-surface text-lg text-rf-text"><FiBell className="h-5 w-5" aria-hidden="true" />{notifications.some((item) => item.unread) && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rf-danger" />}</button>{showNotifications && <NotificationsPopover notifications={notifications} onRead={(item) => { setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry)); window.location.assign(item.href) }} onClose={() => setShowNotifications(false)} />}</div><Button onClick={() => window.location.assign('/services')}><FiPlus className="h-4 w-4" aria-hidden="true" /> New Campaign</Button></div></header>
    
    <Card className="relative mb-4 overflow-hidden p-6 shadow-[0_0_24px_rgba(8,114,255,0.12)] before:absolute before:right-0 before:top-0 before:h-full before:w-1/2 before:bg-[radial-gradient(circle_at_top_right,rgba(8,114,255,0.16),transparent_65%)] before:content-['']"><div className="relative grid gap-6 lg:grid-cols-[.7fr_1.8fr]"><div><h2 className="text-lg font-semibold text-rf-text">URLs Submitted <FiInfo className="ml-1 inline h-4 w-4 text-rf-muted" aria-hidden="true" /></h2><div className="mt-4 flex items-baseline gap-2"><span className="text-7xl font-extrabold tracking-tight text-rf-text">{stats?.totalUrls || 0}</span></div><div className="mt-3 flex flex-wrap items-center gap-3"><Trend value="+12.6%" /><span className="text-xs text-rf-muted">Total URLs submitted this period.</span></div></div><div role="img" aria-label={`Trend`} className="min-w-0"><button type="button" onClick={() => window.location.assign('/reports')} className="mb-1 flex w-full items-center justify-end gap-1 text-xs font-semibold text-rf-primary">View full report <FiArrowUpRight className="h-3 w-3" aria-hidden="true" /></button><svg className="h-[150px] w-full" viewBox="0 0 620 150" preserveAspectRatio="none"><defs><linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0872FF" stopOpacity=".35" /><stop offset="1" stopColor="#0872FF" stopOpacity="0" /></linearGradient></defs>{[0, 25, 50, 75, 100].map((line) => <g key={line}><line x1="0" y1={130 - line * 1.2} x2="620" y2={130 - line * 1.2} stroke="rgba(143,163,199,.12)" /><text x="0" y={126 - line * 1.2} fill="#8FA3C7" fontSize="10">{line}</text></g>)}<polyline points={points(activeSeries, graphMax)} fill="none" stroke="#0872FF" strokeWidth="9" opacity=".35" /><polyline points={points(activeSeries, graphMax)} fill="none" stroke="#0872FF" strokeWidth="2.5" />{activeSeries.map((value, index) => (index % 3 === 0 || index === activeSeries.length - 1) && <circle key={index} cx={(index / (activeSeries.length - 1)) * 620} cy={130 - (value / graphMax) * 130} r={index === activeSeries.length - 1 ? 5 : 3} fill={index === activeSeries.length - 1 ? '#fff' : '#071536'} stroke="#0872FF" strokeWidth="2" />)}</svg><div className="flex justify-between pl-5 text-[10px] text-rf-muted"><span>{stats?.dates?.[0] || 'Start'}</span><span>{stats?.dates?.[stats.dates.length - 1] || 'Today'}</span></div></div></div></Card>
    
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{dynamicKpis.map((item) => <button type="button" key={item.label} className={`text-left`}><Card className="relative min-h-[130px] overflow-hidden p-5"><div className="flex items-center gap-3"><IconTile><DashboardIcon name={item.icon} /></IconTile><span className="text-sm font-medium text-rf-text">{item.label}</span></div><div className="mt-3 flex items-center gap-3"><span className="text-3xl font-bold text-rf-text">{item.value}</span></div><Sparkline data={item.data} /></Card></button>)}</div>

    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_.98fr]">
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-rf-text">Active Campaigns</h2>
          <button type="button" onClick={() => window.location.assign('/projects')} className="inline-flex items-center gap-1 text-xs font-semibold text-rf-primary">View all <FiChevronRight className="h-3 w-3" aria-hidden="true" /></button>
        </div>
        <div className="py-4 text-sm text-rf-muted">Go to Projects to manage your campaigns.</div>
      </Card>
      
      <Card className="p-5"><h2 className="text-lg font-semibold text-rf-text">Channel Performance <FiInfo className="ml-1 inline h-4 w-4 text-rf-muted" aria-hidden="true" /></h2><div className="mt-4 flex items-center gap-4"><div className="flex-1 space-y-4"><div><div className="mb-1 flex items-center justify-between text-xs text-rf-muted"><span className="flex items-center gap-2"><DashboardIcon name="search" className="h-3.5 w-3.5 text-rf-primary" />Google</span><span>100%</span></div><div className="h-1.5 rounded-full bg-rf-surface-2"><div className="h-1.5 rounded-full bg-rf-primary" style={{ width: `100%` }} /></div></div></div><div className="shrink-0 text-center"><div className="flex h-28 w-28 items-center justify-center rounded-full border-[18px] border-rf-primary-light border-l-rf-primary border-b-rf-primary-lighter"><div><p className="text-lg font-bold text-rf-text">{stats?.visibilityScore || 0}%</p><p className="text-[10px] text-rf-muted">Indexed</p></div></div></div></div></Card>
      
      <div className="space-y-3">
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-base font-semibold text-rf-text">Next actions</h2></div>
          <div className="py-4 text-sm text-rf-muted">No pending actions.</div>
        </Card>
        <Card className="p-5"><h2 className="text-base font-semibold text-rf-text">Account manager</h2><div className="mt-3 flex items-center gap-3"><div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-rf-primary text-sm font-bold text-rf-text">EC<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-rf-surface bg-rf-success" /></div><div><p className="text-sm font-semibold text-rf-text">Emily Chen</p><p className="text-xs text-rf-muted">Online</p></div></div></Card>
      </div>
    </div>
  </main></div>
}

export default Dashboard