import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getById } from '../../services/habits'
import api from '../../services/api'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'

export default function HabitProgress() {
  const { id } = useParams()
  const nav = useNavigate()
  const [habit, setHabit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getById(id)
      .then(h => {
        setHabit(h)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const markDayComplete = async () => {
    setSaving(true)
    setError('')
    try {
      await api.post('/progress', {
        habitId: parseInt(id),
        date: new Date().toISOString(),
        value: 1
      })
      setSuccess(true)
      setTimeout(() => nav(`/habits/${id}`), 1500)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save progress')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader />
  if (!habit) return <div className="container">Habit not found</div>

  return (
    <div className="container max-w-xl mx-auto py-8">
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{habit.name}</h2>
          <p className="text-gray-600 mb-6">{habit.description}</p>

          {success ? (
            <div className="py-8">
              <div className="text-6xl mb-4">&#10003;</div>
              <p className="text-xl font-semibold text-green-600">Day completed!</p>
              <p className="text-gray-500 mt-2">Redirecting...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="py-8">
                <p className="text-gray-600 mb-4">Did you complete this habit today?</p>
                <button
                  onClick={markDayComplete}
                  disabled={saving}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-5xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
                >
                  {saving ? '...' : '+'}
                </button>
                <p className="text-sm text-gray-500 mt-4">Click to mark today as complete</p>
              </div>

              <div className="flex justify-center gap-3 pt-4 border-t">
                <Link to={`/habits/${id}`} className="btn outline">
                  Back to Habit
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
