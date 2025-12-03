import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getById } from '../../services/goals'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

export default function GoalDetails(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [goal, setGoal] = useState(null)

  useEffect(()=>{ getById(id).then(g=>{ setGoal(g); setLoading(false) }).catch(()=>setLoading(false)) },[id])

  if(loading) return <Loader />
  if(!goal) return <div className="container">Not found</div>

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold">{goal.title}</h2>
        <p className="text-gray-600 mt-2">{goal.description}</p>
        <div className="mt-4">Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '—'}</div>
        <div className="mt-2">Completed: {goal.completed ? 'Yes' : 'No'}</div>
      </Card>
    </div>
  )
}
