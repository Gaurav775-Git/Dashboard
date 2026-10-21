import Navbar from '../components/Navbar'
import Card from '../components/ui/Card'

const titles = {
  Projects: 'Projects',
  Performance: 'Performance',
  'AI Visibility': 'AI Visibility',
  Reports: 'Reports',
  Messages: 'Messages',
  Billing: 'Billing',
  'Help Center': 'Help Center',
}

const ComingSoon = ({ section }) => (
  <div className="min-h-screen bg-rf-bg">
    <Navbar activeTab={section} />
    <main className="flex min-h-screen items-center justify-center px-5 pb-20 md:ml-[190px] md:pb-0">
      <Card className="w-full max-w-xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Rankfasta workspace</p>
        <h1 className="mt-3 text-3xl font-bold text-rf-text">{titles[section] || section}</h1>
        <p className="mt-3 text-sm text-rf-muted">This section is coming soon.</p>
        <button type="button" onClick={() => window.location.assign('/')} className="mt-6 rounded-xl bg-rf-primary px-4 py-2.5 text-sm font-semibold text-rf-text">Back to overview</button>
      </Card>
    </main>
  </div>
)

export default ComingSoon
