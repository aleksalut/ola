import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getById, remove } from '../../services/emotions'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'

export default function EmotionDetails(){
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [entry, setEntry] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(()=>{ getById(id).then(e=>{ setEntry(e); setLoading(false) }).catch(()=>setLoading(false)) },[id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry?')) return
    setDeleting(true)
    try {
      await remove(id)
      nav('/emotions')
    } catch (err) {
      alert('Failed to delete entry')
      setDeleting(false)
    }
  }

  if(loading) return <Loader />
  if(!entry) return <div className="container">Not found</div>

  return (
    <div className="container max-w-3xl">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              {new Date(entry.createdAt || entry.date).toLocaleString()}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Emotion Entry</h2>
          </div>
          <div className="flex gap-2">
            <Link to={`/emotions/${id}/edit`} className="btn">
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{entry.text || entry.note}</p>
        </div>

        {/* Emotion Scales */}
        {(entry.anxiety || entry.calmness || entry.joy || entry.anger || entry.boredom) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Emotion Scales</h3>
            <div className="space-y-3">
              {entry.anxiety && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-purple-900">😰 Anxiety</span>
                  <span className="text-purple-700 font-bold">{entry.anxiety}/5</span>
                </div>
              )}
              {entry.calmness && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">😌 Calmness</span>
                  <span className="text-blue-700 font-bold">{entry.calmness}/5</span>
                </div>
              )}
              {entry.joy && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-yellow-900">😊 Joy</span>
                  <span className="text-yellow-700 font-bold">{entry.joy}/5</span>
                </div>
              )}
              {entry.anger && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-red-900">😠 Anger</span>
                  <span className="text-red-700 font-bold">{entry.anger}/5</span>
                </div>
              )}
              {entry.boredom && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">😴 Boredom</span>
                  <span className="text-gray-700 font-bold">{entry.boredom}/5</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legacy fields display */}
        {entry.emotion && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Legacy: {entry.emotion} (Intensity: {entry.intensity})</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <Link to="/emotions" className="text-blue-600 hover:text-blue-800">
            ← Back to Emotion Journal
          </Link>
        </div>
      </Card>
    </div>
  )
}
