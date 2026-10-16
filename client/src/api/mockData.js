// Mock data — swap these for real API calls later (e.g. api/orders.js)
import { SERVICES } from './services'

export const CATEGORIES = [
  'Indexing',
  'Ranking',
  'AI visibility',
  'Authority & content',
  'Traffic & signals',
  'Audit',
]

export { SERVICES }

export const STATUSES = ['Pending', 'In progress', 'Completed', 'Needs info']

export const INITIAL_ORDERS = [
  { id: 'ORD-1041', serviceId: 'google-ranking', service: 'Google ranking', target: 'acme.com/pricing', date: '2026-10-14', status: 'In progress', progress: 35, amount: 500, answers: { target: 'https://acme.com/pricing', keywords: ['seo tools', 'rank tracking'], location: 'United States' }, tracking: [{ date: '2026-10-14', value: 35, label: 'Started at position 35' }, { date: '2026-10-16', value: 24, label: 'Improving' }], notes: [{ author: 'Rankfasta team', text: 'We have started the first optimization pass.', date: '2026-10-15' }], source: 'manual' },
  { id: 'ORD-1040', serviceId: 'chatgpt-citations', service: 'ChatGPT recommendations & citations', target: 'acme.com', date: '2026-10-12', status: 'In progress', progress: 60, amount: 350, answers: { target: 'https://acme.com' }, tracking: [{ date: '2026-10-12', value: 3, label: 'Initial mentions' }, { date: '2026-10-16', value: 8, label: 'Growing visibility' }], notes: [], source: 'auto' },
  { id: 'ORD-1039', serviceId: 'backlinks', service: 'Backlinks (DR 30+, 1k+ organic traffic)', target: 'acme.com/blog/seo-guide', date: '2026-10-10', status: 'Needs info', progress: 20, amount: 600, answers: { target: 'https://acme.com/blog/seo-guide' }, tracking: [], notes: [{ author: 'Rankfasta team', text: 'Please confirm the preferred anchor text.', date: '2026-10-11' }], source: 'manual' },
  { id: 'ORD-1038', serviceId: 'google-indexing', service: 'Google indexing', target: 'acme.com/new-collection', date: '2026-10-08', status: 'Completed', progress: 100, amount: 45, answers: { urls: ['https://acme.com/new-collection'] }, tracking: [{ date: '2026-10-08', value: 1, label: 'Submitted' }, { date: '2026-10-12', value: 1, label: 'Indexed' }], notes: [], source: 'auto' },
  { id: 'ORD-1037', serviceId: 'technical-audit', service: 'On-page SEO & technical audit', target: 'acme.com', date: '2026-10-05', status: 'Completed', progress: 100, amount: 200, answers: { target: 'https://acme.com' }, tracking: [{ date: '2026-10-05', value: 18, label: 'Issues found' }, { date: '2026-10-10', value: 0, label: 'Issues resolved' }], notes: [], source: 'manual' },
  { id: 'ORD-1036', serviceId: 'press-release', service: 'Press release', target: 'Acme launches Studio', date: '2026-10-03', status: 'Pending', progress: 0, amount: 140, answers: { target: 'Acme launches Studio' }, tracking: [], notes: [], source: 'manual' },
  { id: 'ORD-1035', serviceId: 'gbp-ranking', service: 'Google Business Profile setup & ranking', target: 'Acme Studio, Kanpur', date: '2026-09-28', status: 'Completed', progress: 100, amount: 220, answers: { target: 'Acme Studio, Kanpur' }, tracking: [], notes: [], source: 'manual' },
  { id: 'ORD-1034', serviceId: 'social-signals', service: 'Social signals', target: 'acme.com/blog/launch', date: '2026-09-25', status: 'Completed', progress: 100, amount: 120, answers: { target: 'https://acme.com/blog/launch' }, tracking: [], notes: [], source: 'auto' },
]

// Orders completed per week (last 12 weeks)
export const WEEKLY_COMPLETED = [1, 2, 2, 4, 3, 5, 4, 6, 5, 7, 6, 9]