// Mock data — swap these for real API calls later (e.g. api/orders.js)

export const CATEGORIES = [
  'Indexing',
  'Ranking',
  'AI visibility',
  'Authority & content',
  'Traffic & signals',
  'Audit',
]

export const SERVICES = [
  { id: 1, name: 'Google indexing', category: 'Indexing', price: 15, eta: '3–7 days', desc: 'Get new or updated URLs into Google’s index.' },
  { id: 2, name: 'Bing indexing', category: 'Indexing', price: 12, eta: '3–7 days', desc: 'Get your URLs crawled and indexed by Bing.' },
  { id: 3, name: 'Google ranking', category: 'Ranking', price: 250, eta: '30–60 days', desc: 'Push target keywords up the Google results.' },
  { id: 4, name: 'Bing ranking', category: 'Ranking', price: 180, eta: '30–60 days', desc: 'Push target keywords up the Bing results.' },
  { id: 8, name: 'Amazon ranking', category: 'Ranking', price: 300, eta: '21–45 days', desc: 'Lift product listings in Amazon search.' },
  { id: 16, name: 'Google Business Profile setup & ranking', category: 'Ranking', price: 220, eta: '14–30 days', desc: 'Set up and rank your local listing in maps.' },
  { id: 5, name: 'ChatGPT recommendations & citations', category: 'AI visibility', price: 350, eta: '30–45 days', desc: 'Get your brand recommended and cited by ChatGPT.' },
  { id: 6, name: 'Gemini recommendations', category: 'AI visibility', price: 350, eta: '30–45 days', desc: 'Get your brand recommended in Gemini answers.' },
  { id: 15, name: 'Claude recommendations & citations', category: 'AI visibility', price: 350, eta: '30–45 days', desc: 'Get your brand recommended and cited by Claude.' },
  { id: 7, name: 'Google Knowledge Panel', category: 'Authority & content', price: 600, eta: '30–90 days', desc: 'Earn a Knowledge Panel for your brand or name.' },
  { id: 11, name: 'Wiki bio & profile pages', category: 'Authority & content', price: 180, eta: '7–14 days', desc: 'Create bio and profile pages on trusted sites.' },
  { id: 12, name: 'Press release', category: 'Authority & content', price: 140, eta: '5–10 days', desc: 'Written and distributed to news networks.' },
  { id: 13, name: 'Backlinks (DR 30+, 1k+ organic traffic)', category: 'Authority & content', price: 60, eta: '14–30 days', desc: 'Priced per link from vetted, high-traffic sites.' },
  { id: 9, name: 'Social signals', category: 'Traffic & signals', price: 40, eta: '2–5 days', desc: 'Shares and engagement that support your URLs.' },
  { id: 14, name: 'Direct traffic & organic CTR', category: 'Traffic & signals', price: 120, eta: '14–30 days', desc: 'Traffic and click-through signals for your pages.' },
  { id: 17, name: 'YouTube & TikTok SEO', category: 'Traffic & signals', price: 160, eta: '14–30 days', desc: 'Optimise videos and channels for platform search.' },
  { id: 10, name: 'On-page SEO & technical audit', category: 'Audit', price: 200, eta: '5–7 days', desc: 'A full audit with a prioritised fix list.' },
]

export const STATUSES = ['Pending', 'In progress', 'Completed', 'Needs info']

export const INITIAL_ORDERS = [
  { id: 'ORD-1041', service: 'Google ranking', target: 'acme.com/pricing', date: '2026-10-14', status: 'In progress', progress: 35, amount: 500 },
  { id: 'ORD-1040', service: 'ChatGPT recommendations & citations', target: 'acme.com', date: '2026-10-12', status: 'In progress', progress: 60, amount: 350 },
  { id: 'ORD-1039', service: 'Backlinks (DR 30+, 1k+ organic traffic)', target: 'acme.com/blog/seo-guide', date: '2026-10-10', status: 'Needs info', progress: 20, amount: 600 },
  { id: 'ORD-1038', service: 'Google indexing', target: 'acme.com/new-collection', date: '2026-10-08', status: 'Completed', progress: 100, amount: 45 },
  { id: 'ORD-1037', service: 'On-page SEO & technical audit', target: 'acme.com', date: '2026-10-05', status: 'Completed', progress: 100, amount: 200 },
  { id: 'ORD-1036', service: 'Press release', target: 'Acme launches Studio', date: '2026-10-03', status: 'Pending', progress: 0, amount: 140 },
  { id: 'ORD-1035', service: 'Google Business Profile setup & ranking', target: 'Acme Studio, Kanpur', date: '2026-09-28', status: 'Completed', progress: 100, amount: 220 },
  { id: 'ORD-1034', service: 'Social signals', target: 'acme.com/blog/launch', date: '2026-09-25', status: 'Completed', progress: 100, amount: 120 },
]

// Orders completed per week (last 12 weeks)
export const WEEKLY_COMPLETED = [1, 2, 2, 4, 3, 5, 4, 6, 5, 7, 6, 9]