import { useState } from 'react'
import { create } from '../../services/emotions'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export default function EmotionCreate() {
  const nav = useNavigate()
  const [text, setText] = useState('')
  const [anxiety, setAnxiety] = useState('')
  const [calmness, setCalmness] = useState('')
  const [joy, setJoy] = useState('')
  const [anger, setAnger] = useState('')
  const [boredom, setBoredom] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!text.trim()) {
      setError('Please describe your emotions')
      return
    }

    setLoading(true)
    try {
      await create({
        text,
        anxiety: anxiety ? parseInt(anxiety) : null,
        calmness: calmness ? parseInt(calmness) : null,
        joy: joy ? parseInt(joy) : null,
        anger: anger ? parseInt(anger) : null,
        boredom: boredom ? parseInt(boredom) : null
      })
      nav('/emotions')
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  const EmotionScale = ({ label, value, onChange, color }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {value && <span className={`text-sm font-semibold ${color}`}>{value}/5</span>}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="1"
          max="5"
          value={value || 3}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
        >
          Clear
        </button>
      </div>
    </div>
  )

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          New Emotion Journal Entry
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your emotions
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How are you feeling today? What's on your mind?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
              rows="6"
              required
            />
          </div>

          {/* Emotion Scales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Emotion Scales <span className="text-sm font-normal text-gray-500">(optional)</span>
            </h3>
            <div className="space-y-3">
              <EmotionScale 
                label="?? Anxiety" 
                value={anxiety} 
                onChange={setAnxiety}
                color="text-purple-600"
              />
              <EmotionScale 
                label="?? Calmness" 
                value={calmness} 
                onChange={setCalmness}
                color="text-blue-600"
              />
              <EmotionScale 
                label="?? Joy" 
                value={joy} 
                onChange={setJoy}
                color="text-yellow-600"
              />
              <EmotionScale 
                label="?? Anger" 
                value={anger} 
                onChange={setAnger}
                color="text-red-600"
              />
              <EmotionScale 
                label="?? Boredom" 
                value={boredom} 
                onChange={setBoredom}
                color="text-gray-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => nav('/emotions')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
