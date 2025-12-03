import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getById } from '../../services/emotions'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

export default function EmotionDetails(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [entry, setEntry] = useState(null)

  useEffect(()=>{ getById(id).then(e=>{ setEntry(e); setLoading(false) }).catch(()=>setLoading(false)) },[id])

  if(loading) return <Loader />
  if(!entry) return <div className="container">Not found</div>

  return (
    <div className="container">
      <Card>
        <h2 className="text-xl font-semibold">{entry.emotion}</h2>
        <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleString()}</div>
        <p className="mt-2">Intensity: {entry.intensity}</p>
        <p className="mt-2">{entry.note}</p>
      </Card>
    </div>
  )
}
