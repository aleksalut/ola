import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getById, getProgress, getStreak } from '../../services/habits'
import Card from '../../components/Card'
import Loader from '../../components/Loader'

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

  return (
    <div className="container">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{habit.name}</h2>
            <p className="text-gray-600 mt-2">{habit.description}</p>
          </div>
          {streak !== null && (
            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-600">Day Streak ??</div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link to={`/habits/${id}/progress`} className="btn">Add Progress</Link>
          <Link to={`/habits/${id}/edit`} className="btn outline ml-2">Edit</Link>
        </div>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Progress History</h3>
        {progress.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-6">No progress entries yet. Start tracking!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.map(p=> (
              <Card key={p.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</div>
                    <div className="text-2xl font-bold text-primary">{p.value}%</div>
                  </div>
                  <div className="text-4xl">
                    {p.value >= 80 ? '??' : p.value >= 50 ? '??' : '??'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
