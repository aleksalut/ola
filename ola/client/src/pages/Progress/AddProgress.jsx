import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById, addProgress } from '../../services/habits'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Loader from '../../components/Loader'

export default function AddProgress(){
  const { id } = useParams()
  const nav = useNavigate()
  const [habit, setHabit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().substring(0,10))
  const [value, setValue] = useState(0)

  useEffect(()=>{ getById(id).then(h=>{ setHabit(h); setLoading(false) }).catch(()=>setLoading(false)) },[id])

  if(loading) return <Loader />
  if(!habit) return <div className="container">Not found</div>

  const submit = async (e)=>{
    e.preventDefault();
    await addProgress({ habitId: parseInt(id), date, value: parseInt(value) });
    nav(`/habits/${id}`)
  }

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Add Progress for {habit.name}</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <Input label="Value" type="number" value={value} onChange={e=>setValue(e.target.value)} />
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
