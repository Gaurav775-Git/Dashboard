import { actions, campaigns, channels, kpis, serviceTiles, visibilityData } from '../data/dashboard'
import { api } from '../lib/api'

const defaultTasks = actions.map((item, index) => ({ ...item, id: `task-${index + 1}`, done: false, href: '/projects' }))

const mockDashboard = async () => ({
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

export const getDashboard = () => import.meta.env.VITE_USE_MOCK === 'false'
  ? api.get('/dashboard').then((response) => response.data.data)
  : mockDashboard()

export const updateTask = (id, done) => import.meta.env.VITE_USE_MOCK === 'false'
  ? api.patch(`/dashboard/tasks/${id}`, { done }).then((response) => response.data.data)
  : Promise.resolve({ id, done })
