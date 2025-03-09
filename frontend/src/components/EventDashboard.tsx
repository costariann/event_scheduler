import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

const EventDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { token, logout } = useAuth();

  const apiBaseUrl =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_API_URI_FALLBACK
      : import.meta.env.VITE_API_URI;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${apiBaseUrl}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setError("");
    } catch (err: any) {
      console.error("Fetch events error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch events");
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingEvent) {
        await axios.put(
          `${apiBaseUrl}/api/events/${editingEvent._id}`,
          { title, date, time, location, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingEvent(null);
      } else {
        await axios.post(
          `${apiBaseUrl}/api/events`,
          { title, date, time, location, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchEvents();
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      setError("");
    } catch (err: any) {
      console.error("Create/Update event error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save event");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date.split("T")[0]);
    setTime(event.time);
    setLocation(event.location);
    setDescription(event.description);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
      setError("");
    } catch (err: any) {
      console.error("Delete event error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete event");
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Event Dashboard</h2>
        <button
          onClick={logout}
          className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreateOrUpdate} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded col-span-2"
            required
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingEvent ? "Update Event" : "Add Event"}
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={cancelEdit}
              className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div>
        {events.map((event) => (
          <div
            key={event._id}
            className="p-4 border-b flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>{event.date.split("T")[0]} at {event.time} - {event.location}</p>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDashboard;

