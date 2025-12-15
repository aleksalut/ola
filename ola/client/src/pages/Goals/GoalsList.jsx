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
    </div>
  )
}
