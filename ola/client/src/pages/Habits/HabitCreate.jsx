import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHabit } from "../../services/habits";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function HabitCreate() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await createHabit({ name, description });
    if(res?.id){ nav(`/habits`); }
    else setMessage(res?.error || "Create failed");
  };

  return (
    <div className="container max-w-lg">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Create Habit</h2>
        {message && <div className="text-red-600 text-sm mb-2">{message}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex justify-end"><Button type="submit">Create</Button></div>
        </form>
      </Card>
    </div>
  );
}
