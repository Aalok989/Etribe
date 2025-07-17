import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FaCalendarAlt, FaPlus, FaInfoCircle, FaEye } from "react-icons/fa";

// Event Detail Modal
function EventDetailModal({ open, event, onClose }) {
  if (!open || !event) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/90 rounded-2xl shadow-2xl max-w-2xl w-full p-0 border border-indigo-100 animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-100 rounded-t-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-blue-100">
          <h2 className="text-2xl font-bold text-indigo-700">Event Detail</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-indigo-600 transition-colors">&times;</button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <span className="text-xl font-bold text-indigo-600">{event.event}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <table className="w-full mb-4">
                <tbody>
                  <tr className="bg-indigo-50">
                    <td className="py-2 px-3 font-semibold text-gray-700 w-40">Company Name</td>
                    <td className="py-2 px-3 text-gray-800">{event.event}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-gray-700">Timing</td>
                    <td className="py-2 px-3 text-gray-800">{event.datetime ? new Date(event.datetime).toLocaleString() : ''}</td>
                  </tr>
                  <tr className="bg-indigo-50">
                    <td className="py-2 px-3 font-semibold text-gray-700">Venue</td>
                    <td className="py-2 px-3 text-gray-800">{event.venue}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-gray-700 mt-2">{event.agenda}</div>
            </div>
            {event.imageUrl && (
              <div className="flex justify-center items-center">
                <img src={event.imageUrl} alt="Event" className="rounded-lg border border-indigo-100 max-w-full max-h-48 object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Add Event Modal
function AddEventModal({ open, form, onChange, onSubmit, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen transition-all">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl shadow-2xl p-0 min-w-[300px] w-full max-w-md relative flex flex-col animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur rounded-t-2xl flex items-center justify-between px-6 py-4 border-b border-indigo-100">
          <h2 className="text-xl font-extrabold text-indigo-700 tracking-tight">Add Event</h2>
          <button
            className="text-2xl text-gray-400 hover:text-indigo-600 transition-colors bg-none border-none p-0 m-0"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <form className="flex flex-col gap-3 px-6 py-4" onSubmit={onSubmit} autoComplete="off">
          {/* Divider */}
          <div className="h-px bg-indigo-100 mb-2" />
          {/* Event Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="event" className="text-base font-semibold text-gray-700 mb-0.5">
              <span className="text-red-500 mr-1">*</span>Event Title
            </label>
            <input
              id="event"
              name="event"
              value={form.event}
              onChange={onChange}
              required
              placeholder="Enter event title"
              className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md"
            />
          </div>
          {/* Agenda */}
          <div className="flex flex-col gap-1">
            <label htmlFor="agenda" className="text-base font-semibold text-gray-700 mb-0.5">
              <span className="text-red-500 mr-1">*</span>Agenda
            </label>
            <textarea
              id="agenda"
              name="agenda"
              value={form.agenda}
              onChange={onChange}
              required
              placeholder="Enter agenda"
              rows={4}
              className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md resize-y"
            />
          </div>
          {/* Venue */}
          <div className="flex flex-col gap-1">
            <label htmlFor="venue" className="text-base font-semibold text-gray-700 mb-0.5">
              <span className="text-red-500 mr-1">*</span>Venue
            </label>
            <input
              id="venue"
              name="venue"
              value={form.venue}
              onChange={onChange}
              required
              placeholder="Enter venue"
              className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md"
            />
          </div>
          {/* Date & Time */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="date" className="text-base font-semibold text-gray-700 mb-0.5">
                <span className="text-red-500 mr-1">*</span>Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={onChange}
                required
                className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="time" className="text-base font-semibold text-gray-700 mb-0.5">
                <span className="text-red-500 mr-1">*</span>Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time || ''}
                onChange={onChange}
                required
                className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md"
              />
            </div>
          </div>
          {/* Reminder */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="reminder" className="text-base font-semibold text-gray-700 mb-0.5">Do you want send Reminder?</label>
              <select
                id="reminder"
                name="reminder"
                value={form.reminder || 'Yes'}
                onChange={onChange}
                className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="reminderTo" className="text-base font-semibold text-gray-700 mb-0.5">Send Reminder To</label>
              <select
                id="reminderTo"
                name="reminderTo"
                value={form.reminderTo || 'Only Approved Members'}
                onChange={onChange}
                className="py-2 px-4 border border-indigo-200 rounded-xl text-base bg-indigo-50 font-medium text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-150 hover:shadow-md"
              >
                <option value="Only Approved Members">Only Approved Members</option>
                <option value="All Members">All Members</option>
              </select>
            </div>
          </div>
          {/* Invitation Image */}
          <div className="flex flex-col gap-1">
            <label htmlFor="image" className="text-base font-semibold text-gray-700 mb-0.5">Invitation Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={onChange}
              className="block w-full text-base text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl px-8 py-3 text-lg font-bold shadow-md flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <span>&#10003;</span> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const AllEvent = () => {
  // Hardcoded sample events for demonstration
  const [events, setEvents] = useState([
    {
      id: 1,
      event: "Office Anniversary",
      agenda: "Celebration for 7 years completeletion.",
      venue: "Raddision Delhi",
      datetime: "2023-08-23T11:00"
    },
    {
      id: 2,
      event: "Plantation",
      agenda: "Enviornment Preservation",
      venue: "Office Ground Floor",
      datetime: "2023-08-25T10:00"
    },
    {
      id: 3,
      event: "testing",
      agenda: "This is a test event",
      venue: "online",
      datetime: "2023-08-26T16:00"
    },
    {
      id: 4,
      event: "Test Event",
      agenda: "This is a test event",
      venue: "Online",
      datetime: "2023-08-26T16:00"
    },
    {
      id: 5,
      event: "Award Distribution Ceremony",
      agenda: "Congratulate and appreciate our employees for their hardwork and dedication and successful completion of defined tasks",
      venue: "Office 2nd Floor",
      datetime: "2023-08-31T14:00"
    },
    {
      id: 6,
      event: "Diwali Celebration",
      agenda: "Celebrate the festival of victory and welcoming blessings in life",
      venue: "Office 1st Floor",
      datetime: "2023-11-09T13:00"
    },
    {
      id: 7,
      event: "Tushar's birthday",
      agenda: "Tushar's birthday",
      venue: "30 days",
      datetime: "2025-11-05T14:35"
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    event: "",
    agenda: "",
    venue: "",
    datetime: ""
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      ...form,
      id: events.length + 1,
      datetime: form.datetime instanceof Date ? form.datetime.toISOString() : form.datetime
    };
    setEvents([...events, newEvent]);
    setForm({ event: "", agenda: "", venue: "", datetime: "" });
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="relative z-10 min-h-screen py-6 px-4 sm:px-6">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-indigo-100 mb-6 rounded-b-xl shadow-lg flex flex-col sm:flex-row items-center justify-between px-4 py-5 transition-shadow">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 flex items-center gap-2 drop-shadow-lg">
                <FaCalendarAlt className="text-blue-600" /> All Events
              </h2>
              <p className="text-sm text-indigo-500 mt-1 font-medium">View, add, and manage all your events in one place!</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Add Event"
            >
              <FaPlus /> Add Event
            </button>
          </div>
          {/* Table Section */}
          <section className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 overflow-x-auto transition-shadow duration-300 hover:shadow-2xl animate-fade-in border border-indigo-100">
            <table className="w-full border-separate border-spacing-y-2 text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="py-2 px-3 text-indigo-700 font-extrabold text-base border-b-2 border-indigo-200 text-left">Sr No.</th>
                  <th className="py-2 px-3 text-indigo-700 font-extrabold text-base border-b-2 border-indigo-200 text-left">Event</th>
                  <th className="py-2 px-3 text-indigo-700 font-extrabold text-base border-b-2 border-indigo-200 text-left">Agenda</th>
                  <th className="py-2 px-3 text-indigo-700 font-extrabold text-base border-b-2 border-indigo-200 text-left">Venue</th>
                  <th className="py-2 px-3 text-indigo-700 font-extrabold text-base border-b-2 border-indigo-200 text-left">Date & Time</th>
                  <th className="py-2 px-3 text-indigo-700 font-extrabold text-base border-b-2 border-indigo-200 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-indigo-400 py-8 bg-indigo-50 text-base italic rounded-md">
                      <div className="flex flex-col items-center gap-2">
                        <FaCalendarAlt className="text-4xl text-indigo-200 mb-1" />
                        No events found. Add your first event!
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.map((ev, idx) => (
                    <tr key={ev.id} className="border-b border-indigo-100 hover:bg-indigo-50/70 transition-colors animate-fade-in">
                      <td className="py-2 px-3 text-gray-700 bg-white rounded-md font-semibold">{idx + 1}</td>
                      <td className="py-2 px-3 text-gray-700 bg-white rounded-md font-semibold flex items-center gap-2"><FaCalendarAlt className="text-indigo-400 text-base" />{ev.event}</td>
                      <td className="py-2 px-3 text-gray-700 bg-white rounded-md">{ev.agenda}</td>
                      <td className="py-2 px-3 text-gray-700 bg-white rounded-md">{ev.venue}</td>
                      <td className="py-2 px-3 text-gray-700 bg-white rounded-md">{ev.datetime && new Date(ev.datetime).toLocaleString()}</td>
                      <td className="py-2 px-3 bg-white rounded-md">
                        <button
                          className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white border-none rounded-md px-3 py-1 font-semibold shadow-sm text-base transition-all duration-150 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          aria-label={`View details for ${ev.event}`}
                          onClick={() => { setSelectedEvent(ev); setShowDetail(true); }}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
      {/* Add Event Form Modal */}
      <AddEventModal
        open={showModal}
        form={form}
        onChange={handleChange}
        onSubmit={handleAddEvent}
        onClose={() => setShowModal(false)}
      />
      {/* Event Detail Modal */}
      <EventDetailModal open={showDetail} event={selectedEvent} onClose={() => setShowDetail(false)} />
    </DashboardLayout>
  );
};

export default AllEvent; 