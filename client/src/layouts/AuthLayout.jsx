import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/Rankfasta-logo.jpg'

const AuthLayout = () => <main className="flex min-h-screen items-center justify-center bg-rf-bg px-5 py-10"><div className="w-full max-w-[440px]"><div className="mb-8 flex items-center justify-center gap-3"><img src={logo} alt="" className="h-10 w-10 rounded object-contain" /><span className="text-2xl font-bold text-rf-text">Rankfasta</span></div><div className="rounded-2xl border border-rf-border bg-rf-surface p-7 shadow-[0_0_50px_rgba(8,114,255,.12)]"><Outlet /></div><footer className="mt-6 flex justify-center gap-4 text-xs text-rf-muted"><Link to="/terms" className="hover:text-rf-text">Terms</Link><Link to="/privacy" className="hover:text-rf-text">Privacy</Link></footer></div></main>
export default AuthLayout
