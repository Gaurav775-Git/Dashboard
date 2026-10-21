import { Link } from 'react-router-dom'
const NotFound = () => <div className="flex min-h-screen items-center justify-center bg-rf-bg text-center"><div><h1 className="text-5xl font-bold text-rf-text">404</h1><p className="mt-3 text-rf-muted">That page does not exist.</p><Link className="mt-6 inline-block text-rf-primary-light" to="/">Back to dashboard</Link></div></div>
export default NotFound
