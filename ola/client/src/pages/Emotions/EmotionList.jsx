import { useEffect, useState } from 'react'
import { getAll } from '../../services/emotions'
import Card from '../../components/Card'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { Link } from 'react-router-dom'

export default function EmotionList(){
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(()=>{ getAll().then(d=>{ setItems(d); setLoading(false) }).catch(()=>setLoading(false)) },[])

  if(loading) return <Loader />
  if(items.length===0) return <EmptyState title="No entries yet" message="Create your first emotion entry" />

  return (
    <div className="container">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Emotion Journal</h2>
          <Link to="/emotions/create" className="btn">New Entry</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(e=> (
            <div key={e.id} className="card p-4">
              <div className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</div>
              <h3 className="text-lg font-semibold">{e.emotion}</h3>
              <p className="text-gray-600">Intensity: {e.intensity}</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/emotions/${e.id}`} className="btn outline">View</Link>
                <Link to={`/emotions/${e.id}/edit`} className="btn">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
