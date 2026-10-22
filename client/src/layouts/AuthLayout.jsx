import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/Rankfasta-logo.jpg'

const AuthLayout = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 font-sans overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[440px]">
        
        {/* Logo Header */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 overflow-hidden">
            <img src={logo} alt="Rankfasta Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Rankfasta</span>
        </div>

        {/* Dynamic Page Content (Login or Register) */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <Outlet />
        </div>

        {/* Footer Links */}
        <footer className="mt-8 flex justify-center gap-6 text-sm text-slate-500">
          <Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
          <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
        </footer>
      </div>
    </main>
  )
}

export default AuthLayout