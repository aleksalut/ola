import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById, updateProgress } from '../../services/goals'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'

export default function GoalProgress(){
  const { id } = useParams()
  const nav = useNavigate()
  const [goal, setGoal] = useState(null)
  const [progress, setProgress] = useState(0)
  useEffect(()=>{ getById(id).then(g=>{ setGoal(g); setProgress(g.progressPercentage||0) }) },[id])
  const submit = async (e)=>{ e.preventDefault(); await updateProgress(id, progress); nav(`/goals/${id}`) }
  if(!goal) return <div className="container">Loading...</div>
  return (
    <div className="container max-w-md">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Update Progress for {goal.title}</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Progress (%)" type="number" value={progress} onChange={e=>setProgress(parseInt(e.target.value)||0)} />
          <div className="flex justify-end"><Button type="submit">Save</Button></div>
        </form>
      </Card>
    </div>
  )
}
