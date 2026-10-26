import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import StripeCheckoutForm from '../components/StripeCheckoutForm'
import { initializePaystack, initializeFlutterwave, initializeCryptomus, createStripeIntent } from '../api/paymentsApi'

import stripeLogo from '../assets/Stripe-logo.png'
import paystackLogo from '../assets/Paystack-logo.png'
import flutterwaveLogo from '../assets/Flluterwave-logo.png'
import cryptomusLogo from '../assets/Cryptomus-logo.png'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const DRAFT_KEY = 'rankfasta-bing-indexing-draft'
const stages = ['Service', 'Requirements', 'Configuration', 'Review', 'Payment']
const packages = [
  { id: 'starter', name: 'Starter', allowance: 25, price: 35 },
  { id: 'growth', name: 'Growth', allowance: 100, price: 95 },
  { id: 'scale', name: 'Scale', allowance: 500, price: 280 },
]
const initialDraft = {
  packageId: 'starter', website: '', property: '', urls: '', sitemap: '',
  indexNowStatus: 'I need guided setup', market: 'United States', language: 'English',
  priority: 'Standard', trackingDays: '30', frequency: 'Weekly', consent: false,
}
const parseUrls = (value) => [...new Set(value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean))]

const BingIndexingOrder = () => {
  const { user } = useAuth()
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

  const [selectedGateway, setSelectedGateway] = useState('stripe')
  const [isPaystackLoading, setIsPaystackLoading] = useState(false)
  const [isFlutterwaveLoading, setIsFlutterwaveLoading] = useState(false)
  const [isCryptomusLoading, setIsCryptomusLoading] = useState(false)

  const selectedPackage = packages.find((item) => item.id === draft.packageId) || packages[0]
  const urls = useMemo(() => parseUrls(draft.urls), [draft.urls])
  const invalidUrls = urls.filter((url) => !/^https?:\/\/[^/\s]+\S*$/i.test(url))

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

  // Fetch Stripe Payment Intent
  useEffect(() => {
    if (step === 4) {
      createStripeIntent(selectedPackage.price, 'usd')
        .then(data => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret)
          } else {
            setPaymentError(data.error)
          }
        })
        .catch(err => setPaymentError('Failed to initialize Stripe payment'))
    }
  }, [step, selectedPackage.price])

  const handlePaystackPayment = async () => {
    setIsPaystackLoading(true)
    setPaymentError('')
    try {
      const tempOrderId = `PAY-${Date.now()}`
      const response = await initializePaystack(selectedPackage.price, user?.email || 'guest@example.com', tempOrderId)
      
      if (response.success && response.checkoutUrl) {
        window.localStorage.setItem('pending_payment_type', 'bing-indexing')
        window.localStorage.setItem('pending_payment_data', JSON.stringify({
            packageId: draft.packageId, packageName: selectedPackage.name, totalPrice: selectedPackage.price,
            website: draft.website, property: draft.property, propertyType: 'Domain',
            sitemap: draft.sitemap, urls: urls, locale: draft.market + ' · ' + draft.language, 
            priority: draft.priority, trackingDays: draft.trackingDays, frequency: draft.frequency, 
            notes: `IndexNow: ${draft.indexNowStatus}`, engine: 'bing'
        }))
        window.location.href = response.checkoutUrl
      }
    } catch (err) {
      setPaymentError('Failed to connect to Paystack. Please try again.')
      setIsPaystackLoading(false)
    }
  }

  const handleFlutterwavePayment = async () => {
    setIsFlutterwaveLoading(true)
    setPaymentError('')
    try {
      const tempOrderId = `FLW-${Date.now()}`
      const response = await initializeFlutterwave(selectedPackage.price, user?.email || 'guest@example.com', tempOrderId)
      
      if (response.success && response.checkoutUrl) {
        window.localStorage.setItem('pending_payment_type', 'bing-indexing')
        window.localStorage.setItem('pending_payment_data', JSON.stringify({
            packageId: draft.packageId, packageName: selectedPackage.name, totalPrice: selectedPackage.price,
            website: draft.website, property: draft.property, propertyType: 'Domain',
            sitemap: draft.sitemap, urls: urls, locale: draft.market + ' · ' + draft.language, 
            priority: draft.priority, trackingDays: draft.trackingDays, frequency: draft.frequency, 
            notes: `IndexNow: ${draft.indexNowStatus}`, engine: 'bing'
        }))
        window.location.href = response.checkoutUrl
      }
    } catch (err) {
      setPaymentError('Failed to connect to Flutterwave. Please try again.')
      setIsFlutterwaveLoading(false)
    }
  }

  const handleCryptomusPayment = async () => {
    setIsCryptomusLoading(true)
    setPaymentError('')
    try {
      const tempOrderId = `CRY-${Date.now()}`
      const response = await initializeCryptomus(selectedPackage.price, user?.email || 'guest@example.com', tempOrderId)
      
      if (response.success && response.checkoutUrl) {
        window.localStorage.setItem('pending_payment_type', 'bing-indexing')
        window.localStorage.setItem('pending_payment_data', JSON.stringify({
            packageId: draft.packageId, packageName: selectedPackage.name, totalPrice: selectedPackage.price,
            website: draft.website, property: draft.property, propertyType: 'Domain',
            sitemap: draft.sitemap, urls: urls, locale: draft.market + ' · ' + draft.language, 
            priority: draft.priority, trackingDays: draft.trackingDays, frequency: draft.frequency, 
            notes: `IndexNow: ${draft.indexNowStatus}`, engine: 'bing'
        }))
        window.location.href = response.checkoutUrl
      }
    } catch (err) {
      setPaymentError('Failed to connect to Cryptomus. Please try again.')
      setIsCryptomusLoading(false)
    }
  }

  const continueStep = () => {
    if (step === 1 && (!draft.website || !draft.property || !urls.length)) {
      setError('Add your website, verified Bing property, and at least one URL.')
      return
    }
    if (step === 1 && invalidUrls.length) {
      setError('Fix malformed URLs before continuing.')
      return
    }
    if (step === 3 && !draft.consent) {
      setError('Acknowledge the Bing indexing disclaimer to continue.')
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
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-rf-muted">Projects / Bing indexing</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-rf-text md:text-4xl">New campaign — Bing indexing</h1><p className="mt-2 text-base text-rf-muted">Submit URLs through Bing Webmaster Tools and monitor crawl signals.</p></div><div className="flex items-center gap-3"><span className="text-xs text-rf-muted" aria-live="polite">{saved}</span><Button variant="secondary" onClick={() => window.location.assign('/')}>Save & exit</Button></div></header>
        <Card className="mb-6 overflow-x-auto p-5"><div className="flex min-w-[650px] items-center">{stages.map((label, index) => <div key={label} className="flex flex-1 items-center"><div className={`flex items-center gap-2 text-sm font-semibold ${index <= step ? 'text-rf-text' : 'text-rf-muted'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${index < step ? 'border-rf-primary bg-rf-primary text-rf-text' : index === step ? 'border-rf-primary text-rf-text' : 'border-rf-border'}`}>{index < step ? '✓' : index + 1}</span>{label}</div>{index < stages.length - 1 && <div className={`mx-3 h-px flex-1 ${index < step ? 'bg-rf-primary' : 'bg-rf-border'}`} />}</div>)}</div></Card>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
          <Card className="p-6">
            {step === 0 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 1</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Choose your package</h2><p className="mt-2 text-sm text-rf-muted">All packages include a Bing property check and IndexNow readiness review.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{packages.map((item) => <button type="button" key={item.id} onClick={() => update('packageId', item.id)} className={`rounded-xl border p-4 text-left ${draft.packageId === item.id ? 'border-rf-primary bg-rf-primary/10' : 'border-rf-border bg-rf-surface-soft'}`}><p className="font-semibold text-rf-text">{item.name}</p><p className="mt-2 text-2xl font-bold text-rf-text">${item.price}</p><p className="mt-1 text-xs text-rf-muted">{item.allowance} URLs</p><p className="mt-3 text-xs text-rf-muted">Crawl monitoring included.</p></button>)}</div></section>}
            {step === 1 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 2</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Connect your Bing property</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-rf-text">Website URL<input value={draft.website} onChange={(event) => update('website', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com" /></label><label className="text-sm font-medium text-rf-text">Verified Bing property<input value={draft.property} onChange={(event) => update('property', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com" /></label></div><label className="mt-5 block text-sm font-medium text-rf-text">URLs to submit <span className="font-normal text-rf-muted">(one per line or comma-separated)</span><textarea rows="7" value={draft.urls} onChange={(event) => update('urls', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com/new-page" /><span className="mt-2 block text-xs text-rf-muted">{urls.length} URL{urls.length === 1 ? '' : 's'} added · allowance {selectedPackage.allowance}</span></label>{invalidUrls.length > 0 && <p className="mt-3 text-sm text-rf-danger">Malformed URL: {invalidUrls[0]}</p>}<div className="mt-5 rounded-xl border border-rf-border bg-rf-surface-soft p-4"><p className="text-sm font-semibold text-rf-text">IndexNow setup</p><p className="mt-2 text-sm leading-relaxed text-rf-muted">We’ll guide you through placing a verification key file on your site. Never paste an IndexNow secret into this form.</p><select value={draft.indexNowStatus} onChange={(event) => update('indexNowStatus', event.target.value)} className="mt-3 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm"><option>I need guided setup</option><option>Key file is already hosted</option><option>Not using IndexNow</option></select></div></section>}
            {step === 2 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 3</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Configure monitoring</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{[['market', 'Target market', ['United States', 'United Kingdom', 'India', 'Worldwide']], ['language', 'Language', ['English', 'Spanish', 'French']], ['priority', 'Processing priority', ['Standard', 'High']], ['trackingDays', 'Tracking duration', ['30', '60', '90']], ['frequency', 'Report frequency', ['Weekly', 'Daily']]].map(([key, label, options]) => <label key={key} className="text-sm font-medium text-rf-text">{label}<select value={draft[key]} onChange={(event) => update(key, event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm">{options.map((option) => <option key={option} value={option}>{key === 'trackingDays' ? `${option} days` : option}</option>)}</select></label>)}</div><label className="mt-5 block text-sm font-medium text-rf-text">Sitemap URL (optional)<input value={draft.sitemap} onChange={(event) => update('sitemap', event.target.value)} className="mt-2 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-3 text-sm" placeholder="https://yoursite.com/sitemap.xml" /></label></section>}
            {step === 3 && <section><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 4</p><h2 className="mt-2 text-xl font-semibold text-rf-text">Review your campaign</h2><dl className="mt-6 grid gap-4 rounded-xl bg-rf-surface-soft p-5 text-sm sm:grid-cols-2"><div><dt className="text-rf-muted">Package</dt><dd className="mt-1 text-rf-text">{selectedPackage.name} · {selectedPackage.allowance} URLs</dd></div><div><dt className="text-rf-muted">Property</dt><dd className="mt-1 break-all text-rf-text">{draft.property || 'Not provided'}</dd></div><div><dt className="text-rf-muted">URLs submitted</dt><dd className="mt-1 text-rf-text">{urls.length}</dd></div><div><dt className="text-rf-muted">IndexNow</dt><dd className="mt-1 text-rf-text">{draft.indexNowStatus}</dd></div></dl><label className="mt-6 flex gap-3 text-sm text-rf-muted"><input type="checkbox" checked={draft.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1 accent-rf-primary" />I understand that Rankfasta submits and monitors URLs; Bing controls final indexing.</label></section>}
            
            {step === 4 && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Step 5</p>
                <h2 className="mt-2 text-xl font-semibold text-rf-text">Confirm payment</h2>
                <div className="mt-6 rounded-xl border border-rf-border bg-rf-surface-soft p-5 mb-8">
                  <p className="text-sm text-rf-muted">Total due today</p>
                  <p className="mt-2 text-4xl font-bold text-rf-text">${selectedPackage.price}</p>
                </div>
                
                <p className="text-sm font-medium text-rf-text mb-3">Select Payment Method</p>
                
                <div className="grid gap-3">
                  
                  {/* Stripe Card */}
                  <div 
                    onClick={() => setSelectedGateway('stripe')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                      selectedGateway === 'stripe' ? 'border-rf-primary bg-rf-primary/5 ring-1 ring-rf-primary' : 'border-rf-border bg-rf-bg hover:border-rf-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100 p-1.5">
                        <img src={stripeLogo} alt="Stripe" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-rf-text">Credit / Debit Card</p>
                        <p className="text-xs text-rf-muted">Powered by Stripe</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === 'stripe' ? 'border-rf-primary' : 'border-rf-muted'}`}>
                      {selectedGateway === 'stripe' && <div className="h-2.5 w-2.5 rounded-full bg-rf-primary" />}
                    </div>
                  </div>

                  {/* Paystack Card */}
                  <div 
                    onClick={() => setSelectedGateway('paystack')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                      selectedGateway === 'paystack' ? 'border-[#00C3F7] bg-[#00C3F7]/5 ring-1 ring-[#00C3F7]' : 'border-rf-border bg-rf-bg hover:border-rf-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100 p-1.5">
                        <img src={paystackLogo} alt="Paystack" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-rf-text">Paystack</p>
                        <p className="text-xs text-rf-muted">Africa & International</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === 'paystack' ? 'border-[#00C3F7]' : 'border-rf-muted'}`}>
                      {selectedGateway === 'paystack' && <div className="h-2.5 w-2.5 rounded-full bg-[#00C3F7]" />}
                    </div>
                  </div>

                  {/* Flutterwave Card */}
                  <div 
                    onClick={() => setSelectedGateway('flutterwave')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                      selectedGateway === 'flutterwave' ? 'border-[#F5A623] bg-[#F5A623]/5 ring-1 ring-[#F5A623]' : 'border-rf-border bg-rf-bg hover:border-rf-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100 p-1.5">
                        <img src={flutterwaveLogo} alt="Flutterwave" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-rf-text">Flutterwave</p>
                        <p className="text-xs text-rf-muted">Global Payments</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === 'flutterwave' ? 'border-[#F5A623]' : 'border-rf-muted'}`}>
                      {selectedGateway === 'flutterwave' && <div className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />}
                    </div>
                  </div>

                  {/* Cryptomus Card */}
                  <div 
                    onClick={() => setSelectedGateway('cryptomus')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                      selectedGateway === 'cryptomus' ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 ring-1 ring-[#8B5CF6]' : 'border-rf-border bg-rf-bg hover:border-rf-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100 p-1.5">
                        <img src={cryptomusLogo} alt="Cryptomus" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-rf-text">Cryptomus</p>
                        <p className="text-xs text-rf-muted">Crypto (BTC, ETH, USDT)</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === 'cryptomus' ? 'border-[#8B5CF6]' : 'border-rf-muted'}`}>
                      {selectedGateway === 'cryptomus' && <div className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />}
                    </div>
                  </div>

                </div>

                {/* Dynamic Payment Action Area */}
                <div className="mt-8 pt-6 border-t border-rf-border">
                  
                  {selectedGateway === 'stripe' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                          <StripeCheckoutForm 
                            orderData={{
                              packageId: draft.packageId, packageName: selectedPackage.name, totalPrice: selectedPackage.price,
                              website: draft.website, property: draft.property, propertyType: 'Domain',
                              sitemap: draft.sitemap, urls: urls, locale: draft.market + ' · ' + draft.language,
                              priority: draft.priority, trackingDays: draft.trackingDays, frequency: draft.frequency,
                              notes: `IndexNow: ${draft.indexNowStatus}`, engine: 'bing'
                            }}
                            onSuccess={() => {
                              window.localStorage.removeItem(DRAFT_KEY);
                              window.location.assign(`/payment-success`); 
                            }}
                            onError={(err) => setError(err)}
                          />
                        </Elements>
                      ) : (
                        <p className="text-sm text-rf-muted animate-pulse">Loading secure card form...</p>
                      )}
                    </div>
                  )}

                  {selectedGateway === 'paystack' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <button
                        onClick={handlePaystackPayment}
                        disabled={isPaystackLoading}
                        className="w-full rounded-lg bg-[#00C3F7] px-4 py-3 text-white font-semibold hover:bg-[#00b0e0] disabled:opacity-50 transition-colors flex flex-col items-center justify-center"
                      >
                        <span>{isPaystackLoading ? 'Redirecting to Paystack...' : `Pay with Paystack`}</span>
                        <span className="text-xs font-normal opacity-80 mt-1">
                          (Approx. ₦{(selectedPackage.price * 1500).toLocaleString()})
                        </span>
                      </button>
                    </div>
                  )}

                  {selectedGateway === 'flutterwave' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <button
                        onClick={handleFlutterwavePayment}
                        disabled={isFlutterwaveLoading}
                        className="w-full rounded-lg bg-[#F5A623] px-4 py-3 text-white font-semibold hover:bg-[#e0961f] disabled:opacity-50 transition-colors flex flex-col items-center justify-center"
                      >
                        <span>{isFlutterwaveLoading ? 'Redirecting to Flutterwave...' : `Pay with Flutterwave`}</span>
                        <span className="text-xs font-normal opacity-80 mt-1">
                          (Card, Bank Transfer, Mobile Money)
                        </span>
                      </button>
                    </div>
                  )}

                  {selectedGateway === 'cryptomus' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <button
                        onClick={handleCryptomusPayment}
                        disabled={isCryptomusLoading}
                        className="w-full rounded-lg bg-[#8B5CF6] px-4 py-3 text-white font-semibold hover:bg-[#7C3AED] disabled:opacity-50 transition-colors flex flex-col items-center justify-center"
                      >
                        <span>{isCryptomusLoading ? 'Redirecting to Cryptomus...' : `Pay with Cryptomus`}</span>
                        <span className="text-xs font-normal opacity-80 mt-1">
                          (BTC, ETH, USDT, etc.)
                        </span>
                      </button>
                    </div>
                  )}

                  {paymentError && <p className="mt-4 text-sm text-center text-rf-danger">{paymentError}</p>}
                </div>
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
          
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-rf-text">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3"><span className="text-rf-muted">Package</span><span className="text-rf-text">{selectedPackage.name}</span></div>
                <div className="flex justify-between gap-3"><span className="text-rf-muted">URL allowance</span><span className="text-rf-text">{selectedPackage.allowance}</span></div>
                <div className="flex justify-between gap-3"><span className="text-rf-muted">IndexNow review</span><span className="text-rf-success">Included</span></div>
                <div className="border-t border-rf-border pt-4"><span className="text-rf-muted">Total</span><p className="mt-1 text-3xl font-bold text-rf-text">${selectedPackage.price}</p></div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-rf-muted">Rankfasta submits and monitors URLs; Bing controls final indexing. You can review everything before payment.</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-semibold text-rf-text">Need help?</p>
              <p className="mt-2 text-sm leading-relaxed text-rf-muted">We can help verify ownership and safely host your IndexNow key file.</p>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default BingIndexingOrder