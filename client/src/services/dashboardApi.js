import { actions, campaigns, channels, kpis, serviceTiles, visibilityData } from '../data/dashboard'

const defaultTasks = actions.map((item, index) => ({ ...item, id: `task-${index + 1}`, done: false, href: '/projects' }))

export const getDashboard = async () => ({
  overall: { score: visibilityData.at(-1), delta: 12.6, series: visibilityData },
  kpis,
  campaigns,
  channels,
  tasks: defaultTasks,
  notifications: [
    { id: 'notification-1', title: 'Your Google Ranking campaign improved', time: '2h ago', href: '/projects/google-ranking/ORD-1041', unread: true },
    { id: 'notification-2', title: 'A new audit finding needs review', time: 'Yesterday', href: '/projects/technical-audit/ORD-1037', unread: true },
  ],
  services: serviceTiles,
  totals: { services: 17 },
})

export const updateTask = async (id, done) => ({ id, done })
