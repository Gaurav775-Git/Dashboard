const commonFields = [
  { id: 'target', label: 'Website, URL or profile', type: 'url', required: true, placeholder: 'https://yoursite.com/page' },
  { id: 'notes', label: 'Keywords or notes', type: 'textarea', placeholder: 'Target keywords, location, or anything we should know' },
]

const indexingFields = [
  { id: 'urls', label: 'URLs to index', type: 'list', required: true, placeholder: 'https://yoursite.com/page' },
  { id: 'priority', label: 'Priority', type: 'select', options: ['Standard', 'High'] },
]

const rankingFields = [
  { id: 'target', label: 'Website or landing page', type: 'url', required: true, placeholder: 'https://yoursite.com/page' },
  { id: 'keywords', label: 'Target keywords', type: 'keywords', required: true, placeholder: 'One keyword per line' },
  { id: 'location', label: 'Target location', type: 'text', placeholder: 'Country, city, or worldwide' },
]

const service = (id, name, category, price, eta, desc, template, metric, fields = commonFields, source = 'manual') => ({
  id, name, category, price, eta, desc, template, metric, fields, source,
})

export const SERVICES = [
  service('google-indexing', 'Google indexing', 'Indexing', 15, '3–7 days', 'Get new or updated URLs into Google’s index.', 'indexing', 'URLs indexed', indexingFields, 'auto'),
  service('bing-indexing', 'Bing indexing', 'Indexing', 12, '3–7 days', 'Get your URLs crawled and indexed by Bing.', 'indexing', 'URLs indexed', indexingFields, 'auto'),
  service('google-ranking', 'Google ranking', 'Ranking', 250, '30–60 days', 'Push target keywords up the Google results.', 'ranking', 'Average position', rankingFields),
  service('bing-ranking', 'Bing ranking', 'Ranking', 180, '30–60 days', 'Push target keywords up the Bing results.', 'ranking', 'Average position', rankingFields),
  service('amazon-ranking', 'Amazon ranking', 'Ranking', 300, '21–45 days', 'Lift product listings in Amazon search.', 'ranking', 'Average position', rankingFields),
  service('gbp-ranking', 'Google Business Profile setup & ranking', 'Ranking', 220, '14–30 days', 'Set up and rank your local listing in maps.', 'ranking', 'Map position', rankingFields),
  service('chatgpt-citations', 'ChatGPT recommendations & citations', 'AI visibility', 350, '30–45 days', 'Get your brand recommended and cited by ChatGPT.', 'ai-visibility', 'AI mentions', commonFields, 'auto'),
  service('gemini-recommendations', 'Gemini recommendations', 'AI visibility', 350, '30–45 days', 'Get your brand recommended in Gemini answers.', 'ai-visibility', 'AI mentions', commonFields, 'auto'),
  service('claude-citations', 'Claude recommendations & citations', 'AI visibility', 350, '30–45 days', 'Get your brand recommended and cited by Claude.', 'ai-visibility', 'AI mentions', commonFields, 'auto'),
  service('knowledge-panel', 'Google Knowledge Panel', 'Authority & content', 600, '30–90 days', 'Earn a Knowledge Panel for your brand or name.', 'authority', 'Milestones', commonFields),
  service('wiki-profile', 'Wiki bio & profile pages', 'Authority & content', 180, '7–14 days', 'Create bio and profile pages on trusted sites.', 'authority', 'Links delivered', commonFields),
  service('press-release', 'Press release', 'Authority & content', 140, '5–10 days', 'Written and distributed to news networks.', 'authority', 'Links delivered', commonFields),
  service('backlinks', 'Backlinks (DR 30+, 1k+ organic traffic)', 'Authority & content', 60, '14–30 days', 'Priced per link from vetted, high-traffic sites.', 'authority', 'Links delivered', commonFields),
  service('social-signals', 'Social signals', 'Traffic & signals', 40, '2–5 days', 'Shares and engagement that support your URLs.', 'traffic', 'Visits', commonFields, 'auto'),
  service('traffic-ctr', 'Direct traffic & organic CTR', 'Traffic & signals', 120, '14–30 days', 'Traffic and click-through signals for your pages.', 'traffic', 'Visits', commonFields, 'auto'),
  service('video-seo', 'YouTube & TikTok SEO', 'Traffic & signals', 160, '14–30 days', 'Optimise videos and channels for platform search.', 'traffic', 'Visits', commonFields),
  service('technical-audit', 'On-page SEO & technical audit', 'Audit', 200, '5–7 days', 'A full audit with a prioritised fix list.', 'audit', 'Issues resolved', commonFields),
]

export const getService = (serviceIdOrName) =>
  SERVICES.find((item) => item.id === serviceIdOrName || item.name === serviceIdOrName)
