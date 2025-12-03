import { useState } from 'react'
import { create } from '../../services/goals'
import Input from '../../components/Input'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export default function GoalCreate(){
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('Medium')

  const submit = async (e)=>{
    e.preventDefault();
    await create({ title, description, deadline, priority })
    nav('/goals')
  }

  return (
    <div className="container max-w-lg">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Create Goal</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Input label="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <Input label="Deadline" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} />
          <div>
            <label className="label">Priority</label>
            <select className="input" value={priority} onChange={e=>setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
