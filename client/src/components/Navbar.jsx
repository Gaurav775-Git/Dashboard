import React from 'react'
import logo from '../assets/Rankfasta-logo.jpg'

const Navbar = ({ activeTab = 'Overview', onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const links = [
    ['Overview', 'Overview', '⌂'],
    ['Projects', 'Projects', '◈'],
    ['Performance', 'Performance', '↗'],
    ['AI Visibility', 'AI Visibility', '✦'],
    ['Reports', 'Reports', '▤'],
    ['Messages', 'Messages', '◌'],
    ['Services', 'New order', '+'],
    ['Billing', 'Billing', '$'],
    ['Help Center', 'Help Center', '?'],
  ]
  const navigate = (tab) => {
    onNavigate?.(tab === 'New order' ? 'Services' : tab === 'Projects' ? 'Orders' : tab)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-rf-border bg-rf-nav/95 px-5 text-rf-text backdrop-blur md:fixed md:inset-y-0 md:left-0 md:h-screen md:w-64 md:flex-col md:items-stretch md:border-b-0 md:border-r md:px-4 md:py-5">
      <div className="flex items-center justify-between gap-3 md:block">
        <button type="button" onClick={() => navigate('Overview')} className="flex items-center gap-3 px-2 md:mb-8">
          <img src={logo} alt="Rankfasta logo" className="h-8 w-8 rounded object-contain" />
          <span className="text-xl font-bold tracking-tight">Rankfasta</span>
        </button>
        <button type="button" className="rounded-lg p-2 text-rf-text md:hidden" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>{isOpen ? '×' : '☰'}</button>
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-16 flex-col gap-1 border-b border-rf-border bg-rf-nav p-4 md:static md:flex md:flex-1 md:border-0 md:bg-transparent md:p-0`}>
        {links.map(([tab, label, icon]) => <button key={tab} type="button" onClick={() => navigate(tab)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${activeTab === tab || (tab === 'Projects' && activeTab === 'Orders') ? 'bg-rf-primary/15 text-rf-text' : 'text-rf-muted hover:bg-rf-surface-soft hover:text-rf-text'}`}><span className="w-5 text-center text-base text-rf-blue-light">{icon}</span>{label}{tab === 'Messages' && <span className="ml-auto rounded-full bg-rf-primary px-2 py-0.5 text-[10px] text-rf-text">2</span>}</button>)}
      </div>
      <div className="hidden border-t border-rf-border pt-4 md:block">
        <div className="flex items-center gap-3 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-rf-blue text-sm font-bold text-rf-text">GS</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-rf-text">User 1</p><p className="text-xs text-rf-muted">Client account</p></div></div>
      </div>
    </nav>
  )
}

export default Navbar
