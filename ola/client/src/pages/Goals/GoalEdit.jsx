import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById, update } from '../../services/goals'
import Input from '../../components/Input'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'

export default function GoalEdit(){
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [whyReason, setWhyReason] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('NotStarted')
  const [error, setError] = useState('')

  useEffect(()=>{ getById(id).then(g=>{ setTitle(g.title); setDescription(g.description||''); setWhyReason(g.whyReason||''); setDeadline(g.deadline?g.deadline.substring(0,10):''); setPriority(g.priority); setStatus(g.status); setLoading(false) }).catch(()=>setLoading(false)) },[id])

  if(loading) return <Loader />

  const submit = async (e)=>{
    e.preventDefault();
    setError('');
    if (!whyReason.trim()) {
      setError('Please explain why you want to achieve this goal!');
      return;
    }
    await update(id,{ title, description, whyReason, deadline, priority, status });
    nav('/goals')
  }

  return (
    <div className="container max-w-lg">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Edit Goal</h2>
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input label="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <Input label="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <div>
            <label className="label">Why do you want to achieve this goal? <span className="text-red-500">*</span></label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={whyReason}
              onChange={e=>setWhyReason(e.target.value)}
              placeholder="Describe your motivation..."
              required
            />
          </div>
          <Input label="Deadline" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} />
          <div>
            <label className="label">Priority</label>
            <select className="input" value={priority} onChange={e=>setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
              <option>NotStarted</option>
              <option>InProgress</option>
              <option>Completed</option>
              <option>Archived</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
