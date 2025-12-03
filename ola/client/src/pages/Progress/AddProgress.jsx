import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getById, addProgress, getProgress } from '../../services/habits'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

const HABIT_FORMATION_DAYS = 66

export default function AddProgress(){
  const { id } = useParams()
  const nav = useNavigate()
  const [habit, setHabit] = useState(null)
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)

  useEffect(()=>{ 
    Promise.all([getById(id), getProgress(id)])
      .then(([h, p])=>{ 
        setHabit(h)
        setProgress(p)
        
        // Check if today is already marked
        const today = new Date().toISOString().split('T')[0]
        const todayDone = p.some(entry => 
          new Date(entry.date).toISOString().split('T')[0] === today
        )
        setAlreadyDone(todayDone)
        setLoading(false) 
      })
      .catch(()=>setLoading(false)) 
  },[id])

  if(loading) return <Loader />
  if(!habit) return <div className="container">Not found</div>

  const completedDays = progress.length
  const progressPercent = Math.min(100, Math.round((completedDays / HABIT_FORMATION_DAYS) * 100))

  const markDayComplete = async () => {
    setSaving(true)
    setError('')
    try {
      await addProgress({ 
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

  return (
  <div className="container max-w-xl mx-auto py-8">
    {/* Scientific Quote - Centered and Beautiful */}
    <div className="text-center mb-8 px-4">
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-2xl p-8 shadow-lg">
        <div className="text-5xl text-indigo-300 mb-4">"</div>
        <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed">
          On average, it takes <span className="text-indigo-600 font-bold">66 days</span> before a new behavior becomes automatic.
        </p>
        <p className="text-sm text-gray-500 mt-4 italic">
          — Phillippa Lally, European Journal of Social Psychology
        </p>
      </div>
    </div>

    <Card>
      <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{habit.name}</h2>
          
          {/* Progress indicator */}
          <div className="my-6">
            <div className="text-5xl font-bold text-indigo-600 mb-2">{progressPercent}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {completedDays} of {HABIT_FORMATION_DAYS} days completed
            </p>
          </div>

          {success ? (
            <div className="py-8">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-green-600">&#10003;</span>
              </div>
              <p className="text-xl font-semibold text-green-600">Day completed!</p>
              <p className="text-gray-500 mt-2">Great job! Keep going!</p>
            </div>
          ) : alreadyDone ? (
            <div className="py-8">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-green-600">&#10003;</span>
              </div>
              <p className="text-xl font-semibold text-green-600">Today is already marked!</p>
              <p className="text-gray-500 mt-2">Come back tomorrow to continue your streak.</p>
              <Link to={`/habits/${id}`} className="btn mt-6">
                Back to Habit
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="py-6">
                <p className="text-gray-600 mb-6">Did you practice this habit today?</p>
                <button
                  onClick={markDayComplete}
                  disabled={saving}
                  className="w-36 h-36 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-6xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 mx-auto block"
                >
                  {saving ? '...' : '+'}
                </button>
                <p className="text-sm text-gray-500 mt-4">Tap to mark today as complete</p>
              </div>

              <div className="pt-4 border-t">
                <Link to={`/habits/${id}`} className="text-indigo-600 hover:text-indigo-800">
                  ? Back to Habit Details
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
