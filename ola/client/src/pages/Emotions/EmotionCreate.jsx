import { useState } from 'react'
import { create } from '../../services/emotions'
import Input from '../../components/Input'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export default function EmotionCreate(){
  const nav = useNavigate()
  const [emotion, setEmotion] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().substring(0,10))

  const submit = async (e)=>{
    e.preventDefault();
    await create({ emotion, intensity: parseInt(intensity), note, date })
    nav('/emotions')
  }

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold mb-4">New Emotion Entry</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <Input label="Emotion" value={emotion} onChange={e=>setEmotion(e.target.value)} />
          <Input label="Intensity" type="number" value={intensity} onChange={e=>setIntensity(e.target.value)} />
          <Input label="Note" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
