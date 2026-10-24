import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import StripeCheckoutForm from '../components/StripeCheckoutForm'
import { api } from '../lib/api'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const DRAFT_KEY = 'rankfasta-google-ranking-draft'
const stages = ['Service', 'Requirements', 'Configuration', 'Review', 'Payment']
const packages = [
  { id: 'starter', name: 'Starter', keywords: 5, price: 250, detail: 'A focused set of priority keywords.' },
  { id: 'growth', name: 'Growth', keywords: 15, price: 500, detail: 'Broader tracking for an active campaign.' },
  { id: 'scale', name: 'Scale', keywords: 40, price: 950, detail: 'A larger keyword set with deeper reporting.' },
]
const initialDraft = {
  packageId: 'starter', website: '', target: '', keywords: '', location: 'United States',
  language: 'English', device: 'Desktop and mobile', trackingDays: '60',
  frequency: 'Weekly', notes: '', consent: false,
}
const parseKeywords = (value) => [...new Set(value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean))]

const GoogleRankingOrder = () => {
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
  const [clientSecret, setClientSecret] = useState('')
  const [paymentError, setPaymentError] = useState('')
  
  const selectedPackage = packages.find((item) => item.id === draft.packageId) || packages[0]
  const keywords = useMemo(() => parseKeywords(draft.keywords), [draft.keywords])
  
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

  // Fetch Stripe Payment Intent when reaching the final step
  useEffect(() => {
    if (step === 4) {
      api.post('/services/payments/create-intent', { amount: selectedPackage.price, currency: 'usd' })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => setPaymentError('Failed to initialize payment'))
    }
  }, [step, selectedPackage.price])

  const continueStep = () => {
    if (step === 1 && (!draft.website || !draft.target || !keywords.length)) {
      setError('Add your website, target page, and at least one keyword.')
      return
    }
    if (step === 1 && keywords.length > selectedPackage.keywords) {
      setError(`Your ${selectedPackage.name} package supports up to ${selectedPackage.keywords} keywords.`)
      return
    }
    if (step === 3 && !draft.consent) {
      setError('Acknowledge the ranking disclaimer to continue.')
      return
    }
    setError('')
    
    if (step < stages.length - 1) {
      setStep((current) => current + 1)
    }
  }

  return (
    <div className="min-h-screen bg-rf-bg">
      <Navbar activeTab="Projects" onNavigate={(tab) => { if (tab === 'Overview') window.location.assign('/'); if (tab === 'Orders') window.location.assign('/projects') }} />
      <main className="mx-auto w-full max-w-7xl px-5 py-10 md:ml-64 md:px-10 md:py-12">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-rf-muted">Projects / Google ranking</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-rf-text md:text-4xl">New campaign — Google ranking</h1><p className="mt-2 text-base text-rf-muted">Track target keywords and measure search visibility over time.</p></div><div className="flex items-center gap-3"><span className="text-xs text-rf-muted" aria-live="polite">{saved}</span><Button variant="secondary" onClick={() => window.location.assign('/')}>Save & exit</Button></div></header>
        <Card className="mb-6 overflow-x-auto p-5"><div className="flex min-w-[650px] items-center">{stages.map((label, index) => <div key={label} className="flex flex-1 items-center"><div className={`flex items-center gap-2 text-sm font-semibold ${index <= step ? 'text-rf-text' : 'text-rf-muted'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${index < step ? 'border-rf-primary bg-rf-primary text-rf-text' : index === step ? 'border-rf-primary text-rf-text' : 'border-rf-border'}`}>{index < step ? '✓' : index + 1}</span>{label}</div>{index < stages.length - 1 && <div className={`mx-3 h-px flex-1 ${index < step ? 'bg-rf-primary' : 'bg-rf-border'}`} />}</div>)}</div></Card>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
          <Card className="p-6">
            {step === 0 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 1</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Choose your package</h2><p className="mt-2 text-sm text-rf-muted">Packages include baseline research, rank monitoring, and recurring reports.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{packages.map((item) => <button type="button" key={item.id} onClick={() => update('packageId', item.id)} className={`rounded-xl border p-4 text-left ${draft.packageId === item.id ? 'border-rf-primary bg-rf-primary/10' : 'border-rf-border bg-rf-surface-soft'}`}><p className="font-semibold text-rf-text">{item.name}</p><p className="mt-2 text-2xl font-bold text-rf-text">${item.price}</p><p className="mt-1 text-xs text-rf-muted">{item.keywords} tracked keywords</p><p className="mt-3 text-xs text-rf-muted">{item.detail}</p></button>)}</div></section>}
            {step === 1 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 2</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Define your ranking targets</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-rf-text">Website URL<input value={draft.website} onChange={(event) => update('website', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com" /></label><label className="text-sm font-medium text-rf-text">Target page<input value={draft.target} onChange={(event) => update('target', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com/landing-page" /></label></div><label className="mt-5 block text-sm font-medium text-rf-text">Target keywords <span className="font-normal text-rf-muted">(one per line or comma-separated)</span><textarea rows="7" value={draft.keywords} onChange={(event) => update('keywords', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="best seo tools&#10;seo reporting software" /><span className={`mt-2 block text-xs ${keywords.length > selectedPackage.keywords ? 'text-rf-danger' : 'text-rf-muted'}`}>{keywords.length} keyword{keywords.length === 1 ? '' : 's'} added · allowance {selectedPackage.keywords}</span></label></section>}
            {step === 2 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 3</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Configure rank tracking</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{[['location', 'Target location', ['United States', 'United Kingdom', 'India', 'Worldwide']], ['language', 'Language', ['English', 'Spanish', 'French']], ['device', 'Devices', ['Desktop and mobile', 'Desktop', 'Mobile']], ['trackingDays', 'Tracking duration', ['30', '60', '90']], ['frequency', 'Report frequency', ['Weekly', 'Daily']]].map(([key, label, options]) => <label key={key} className="text-sm font-medium text-rf-text">{label}<select value={draft[key]} onChange={(event) => update(key, event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm">{options.map((option) => <option key={option} value={option}>{key === 'trackingDays' ? `${option} days` : option}</option>)}</select></label>)}</div><label className="mt-5 block text-sm font-medium text-rf-text">Campaign notes<textarea rows="4" value={draft.notes} onChange={(event) => update('notes', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="Competitors, seasonal context, or priorities for the specialist" /></label></section>}
            {step === 3 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 4</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Review your campaign</h2><dl className="mt-6 grid gap-4 rounded-xl bg-rf-surface-soft p-5 text-sm sm:grid-cols-2"><div><dt className="text-rf-muted">Package</dt><dd className="mt-1 text-rf-text">{selectedPackage.name} · {selectedPackage.keywords} keywords</dd></div><div><dt className="text-rf-muted">Target page</dt><dd className="mt-1 break-all text-rf-text">{draft.target || 'Not provided'}</dd></div><div><dt className="text-rf-muted">Keywords submitted</dt><dd className="mt-1 text-rf-text">{keywords.length}</dd></div><div><dt className="text-rf-muted">Market and devices</dt><dd className="mt-1 text-rf-text">{draft.location} · {draft.device}</dd></div></dl><label className="mt-6 flex gap-3 text-sm text-rf-muted"><input type="checkbox" checked={draft.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 accent-rf-primary" />I understand that rankings depend on search engines, competition, and campaign inputs; results are not guaranteed.</label></section>}
            
            {step === 4 && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 5</p>
                <h2 className="mt-2 text-xl font-semibold text-rf-text">Confirm payment</h2>
                <div className="mt-6 rounded-xl border border-rf-border bg-rf-surface-soft p-5">
                  <p className="text-sm text-rf-muted">Total due today</p>
                  <p className="mt-2 text-4xl font-bold text-rf-text">${selectedPackage.price}</p>
                </div>
                
                {clientSecret ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ clientSecret, appearance: { theme: 'night' } }}
                  >
                    <StripeCheckoutForm 
                      orderData={{
                        packageId: draft.packageId,
                        packageName: selectedPackage.name,
                        totalPrice: selectedPackage.price,
                        website: draft.website,
                        target: draft.target,
                        keywords: keywords,
                        location: draft.location,
                        language: draft.language,
                        device: draft.device,
                        trackingDays: draft.trackingDays,
                        frequency: draft.frequency,
                        notes: draft.notes,
                        engine: 'google',
                        orderType: 'ranking'
                      }}
                      onSuccess={() => {
                        window.localStorage.removeItem(DRAFT_KEY);
                        window.location.assign(`/payment-success`); 
                      }}
                      onError={(err) => setError(err)}
                    />
                  </Elements>
                ) : (
                  <p className="text-sm text-rf-muted mt-4">Loading secure payment form...</p>
                )}
                {paymentError && <p className="mt-3 text-sm text-rf-danger">{paymentError}</p>}
              </section>
            )}

            {error && <p role="alert" className="mt-6 rounded-lg border border-rf-danger/40 bg-rf-danger/10 p-3 text-sm text-rf-danger">{error}</p>}
            
            {step !== 4 && (
              <div className="mt-8 flex justify-between gap-3 border-t border-rf-border pt-5">
                <Button variant="ghost" onClick={() => { setError(''); setStep((current) => Math.max(0, current - 1)) }} disabled={step === 0}>Back</Button>
                <Button onClick={continueStep}>Continue</Button>
              </div>
            )}
            {step === 4 && (
              <div className="mt-8 flex justify-start gap-3 border-t border-rf-border pt-5">
                <Button variant="ghost" onClick={() => { setError(''); setStep((current) => Math.max(0, current - 1)) }}>Back</Button>
              </div>
            )}
          </Card>
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start"><Card className="p-6"><h2 className="text-lg font-semibold text-rf-text">Order summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-rf-muted">Package</span><span className="text-rf-text">{selectedPackage.name}</span></div><div className="flex justify-between"><span className="text-rf-muted">Keyword allowance</span><span className="text-rf-text">{selectedPackage.keywords}</span></div><div className="flex justify-between"><span className="text-rf-muted">Baseline research</span><span className="text-rf-success">Included</span></div><div className="border-t border-rf-border pt-4"><span className="text-rf-muted">Total</span><p className="mt-1 text-3xl font-bold text-rf-text">${selectedPackage.price}</p></div></div><p className="mt-5 text-xs leading-relaxed text-rf-muted">Rank positions fluctuate and depend on factors outside Rankfasta’s control. You can review everything before payment.</p></Card><Card className="p-5"><p className="text-sm font-semibold text-rf-text">Need help?</p><p className="mt-2 text-sm leading-relaxed text-rf-muted">Talk to your specialist about keyword selection and location targeting.</p></Card></aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default GoogleRankingOrder