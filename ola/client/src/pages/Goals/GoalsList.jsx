import { useEffect, useState } from 'react'
import { getAll, remove } from '../../services/goals'
import Card from '../../components/Card'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'
import PriorityBadge from '../../components/PriorityBadge'
import StatusTag from '../../components/StatusTag'

export default function GoalsList(){
  const [items, setItems] = useState([])
  useEffect(()=>{ getAll().then(setItems) },[])
  const del = async(id)=>{ await remove(id); setItems(prev=>prev.filter(x=>x.id!==id)) }
  const short = (t)=> (t||'').length>120 ? t.slice(0,120)+'…' : t || ''
  const daysLeft = (d)=> d? Math.ceil((new Date(d)-new Date())/(1000*60*60*24)) : null
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Goals</h2>
        <Link to="/goals/create"><Button>Add goal</Button></Link>
      </div>
      <Card>
        <ul className="space-y-4">
          {items.map(g=> (
            <li key={g.id} className="flex items-start justify-between">
              <div className="max-w-lg">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{g.title}</div>
                  <PriorityBadge priority={g.priority} />
                  <StatusTag status={g.status} />
                </div>
                <div className="text-sm text-gray-600 mt-1">{short(g.description)}</div>
                <div className="mt-2"><ProgressBar value={g.progressPercentage} /></div>
                {g.deadline && <div className="text-xs text-gray-500 mt-1">{daysLeft(g.deadline)} days left</div>}
              </div>
              <div className="flex gap-2">
                <Link to={`/goals/${g.id}`}><Button variant="outline">See details</Button></Link>
                <Button variant="secondary" onClick={()=>del(g.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
