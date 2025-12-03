import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getById, getProgress } from '../../services/habits'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

export default function HabitDetails(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [habit, setHabit] = useState(null)
  const [progress, setProgress] = useState([])

  useEffect(()=>{
    Promise.all([getById(id), getProgress(id)])
      .then(([h,p])=>{ setHabit(h); setProgress(p); setLoading(false) })
      .catch(()=>setLoading(false))
  },[id])

  if(loading) return <Loader />
  if(!habit) return <div className="container">Not found</div>

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold">{habit.name}</h2>
        <p className="text-gray-600 mt-2">{habit.description}</p>
        <div className="mt-4">
          <Link to={`/habits/${id}/progress`} className="btn">Add Progress</Link>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {progress.map(p=> (
          <div key={p.id} className="card p-4">
            <div className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</div>
            <div className="text-lg font-semibold">Value: {p.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
