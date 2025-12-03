import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById, update } from '../../services/emotions'
import Input from '../../components/Input'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'

export default function EmotionEdit(){
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [emotion, setEmotion] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')

  useEffect(()=>{ getById(id).then(e=>{ setEmotion(e.emotion); setIntensity(e.intensity); setNote(e.note||''); setLoading(false) }).catch(()=>setLoading(false)) },[id])

  if(loading) return <Loader />

  const submit = async (e)=>{ e.preventDefault(); await update(id,{ emotion, intensity, note }); nav('/emotions') }

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Edit Emotion Entry</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Emotion" value={emotion} onChange={e=>setEmotion(e.target.value)} />
          <Input label="Intensity" type="number" value={intensity} onChange={e=>setIntensity(e.target.value)} />
          <Input label="Note" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
