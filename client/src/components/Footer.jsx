import logo from '../assets/Rankfasta-logo.jpg'

const Footer = () => (
  <footer className="w-full border-t border-rf-border bg-rf-bg px-5 pb-8 pt-14 text-rf-muted md:px-10">
    <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="mb-4 flex items-center gap-3"><img src={logo} alt="Rankfasta logo" className="h-8 w-8 rounded object-contain" /><span className="text-xl font-bold tracking-tight text-rf-text">Rankfasta</span></div>
        <p className="max-w-sm text-sm leading-relaxed">A focused workspace for planning, placing, and tracking search visibility work.</p>
      </div>
      <div><h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-rf-text">Services</h4><ul className="space-y-3 text-sm"><li><a href="#" className="hover:text-rf-blue-light">SEO optimization</a></li><li><a href="#" className="hover:text-rf-blue-light">GEO services</a></li><li><a href="#" className="hover:text-rf-blue-light">Content strategy</a></li><li><a href="#" className="hover:text-rf-blue-light">Link building</a></li></ul></div>
      <div><h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-rf-text">Company</h4><ul className="space-y-3 text-sm"><li><a href="#" className="hover:text-rf-blue-light">About us</a></li><li><a href="#" className="hover:text-rf-blue-light">Blog</a></li><li><a href="#" className="hover:text-rf-blue-light">Contact</a></li><li><a href="#" className="hover:text-rf-blue-light">Careers</a></li></ul></div>
    </div>
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-rf-border pt-8 text-xs md:flex-row"><p>© {new Date().getFullYear()} Rankfasta. All rights reserved.</p><div className="flex gap-6"><a href="#" className="hover:text-rf-blue-light">Privacy Policy</a><a href="#" className="hover:text-rf-blue-light">Terms of service</a></div></div>
  </footer>
)

export default Footer
