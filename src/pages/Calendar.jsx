import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiCalendar, FiPlus, FiClock, FiUsers, FiMapPin, FiSearch, FiFilter, FiRefreshCw, FiEye, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

// Dummy event data for structure
const initialEvents = [
  {
    name: "Tech Workshop",
    date: new Date(),
    attendees: 45,
    description: "Hands-on workshop on the latest web technologies.",
    type: "today",
  },
  {
    name: "Today's Green Event",
    date: new Date(),
    attendees: 60,
    description: "A special event happening today!",
    type: "today",
  },
  {
    name: "Charity Run",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    attendees: 200,
    description: "A 5K run to raise funds for local charities.",
    type: "upcoming",
  },
];

// Helper functions
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
function getEventDotColor(events) {
  if (events.some((ev) => ev.type === "today")) return "bg-green-400";
  if (events.some((ev) => ev.type === "upcoming")) return "bg-blue-400";
  return "bg-pink-400";
}

// SimpleCalendar component
const SimpleCalendar = ({ selectedDate, onDateSelect, events }) => {
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + direction);
    onDateSelect(newDate);
  };
  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="aspect-square"></div>;
          }
          const dayDate = new Date(currentYear, currentMonth, day);
          const eventsForDay = events.filter(event => isSameDay(event.date, dayDate));
          const isSelected = isSameDay(dayDate, selectedDate);
          const isToday = isSameDay(dayDate, today);
          const dotColor = getEventDotColor(eventsForDay);
          return (
            <div
              key={index}
              onClick={() => onDateSelect(dayDate)}
              className={`aspect-square p-2 cursor-pointer rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg relative group
                ${isSelected ? "ring-2 ring-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md" : "hover:bg-gradient-to-br hover:from-emerald-50 hover:to-blue-50"}
                ${isToday ? "bg-gradient-to-br from-yellow-50 to-orange-50 ring-1 ring-yellow-300" : ""}
      `}
            >
              <div className="text-lg font-bold text-gray-800 text-center">{day}</div>
              {eventsForDay.length > 0 && (
                <>
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg ${dotColor} animate-pulse`} />
                  {eventsForDay.length > 1 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                      {eventsForDay.length}
                    </div>
                  )}
                  <div className="pointer-events-none absolute -top-12 left-1/2 hidden w-max max-w-48 -translate-x-1/2 \
                                  rounded-lg bg-gray-900 px-3 py-2 text-xs text-white group-hover:block z-50 shadow-xl">
                    <div className="font-semibold mb-1">Events:</div>
                    {eventsForDay.slice(0, 3).map((ev, idx) => (
                      <div key={idx} className="truncate">{ev.name}</div>
                    ))}
                    {eventsForDay.length > 3 && (
                      <div className="text-gray-300">+{eventsForDay.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Calendar() {
  const [events, setEvents] = useState(initialEvents);
  const [time, setTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    attendees: '',
    description: '',
    type: 'upcoming',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Stats for pills
  const todayCount = events.filter(e => e.type === 'today').length;
  const upcomingCount = events.filter(e => e.type === 'upcoming').length;

  // Events for selected date
  const eventsForDate = events.filter(ev => isSameDay(ev.date, selectedDate));

  // Add Event form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name || !formData.attendees || !formData.description) {
      setFormError('All fields are required.');
      return;
    }
    const eventDate = new Date(selectedDate);
    eventDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    let type = 'upcoming';
    if (isSameDay(eventDate, today)) type = 'today';
    else if (eventDate < today) type = 'past';
    const newEvent = {
      name: formData.name,
      date: eventDate,
      attendees: Number(formData.attendees),
      description: formData.description,
      type,
    };
    setEvents((prev) => [...prev, newEvent]);
    setShowForm(false);
    setFormData({ name: '', attendees: '', description: '', type: 'upcoming' });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-orange-600">Event Calendar</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiCalendar className="text-indigo-600" />
            <span>Total Events: {events.length}</span>
                </div>
                </div>

        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-indigo-600 text-xl" />
                <span className="text-lg font-semibold text-gray-800">Calendar Management</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock className="text-indigo-600" />
                <span>Manage events and schedules</span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{todayCount} Today</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{upcomingCount} Upcoming</span>
                <span className="text-gray-700 font-semibold ml-2">{time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="text-xs text-gray-500 font-mono">{time.toLocaleTimeString([], { hour12: false })}</span>
          </div>
                    <button
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      onClick={() => setShowForm((v) => !v)}
                    >
                <FiPlus />
                Add Event
                    </button>
                  </div>
                          </div>

          {/* Main Content: Two Columns */}
          <div className="flex flex-col xl:flex-row gap-6 p-6">
            {/* Left: Calendar Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-200 relative">
                {/* Calendar grid */}
                
                {/* Calendar grid */}
                <div className="p-6">
                  <SimpleCalendar 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    events={events}
                  />
                  {/* Legend */}
                  <div className="mt-6 flex gap-6 justify-center text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                      <span className="text-gray-700">Today</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
                      <span className="text-gray-700">Upcoming</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span>
                      <span className="text-gray-700">Past</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Event Details Card */}
            <div className="w-full xl:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiEye className="text-indigo-600" />
                    Event Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Events for {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  </div>
                
                {/* Event cards for selected date */}
                <div className="p-6 space-y-4">
                  {eventsForDate.length === 0 ? (
                    <div className="text-center py-8">
                      <FiCalendar className="text-gray-300 text-4xl mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No events scheduled for this date</p>
                    </div>
                  ) : (
                    eventsForDate.map((ev, idx) => (
                      <div key={idx} className={`rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                        ev.type === 'today' 
                          ? 'bg-green-50 border-green-200' 
                          : ev.type === 'upcoming' 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              ev.type === 'today' 
                                ? 'bg-green-500' 
                                : ev.type === 'upcoming' 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-500'
                            }`}></div>
                            <h3 className="font-semibold text-gray-900">{ev.name}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ev.type === 'today' 
                              ? 'bg-green-200 text-green-700' 
                              : ev.type === 'upcoming' 
                                ? 'bg-blue-200 text-blue-700' 
                                : 'bg-gray-200 text-gray-700'
                          }`}>
                                {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                              </span>
                            </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-400" size={14} />
                            <span>{ev.date.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                            <FiUsers className="text-gray-400" size={14} />
                            <span>{ev.attendees} attendees</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-gray-700 text-sm">{ev.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          <button className="text-indigo-600 hover:text-indigo-900 transition-colors" title="View Details">
                            <FiEye size={16} />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Edit Event">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 transition-colors" title="Delete Event">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setShowForm(false)}
                title="Close"
              >
                <FiX size={24} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                  <FiPlus className="text-indigo-600" />
                  Add New Event
                </h2>
                <p className="text-gray-600 text-sm mt-1">Create a new event for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attendees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="Number of attendees"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    rows={4}
                    placeholder="Describe the event details and agenda"
                    required
                  />
                </div>
                
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  >
                    <FiPlus />
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 