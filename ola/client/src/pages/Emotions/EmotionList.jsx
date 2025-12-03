import { useEffect, useState } from 'react'
import { getAll } from '../../services/emotions'
import Card from '../../components/Card'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import PriorityGoalReminder from '../../components/PriorityGoalReminder'
import { Link } from 'react-router-dom'

export default function EmotionList(){
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(()=>{ getAll().then(d=>{ setItems(d); setLoading(false) }).catch(()=>setLoading(false)) },[])

  if(loading) return <Loader />
  if(items.length===0) return (
    <div className="container">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Emotion Journal</h2>
          <Link to="/emotions/create" className="btn">New Entry</Link>
        </div>
        <EmptyState title="No entries yet" message="Create your first emotion entry" />
      </Card>
      
      {/* Priority Goal Reminder */}
      <PriorityGoalReminder />
    </div>
  )

  return (
    <div className="container">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Emotion Journal</h2>
          <Link to="/emotions/create" className="btn">New Entry</Link>
        </div>
        <div className="space-y-4">
          {items.map(e=> (
            <div key={e.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm text-gray-500">
                  {new Date(e.createdAt || e.date).toLocaleString()}
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{e.text || e.note}</p>
              
              {/* Emotion Scales Display */}
              {(e.anxiety || e.calmness || e.joy || e.anger || e.boredom) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {e.anxiety && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Anxiety: {e.anxiety}/5</span>}
                  {e.calmness && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Calmness: {e.calmness}/5</span>}
                  {e.joy && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Joy: {e.joy}/5</span>}
                  {e.anger && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Anger: {e.anger}/5</span>}
                  {e.boredom && <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Boredom: {e.boredom}/5</span>}
                </div>
              )}
              
              <div className="flex gap-2">
                <Link to={`/emotions/${e.id}`} className="btn outline">View</Link>
                <Link to={`/emotions/${e.id}/edit`} className="btn">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Priority Goal Reminder */}
      <PriorityGoalReminder />
    </div>
  )
}
