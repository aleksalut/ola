import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById, update } from '../../services/habits'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

export default function HabitEdit(){
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(()=>{
    getById(id).then(h=>{ setName(h.name); setDescription(h.description||''); setLoading(false) }).catch(()=>setLoading(false))
  },[id])

  if(loading) return <Loader />

  const submit = async (e)=>{
    e.preventDefault()
    await update(id,{ name, description })
    nav('/habits')
  }

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Edit Habit</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Name" value={name} onChange={e=>setName(e.target.value)} />
          <Input label="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
