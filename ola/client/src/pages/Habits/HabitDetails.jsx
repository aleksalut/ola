import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getById, getProgress, getStreak } from '../../services/habits'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

const HABIT_FORMATION_DAYS = 66

export default function HabitDetails(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [habit, setHabit] = useState(null)
  const [progress, setProgress] = useState([])
  const [streak, setStreak] = useState(null)

  useEffect(()=>{
    Promise.all([
      getById(id), 
      getProgress(id),
      getStreak(id).catch(() => null)
    ])
      .then(([h,p,s])=>{ 
        setHabit(h); 
        setProgress(p); 
        setStreak(s?.currentStreak ?? null);
        setLoading(false) 
      })
      .catch(()=>setLoading(false))
  },[id])

  if(loading) return <Loader />
  if(!habit) return <div className="container">Not found</div>

  // Calculate 66-day progress
  const completedDays = progress.length
  const progressPercent = Math.min(100, Math.round((completedDays / HABIT_FORMATION_DAYS) * 100))
  const daysRemaining = Math.max(0, HABIT_FORMATION_DAYS - completedDays)

  return (
  <div className="container">
    {/* Scientific Quote Banner - Centered and Beautiful */}
    <div className="text-center mb-8">
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-2xl p-6 shadow-lg">
        <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed">
          "On average, it takes <span className="text-indigo-600 font-bold">66 days</span> before a new behavior becomes automatic."
        </p>
        <p className="text-sm text-gray-500 mt-3 italic">
          — Phillippa Lally, European Journal of Social Psychology
        </p>
      </div>
    </div>

    {/* Main Habit Card with Progress */}
    <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{habit.name}</h2>
            <p className="text-gray-600 mt-2">{habit.description}</p>
          </div>
          {streak !== null && streak > 0 && (
            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          )}
        </div>

        {/* 66-Day Progress Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Habit Formation Progress</h3>
            <span className="text-2xl font-bold text-indigo-600">{progressPercent}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>{completedDays} days completed</span>
            <span>{daysRemaining} days remaining</span>
          </div>

          {progressPercent >= 100 && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
              <span className="text-green-700 font-semibold">
                Congratulations! This habit is now part of your routine!
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            to={`/habits/${id}/progress`} 
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-center rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            + Mark Today Complete
          </Link>
          <Link to={`/habits/${id}/edit`} className="btn outline px-6">
            Edit
          </Link>
        </div>
      </Card>

      {/* Progress History */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Progress</h3>
        {progress.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-6">No progress entries yet. Start tracking today!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Show last 35 days as a calendar view */}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (34 - i))
              const dateStr = date.toISOString().split('T')[0]
              const hasProgress = progress.some(p => 
                new Date(p.date).toISOString().split('T')[0] === dateStr
              )
              const isToday = i === 34
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                    hasProgress 
                      ? 'bg-green-500 text-white' 
                      : isToday 
                        ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-300' 
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  title={date.toLocaleDateString()}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
