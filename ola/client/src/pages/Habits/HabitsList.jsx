import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listHabits, remove, getProgress } from "../../services/habits";
import Card from "../../components/Card";
import Button from "../../components/Button";
import PriorityGoalReminder from "../../components/PriorityGoalReminder";

const HABIT_FORMATION_DAYS = 66

export default function HabitsList() {
  const [items, setItems] = useState([]);
  const [progressData, setProgressData] = useState({});

  useEffect(() => { 
    listHabits().then(async (habits) => {
      setItems(habits);
      // Load progress for each habit
      const progressMap = {};
      for (const habit of habits) {
        try {
          const progress = await getProgress(habit.id);
          progressMap[habit.id] = progress.length;
        } catch {
          progressMap[habit.id] = 0;
        }
      }
      setProgressData(progressMap);
    }); 
  }, []);

  const onDelete = async (id) => {
    await remove(id);
    setItems(items.filter(x => x.id !== id));
  }

  return (
  <div className="container">
    {/* Motivational Quote Banner - Centered and Beautiful */}
    <div className="text-center mb-8">
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-2xl p-8 shadow-lg">
        <p className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed tracking-wide">
          Your past doesn't need you.
        </p>
        <p className="text-2xl md:text-3xl font-bold text-indigo-600 leading-relaxed tracking-wide mt-2">
          Your future does.
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold">My Habits</h2>
      <Link to="/habits/create"><Button>+ New Habit</Button></Link>
    </div>

    {items.length === 0 ? (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-indigo-600">&#9733;</span>
          </div>
          <p className="text-gray-600 mb-4">No habits yet. Start building better habits today!</p>
          <Link to="/habits/create" className="btn">Create Your First Habit</Link>
        </div>
      </Card>
    ) : (
        <div className="grid gap-4">
          {items.map(h => {
            const completedDays = progressData[h.id] || 0;
            const progressPercent = Math.min(100, Math.round((completedDays / HABIT_FORMATION_DAYS) * 100));
            
            return (
              <Card key={h.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{h.name}</h3>
                      {progressPercent >= 100 && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Complete!
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{h.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            progressPercent >= 100 
                              ? 'bg-green-500' 
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-16 text-right">
                        {completedDays}/{HABIT_FORMATION_DAYS}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Link 
                      to={`/habits/${h.id}/progress`}
                      className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-green-600 transition-colors shadow-md"
                      title="Mark today complete"
                    >
                      +
                    </Link>
                    <Link to={`/habits/${h.id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Priority Goal Reminder */}
      <PriorityGoalReminder />
    </div>
  );
}
