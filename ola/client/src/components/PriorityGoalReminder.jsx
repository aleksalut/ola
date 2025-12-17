import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../services/goals'

export default function PriorityGoalReminder() {
  const [topGoal, setTopGoal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAll()
      .then(goals => {
        // Filter active goals (not completed or archived)
        const activeGoals = goals.filter(g => 
          g.status !== 2 && g.status !== 'Completed' && 
          g.status !== 3 && g.status !== 'Archived'
        )
        
        if (activeGoals.length === 0) {
          setTopGoal(null)
          setLoading(false)
          return
        }
        
        // Sort by priority (High = 2, Medium = 1, Low = 0)
        const priorityOrder = { 2: 3, 'High': 3, 1: 2, 'Medium': 2, 0: 1, 'Low': 1 }
        activeGoals.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0))
        setTopGoal(activeGoals[0])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

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

  if (loading || !topGoal) return null

  const timeInfo = formatTimeLeft(topGoal.deadline)
  const priorityLabel = getPriorityLabel(topGoal.priority)

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden rounded-2xl p-1 shadow-lg" style={{ background: 'linear-gradient(to right, #3B82F6, #6366F1)' }}>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">YOUR PRIORITY GOAL</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  priorityLabel === 'High' ? 'bg-red-100 text-red-700' : 
                  priorityLabel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {priorityLabel}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-2">
                {topGoal.title}
              </h3>
              {timeInfo && (
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  timeInfo.urgent ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {timeInfo.text}
                </div>
              )}
              {topGoal.whyReason && (
                <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">YOUR MOTIVATION</p>
                  <p className="text-gray-700 dark:text-gray-300 italic">{topGoal.whyReason}</p>
                </div>
              )}
            </div>
            <Link to={`/goals/${topGoal.id}`} className="flex-shrink-0">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity">
                View Goal
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
