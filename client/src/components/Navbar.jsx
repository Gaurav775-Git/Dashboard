import logo from '../assets/Rankfasta-logo.jpg'

const links = [
  ['Overview', '⌂'],
  ['Projects', '▱'],
  ['Performance', '▥'],
  ['AI Visibility', '✦'],
  ['Reports', '▤'],
  ['Messages', '◌'],
]

const Navbar = ({ activeTab = 'Overview', onNavigate }) => {
  const navigate = (tab) => {
    onNavigate?.(tab === 'Projects' ? 'Orders' : tab)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-rf-border bg-rf-surface px-2 md:inset-y-0 md:left-0 md:right-auto md:h-screen md:w-[190px] md:flex-col md:border-r md:border-t-0 md:px-3 md:py-6">
      <div className="hidden items-center gap-3 px-2 md:flex">
        <img src={logo} alt="Rankfasta logo" className="h-8 w-8 rounded object-contain" />
        <span className="text-xl font-semibold tracking-tight text-rf-text">Rankfasta</span>
      </div>
      <div className="flex w-full items-center justify-around gap-1 md:mt-10 md:block md:flex-1">
        {links.map(([tab, icon]) => <button key={tab} type="button" onClick={() => navigate(tab)} className={`flex h-11 w-full items-center justify-center gap-3 rounded-xl px-3 text-left text-sm font-medium md:mb-1 md:justify-start ${activeTab === tab ? 'border border-rf-primary bg-rf-primary/15 text-rf-text' : 'text-rf-muted hover:bg-rf-surface-2 hover:text-rf-text'}`}><span className="w-5 text-center text-lg text-rf-blue-light">{icon}</span><span className="hidden md:inline">{tab}</span>{tab === 'Messages' && <span className="hidden rounded-full bg-rf-danger px-1.5 py-0.5 text-[10px] text-rf-text md:inline">2</span>}</button>)}
        <div className="my-4 hidden border-t border-rf-border md:block" />
        {['Billing', 'Help Center'].map((tab) => <button key={tab} type="button" onClick={() => navigate(tab)} className="hidden h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-rf-muted hover:bg-rf-surface-2 hover:text-rf-text md:flex"><span className="w-5 text-center text-lg text-rf-blue-light">{tab === 'Billing' ? '$' : '?'}</span>{tab}</button>)}
      </div>
      <div className="hidden items-center gap-3 border-t border-rf-border px-2 pt-5 md:flex"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-rf-primary text-sm font-bold text-rf-text">AC</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-rf-text">Alex Carter</p><p className="text-xs text-rf-muted">Client</p></div><span className="ml-auto text-rf-muted">⌄</span></div>
    </nav>
  )
}

export default Navbar
