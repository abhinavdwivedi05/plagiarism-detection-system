import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiClipboard,
  FiGitMerge,
  FiHome,
  FiLogOut,
  FiMoon,
  FiSun,
  FiLayers,
  FiCheckSquare,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/submissions', icon: FiClipboard, label: 'Submissions' },
  { to: '/compare', icon: FiGitMerge, label: 'Compare' },
  { to: '/structural', icon: FiLayers, label: 'Structural Analysis' },
  { to: '/review', icon: FiCheckSquare, label: 'Review' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-background dark:bg-slate-900">
      <aside className="w-64 bg-secondary text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2">
            <FiBarChart2 className="text-primary text-2xl" />
            <span className="font-bold text-lg">PlagDetect</span>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Academic Integrity</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 truncate mb-2">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white w-full px-2 py-1"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between md:hidden">
          <span className="font-bold text-secondary dark:text-white">PlagDetect</span>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button onClick={handleLogout} className="p-2 text-danger">
              <FiLogOut />
            </button>
          </div>
        </header>
        <header className="hidden md:flex bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 items-center justify-between">
          <h1 className="text-lg font-semibold text-secondary dark:text-white">
            Faculty Portal
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-secondary dark:text-white"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          </button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around py-2 z-50">
        {navItems.slice(0, 4).map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `p-2 ${isActive ? 'text-primary' : 'text-slate-400'}`
            }
          >
            <Icon className="text-xl" />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
