import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const apiBaseUrl =
    window.location.hostname === 'localhost'
      ? import.meta.env.VITE_API_URI_FALLBACK
      : import.meta.env.VITE_API_URI;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${apiBaseUrl}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Events fetched:', response.data);
      setEvents(response.data);
      setError('');
    } catch (err: any) {
      console.error('Fetch events error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch events');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post(
        `${apiBaseUrl}/api/events`,
        { title, date, time, location, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Event created:', {
        title,
        date,
        time,
        location,
        description,
      });
      fetchEvents();
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setDescription('');
      setError('');
    } catch (err: any) {
      console.error('Create event error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Event deleted:', id);
      fetchEvents();
      setError('');
    } catch (err: any) {
      console.error('Delete event error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Event Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreate} className="mb-6">
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
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Event
        </button>
      </form>
      <div>
        {events.map((event) => (
          <div
            key={event._id}
            className="p-4 border-b flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>
                {event.date.split('T')[0]} at {event.time} - {event.location}
              </p>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <button
              onClick={() => handleDelete(event._id)}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDashboard;
