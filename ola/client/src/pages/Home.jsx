import { Link } from "react-router-dom";
import Card from "../components/Card";
import PriorityGoalReminder from "../components/PriorityGoalReminder";

export default function Home() {
  return (
    <div className="container max-w-3xl mx-auto py-12">
      <Card>
        <h1 className="text-3xl font-bold mb-2">Welcome to Growth</h1>
        <p className="text-gray-600 mb-6">Your place to track habits, goals and emotions.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/habits">
            <div className="p-4 border rounded-lg hover:shadow-lg">
              <h3 className="font-semibold">Habits</h3>
              <p className="text-sm text-gray-500">Manage and track your daily habits.</p>
            </div>
          </Link>
          <Link to="/goals">
            <div className="p-4 border rounded-lg hover:shadow-lg">
              <h3 className="font-semibold">Goals</h3>
              <p className="text-sm text-gray-500">Create and achieve your goals.</p>
            </div>
          </Link>
          <Link to="/emotions">
            <div className="p-4 border rounded-lg hover:shadow-lg">
              <h3 className="font-semibold">Emotion Journal</h3>
              <p className="text-sm text-gray-500">Log your emotions and observe patterns.</p>
            </div>
          </Link>
        </div>
      </Card>
      
      {/* Priority Goal Reminder */}
      <PriorityGoalReminder />
    </div>
  )
}
