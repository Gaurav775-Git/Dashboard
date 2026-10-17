import React from 'react'
import logo from '../assets/Rankfasta-logo.jpg'
import Button from './ui/Button'

const Navbar = ({ activeTab = 'Overview', onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const links = [['Overview', 'Dashboard'], ['Services', 'Services'], ['Orders', 'Orders'], ['Blog', 'Blog']]
  const navigate = (tab) => {
    if (tab !== 'Blog') onNavigate?.(tab)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-rf-border bg-rf-nav/95 px-5 py-4 text-rf-text backdrop-blur md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <button type="button" onClick={() => navigate('Overview')} className="flex items-center gap-3">
          <img src={logo} alt="Rankfasta logo" className="h-8 w-8 rounded object-contain" />
          <span className="text-xl font-bold tracking-tight">Rankfasta</span>
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([tab, label]) => <button key={tab} type="button" onClick={() => navigate(tab)} className={`text-sm font-medium ${activeTab === tab ? 'text-rf-text' : 'text-rf-muted hover:text-rf-text'}`}>{label}</button>)}
          <Button onClick={() => navigate('Services')}>Contact Us</Button>
        </div>
        <button type="button" className="rounded-lg p-2 text-rf-text md:hidden" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>{isOpen ? '×' : '☰'}</button>
      </div>
      {isOpen && <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-2 border-t border-rf-border pt-4 md:hidden">
        {links.map(([tab, label]) => <button key={tab} type="button" onClick={() => navigate(tab)} className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${activeTab === tab ? 'bg-rf-surface-soft text-rf-text' : 'text-rf-muted hover:text-rf-text'}`}>{label}</button>)}
        <Button className="mt-2 w-full" onClick={() => navigate('Services')}>Contact Us</Button>
      </div>}
    </nav>
  )
}

export default Navbar
