import { useEffect, useState } from 'react'
import { getAll, remove } from '../../services/goals'
import Card from '../../components/Card'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'
import PriorityBadge from '../../components/PriorityBadge'
import StatusTag from '../../components/StatusTag'

export default function GoalsList(){
const [items, setItems] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

// Get the highest priority goal that is not completed
const getTopPriorityGoal = () => {
  const activeGoals = items.filter(g => g.status !== 2 && g.status !== 'Completed' && g.status !== 3 && g.status !== 'Archived')
  if (activeGoals.length === 0) return null
    
  // Priority: High (2) > Medium (1) > Low (0)
  const priorityOrder = { 2: 3, 'High': 3, 1: 2, 'Medium': 2, 0: 1, 'Low': 1 }
  activeGoals.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0))
  return activeGoals[0]
}

const formatTimeLeft = (deadline) => {
  if (!deadline) return null
  const now = new Date()
  const end = new Date(deadline)
  const diffMs = end - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
  if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, urgent: true }
  if (diffDays === 0) return { text: 'Due today!', urgent: true }
  if (diffDays === 1) return { text: '1 day left', urgent: true }
  if (diffDays <= 7) return { text: `${diffDays} days left`, urgent: true }
  if (diffDays <= 30) return { text: `${diffDays} days left`, urgent: false }
  const weeks = Math.floor(diffDays / 7)
  return { text: `${weeks} weeks left`, urgent: false }
}

const getPriorityLabel = (priority) => {
  const labels = { 0: 'Low', 1: 'Medium', 2: 'High', 'Low': 'Low', 'Medium': 'Medium', 'High': 'High' }
  return labels[priority] || 'Medium'
}

  useEffect(()=>{
    getAll()
      .then(setItems)
      .catch(err => setError(err?.userMessage || err?.response?.data?.error || 'Failed to load goals'))
      .finally(()=>setLoading(false))
  },[])

  const del = async(id)=>{
    if (!window.confirm('Are you sure you want to delete this goal?')) return
    try {
      await remove(id)
      setItems(prev=>prev.filter(x=>x.id!==id))
    } catch(err) {
      setError(err?.userMessage || err?.response?.data?.error || 'Failed to delete goal')
    }
  }

  const short = (t)=> (t||'').length>120 ? t.slice(0,120)+'…' : t || ''
  const daysLeft = (d)=> {
    if (!d) return null
    const days = Math.ceil((new Date(d)-new Date())/(1000*60*60*24))
    return days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`
  }

  if (loading) return <div className="container">Loading...</div>
  if (error) return (
    <div className="container">
      <div className="text-red-600 text-sm mb-4">{error}</div>
      <Card><div className="p-4">Try again later or check your connection.</div></Card>
    </div>
  )

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Goals</h2>
        <Link to="/goals/create"><Button>Add goal</Button></Link>
      </div>
      <Card>
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-lg mb-2">No goals yet</p>
            <p className="text-sm">Create your first goal to get started!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map(g=> (
              <li key={g.id} className="flex items-start justify-between">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{g.title}</div>
                    <PriorityBadge priority={g.priority} />
                    <StatusTag status={g.status} />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{short(g.description)}</div>
                  <div className="mt-2"><ProgressBar value={g.progressPercentage} /></div>
                  {g.deadline && <div className="text-xs text-gray-500 mt-1">{daysLeft(g.deadline)}</div>}
                </div>
                <div className="flex gap-2">
                  <Link to={`/goals/${g.id}`}><Button variant="outline">See details</Button></Link>
                  <Button variant="secondary" onClick={()=>del(g.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Priority Reminder Card */}
      {(() => {
        const topGoal = getTopPriorityGoal()
        if (!topGoal) return null
        const timeInfo = formatTimeLeft(topGoal.deadline)
        const priorityLabel = getPriorityLabel(topGoal.priority)
        // Use consistent blue gradient for all priorities
        const gradientClass = 'from-blue-500 to-indigo-600'
        
        return (
          <div className="mt-8">
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradientClass} p-1 shadow-lg`}>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Priority Focus</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${priorityLabel === 'High' ? 'bg-red-100 text-red-700' : priorityLabel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {priorityLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-2">
                      {topGoal.title}
                    </h3>
                    {timeInfo && (
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-3 ${timeInfo.urgent ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {timeInfo.text}
                      </div>
                    )}
                    {topGoal.whyReason && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">Your Motivation</p>
                        <p className="text-gray-700 dark:text-gray-300 italic">"{topGoal.whyReason}"</p>
                      </div>
                    )}
                  </div>
                  <Link to={`/goals/${topGoal.id}`} className="flex-shrink-0">
                    <button className={`px-4 py-2 rounded-lg bg-gradient-to-r ${gradientClass} text-white font-medium hover:opacity-90 transition-opacity`}>
                      View Goal
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
