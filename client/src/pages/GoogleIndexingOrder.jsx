import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const DRAFT_KEY = 'rankfasta-google-indexing-draft'
const stages = ['Service', 'Requirements', 'Configuration', 'Review', 'Payment']
const packages = [
  { id: 'starter', name: 'Starter', allowance: 25, price: 45, detail: 'For a focused set of important pages.' },
  { id: 'growth', name: 'Growth', allowance: 100, price: 120, detail: 'For a growing site and regular updates.' },
  { id: 'scale', name: 'Scale', allowance: 500, price: 350, detail: 'For larger sites with ongoing monitoring.' },
]

const initialDraft = {
  packageId: 'starter',
  website: '',
  property: '',
  propertyType: 'Domain',
  urls: '',
  sitemap: '',
  locale: 'United States · English',
  priority: 'Standard',
  trackingDays: '30',
  frequency: 'Weekly',
  notes: '',
  consent: false,
}

const validUrls = (value) => [...new Set(value.split(/\r?\n|,/).map((url) => url.trim()).filter(Boolean))]

const GoogleIndexingOrder = () => {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(() => {
    try {
      return { ...initialDraft, ...JSON.parse(window.localStorage.getItem(DRAFT_KEY) || '{}') }
    } catch {
      return initialDraft
    }
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('Saved just now')
  const selectedPackage = packages.find((item) => item.id === draft.packageId) || packages[0]
  const urls = useMemo(() => validUrls(draft.urls), [draft.urls])
  const invalidUrls = useMemo(() => urls.filter((url) => !/^https?:\/\/[^/\s]+\S*$/i.test(url)), [urls])
  const update = (key, value) => {
    setSaved('Saving…')
    setDraft((current) => ({ ...current, [key]: value }))
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      setSaved('Saved just now')
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [draft])

  const validate = () => {
    if (step === 1 && (!draft.website || !draft.property || urls.length === 0)) return 'Add your website, verified property, and at least one URL.'
    if (step === 1 && invalidUrls.length) return 'Fix malformed URLs before continuing.'
    if (step === 3 && !draft.consent) return 'Acknowledge the indexing submission disclaimer to continue.'
    return ''
  }
  const continueStep = () => {
    const nextError = validate()
    if (nextError) {
      setError(nextError)
      return
    }
    setError('')
    if (step === stages.length - 1) {
      window.localStorage.removeItem(DRAFT_KEY)
      window.location.assign(`/services/google-indexing/order/confirmation/ORD-${Date.now().toString().slice(-6)}`)
      return
    }
    setStep((current) => current + 1)
  }

  return (
    <div className="min-h-screen bg-rf-bg">
      <Navbar activeTab="Projects" onNavigate={(tab) => { if (tab === 'Overview') window.location.assign('/'); if (tab === 'Orders') window.location.assign('/projects') }} />
      <main className="mx-auto w-full max-w-7xl px-5 py-10 md:ml-64 md:px-10 md:py-12">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-sm text-rf-muted">Projects / Google indexing</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-rf-text md:text-4xl">New campaign — Google indexing</h1><p className="mt-2 text-base text-rf-muted">Submit important URLs and monitor their indexing status over time.</p></div>
          <div className="flex items-center gap-3"><span className="text-xs text-rf-muted" aria-live="polite">{saved}</span><Button variant="secondary" onClick={() => window.location.assign('/')}>Save & exit</Button></div>
        </header>
        <Card className="mb-6 overflow-x-auto p-5"><div className="flex min-w-[650px] items-center">{stages.map((label, index) => <div key={label} className="flex flex-1 items-center"><div className={`flex items-center gap-2 text-sm font-semibold ${index <= step ? 'text-rf-text' : 'text-rf-muted'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${index < step ? 'border-rf-primary bg-rf-primary text-rf-text' : index === step ? 'border-rf-primary text-rf-text' : 'border-rf-border'}`}>{index < step ? '✓' : index + 1}</span>{label}</div>{index < stages.length - 1 && <div className={`mx-3 h-px flex-1 ${index < step ? 'bg-rf-primary' : 'bg-rf-border'}`} />}</div>)}</div></Card>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
          <Card className="p-6">
            {step === 0 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 1</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Choose your package</h2><p className="mt-2 text-sm text-rf-muted">Every package includes a pre-indexing audit and monitoring.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{packages.map((item) => <button type="button" key={item.id} onClick={() => update('packageId', item.id)} className={`rounded-xl border p-4 text-left ${draft.packageId === item.id ? 'border-rf-primary bg-rf-primary/10' : 'border-rf-border bg-rf-surface-soft'}`}><p className="font-semibold text-rf-text">{item.name}</p><p className="mt-2 text-2xl font-bold text-rf-text">${item.price}</p><p className="mt-1 text-xs text-rf-muted">{item.allowance} URLs</p><p className="mt-3 text-xs leading-relaxed text-rf-muted">{item.detail}</p></button>)}</div></section>}
            {step === 1 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 2</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Tell us what to index</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-rf-text">Website URL<input value={draft.website} onChange={(event) => update('website', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com" /></label><label className="text-sm font-medium text-rf-text">Verified Search Console property<input value={draft.property} onChange={(event) => update('property', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="sc-domain:yoursite.com" /></label></div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-rf-text">Property type<select value={draft.propertyType} onChange={(event) => update('propertyType', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm"><option>Domain</option><option>URL-prefix</option></select></label><label className="text-sm font-medium text-rf-text">Sitemap URL (optional)<input value={draft.sitemap} onChange={(event) => update('sitemap', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com/sitemap.xml" /></label></div><label className="mt-5 block text-sm font-medium text-rf-text">URLs to index <span className="font-normal text-rf-muted">(one per line or comma-separated)</span><textarea rows="7" value={draft.urls} onChange={(event) => update('urls', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com/new-page" /><span className="mt-2 block text-xs text-rf-muted">{urls.length} URL{urls.length === 1 ? '' : 's'} added · allowance {selectedPackage.allowance}</span></label>{invalidUrls.length > 0 && <p className="mt-3 text-sm text-rf-danger">Malformed URL: {invalidUrls[0]}</p>}</section>}
            {step === 2 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 3</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Configure monitoring</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-rf-text">Country and language<select value={draft.locale} onChange={(event) => update('locale', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm"><option>United States · English</option><option>United Kingdom · English</option><option>India · English</option></select></label><label className="text-sm font-medium text-rf-text">Processing priority<select value={draft.priority} onChange={(event) => update('priority', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm"><option>Standard</option><option>High</option></select></label><label className="text-sm font-medium text-rf-text">Tracking duration<select value={draft.trackingDays} onChange={(event) => update('trackingDays', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm"><option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option></select></label><label className="text-sm font-medium text-rf-text">Report frequency<select value={draft.frequency} onChange={(event) => update('frequency', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm"><option>Weekly</option><option>Daily</option></select></label></div><label className="mt-5 block text-sm font-medium text-rf-text">Optional notes<textarea rows="4" value={draft.notes} onChange={(event) => update('notes', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="Anything the specialist should know?" /></label></section>}
            {step === 3 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 4</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Review your campaign</h2><dl className="mt-6 grid gap-4 rounded-xl bg-rf-surface-soft p-5 text-sm sm:grid-cols-2"><div><dt className="text-rf-muted">Package</dt><dd className="mt-1 text-rf-text">{selectedPackage.name} · {selectedPackage.allowance} URLs</dd></div><div><dt className="text-rf-muted">Website</dt><dd className="mt-1 break-all text-rf-text">{draft.website || 'Not provided'}</dd></div><div><dt className="text-rf-muted">URLs submitted</dt><dd className="mt-1 text-rf-text">{urls.length}</dd></div><div><dt className="text-rf-muted">Monitoring</dt><dd className="mt-1 text-rf-text">{draft.trackingDays} days · {draft.frequency}</dd></div></dl><label className="mt-6 flex gap-3 text-sm text-rf-muted"><input type="checkbox" checked={draft.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 accent-rf-primary" />I understand that submitting URLs does not guarantee Google will index them.</label></section>}
            {step === 4 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 5</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Confirm payment</h2><p className="mt-3 text-sm leading-relaxed text-rf-muted">This demo uses a mock payment step. No card details are stored.</p><div className="mt-6 rounded-xl border border-rf-border bg-rf-surface-soft p-5"><p className="text-sm text-rf-muted">Total due today</p><p className="mt-2 text-4xl font-bold text-rf-text">${selectedPackage.price}</p><p className="mt-3 text-xs text-rf-muted">A secure payment provider would be connected here in production.</p></div></section>}
            {error && <p role="alert" className="mt-6 rounded-lg border border-rf-danger/40 bg-rf-danger/10 p-3 text-sm text-rf-danger">{error}</p>}
            <div className="mt-8 flex justify-between gap-3 border-t border-rf-border pt-5"><Button variant="ghost" onClick={() => { setError(''); setStep((current) => Math.max(0, current - 1)) }} disabled={step === 0}>Back</Button><Button onClick={continueStep}>{step === stages.length - 1 ? 'Confirm campaign' : 'Continue'}</Button></div>
          </Card>
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Card className="p-6"><h2 className="text-lg font-semibold text-rf-text">Order summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><span className="text-rf-muted">Package</span><span className="text-rf-text">{selectedPackage.name}</span></div><div className="flex justify-between gap-3"><span className="text-rf-muted">URL allowance</span><span className="text-rf-text">{selectedPackage.allowance}</span></div><div className="flex justify-between gap-3"><span className="text-rf-muted">Pre-indexing audit</span><span className="text-rf-success">Included</span></div><div className="flex justify-between gap-3"><span className="text-rf-muted">Tracking</span><span className="text-rf-text">{draft.trackingDays} days</span></div><div className="border-t border-rf-border pt-4"><span className="text-rf-muted">Total</span><p className="mt-1 text-3xl font-bold text-rf-text">${selectedPackage.price}</p></div></div><p className="mt-5 text-xs leading-relaxed text-rf-muted">Submitting URLs does not guarantee Google will index them. You can review everything before payment.</p></Card><Card className="p-5"><p className="text-sm font-semibold text-rf-text">Need help?</p><p className="mt-2 text-sm leading-relaxed text-rf-muted">Talk to your specialist about property verification or URL preparation.</p><button type="button" className="mt-3 text-sm font-semibold text-rf-blue-light">Talk to your specialist →</button></Card></aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default GoogleIndexingOrder
