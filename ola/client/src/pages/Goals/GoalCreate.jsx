import { useState } from 'react'
import { create } from '../../services/goals'
import Input from '../../components/Input'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export default function GoalCreate() {
const nav = useNavigate()
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [whyReason, setWhyReason] = useState('')
const [deadline, setDeadline] = useState('')
const [priority, setPriority] = useState(1) // Medium jako domyœlna wartoœæ (1)
const [error, setError] = useState('')

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        if (!whyReason.trim()) {
            setError('Please explain why you want to achieve this goal - it will help you stay motivated!');
            return;
        }

        await create({
            title,
            description,
            whyReason,
            deadline,
            priority: Number(priority)
        })

        nav('/goals')
    }

    return (
        <div className="container max-w-lg">
            <Card>
                <h2 className="text-xl font-semibold mb-4">Create Goal</h2>
                <form onSubmit={submit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />

                    <Input
                        label="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <div>
                        <label className="label">
                            Why do you want to achieve this goal? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="input min-h-[100px] resize-y"
                            value={whyReason}
                            onChange={e => setWhyReason(e.target.value)}
                            placeholder="Describe your motivation - this will remind you why this goal matters to you..."
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">This reason will be displayed as a reminder to keep you motivated!</p>
                    </div>

                    <Input
                        label="Deadline"
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <div>
                        <label className="label">Priority</label>
                        <select
                            className="input"
                            value={priority}
                            onChange={e => setPriority(Number(e.target.value))}
                        >
                            <option value={0}>Low</option>
                            <option value={1}>Medium</option>
                            <option value={2}>High</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Create</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

