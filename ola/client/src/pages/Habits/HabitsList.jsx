import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listHabits, remove } from "../../services/habits";
import Card from "../../components/Card";
import Button from "../../components/Button";

export default function HabitsList() {
  const [items, setItems] = useState([]);
  useEffect(() => { listHabits().then(setItems); }, []);
  const onDelete = async (id) => {
    await remove(id);
    setItems(items.filter(x => x.id !== id));
  }
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Habits</h2>
        <Link to="/habits/create"><Button>New Habit</Button></Link>
      </div>
      <Card>
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">No habits yet. Create your first one.</p>
        ) : (
          <ul className="space-y-3">
            {items.map(h => (
              <li key={h.id} className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-sm text-gray-600">{h.description}</div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/habits/${h.id}`}><Button variant="outline">Details</Button></Link>
                  <Button variant="secondary" onClick={() => onDelete(h.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
