import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiCalendar, FiPlus, FiClock, FiUsers, FiMapPin, FiSearch, FiFilter, FiRefreshCw, FiEye, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import api from "../api/axiosConfig";

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
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-100 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 dark:bg-gray-700 rounded-xl p-2">
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
                ${isSelected ? "ring-2 ring-emerald-400 bg-emerald-100 text-black dark:bg-emerald-600 dark:text-white shadow-md" : "hover:bg-gradient-to-br hover:from-emerald-50 hover:to-blue-50 dark:hover:from-gray-600 dark:hover:to-gray-700"}
                ${isToday && !isSelected ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:bg-indigo-800 ring-1 ring-yellow-300" : ""}
      `}
            >
              <div className="text-lg font-bold text-gray-800 dark:text-inherit text-center">{day}</div>
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Stats for pills (use backend endpoints for counts to match Dashboard)
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  // Fetch event counts from backend endpoints
  useEffect(() => {
    let interval;
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        // Upcoming events count
        const futureRes = await api.post('/event/future', {}, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
            'Content-Type': 'application/json',
          }
        });
        let futureEvents = [];
        if (Array.isArray(futureRes.data?.data?.event)) {
          futureEvents = futureRes.data.data.event;
        } else if (Array.isArray(futureRes.data?.data?.events)) {
          futureEvents = futureRes.data.data.events;
        } else if (Array.isArray(futureRes.data?.data)) {
          futureEvents = futureRes.data.data;
        } else if (Array.isArray(futureRes.data)) {
          futureEvents = futureRes.data;
        } else if (futureRes.data?.data && typeof futureRes.data.data === 'object') {
          futureEvents = Object.values(futureRes.data.data);
        } else {
          futureEvents = [];
        }
        setUpcomingCount(futureEvents.length);

        // Past events count
        const pastRes = await api.post('/event/past', {}, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
            'Content-Type': 'application/json',
          }
        });
        let pastEvents = [];
        if (Array.isArray(pastRes.data?.data?.event)) {
          pastEvents = pastRes.data.data.event;
        } else if (Array.isArray(pastRes.data?.data?.events)) {
          pastEvents = pastRes.data.data.events;
        } else if (Array.isArray(pastRes.data?.data)) {
          pastEvents = pastRes.data.data;
        } else if (Array.isArray(pastRes.data)) {
          pastEvents = pastRes.data;
        } else if (pastRes.data?.data && typeof pastRes.data.data === 'object') {
          pastEvents = Object.values(pastRes.data.data);
        } else {
          pastEvents = [];
        }
        setPastCount(pastEvents.length);

        // Today events count (from all events, filter for today)
        const today = new Date();
        today.setHours(0,0,0,0);
        const allToday = [...futureEvents, ...pastEvents].filter(e => {
          let eventDate;
          if (e.event_date && e.event_time) {
            eventDate = new Date(`${e.event_date}T${e.event_time}`);
          } else if (e.datetime) {
            eventDate = new Date(e.datetime);
          } else if (e.date_time) {
            eventDate = new Date(e.date_time);
          } else if (e.date) {
            eventDate = new Date(e.date);
          } else {
            eventDate = new Date();
          }
          eventDate.setHours(0,0,0,0);
          return eventDate.getTime() === today.getTime();
        });
        setTodayCount(allToday.length);
      } catch (err) {
        setUpcomingCount(0);
        setPastCount(0);
        setTodayCount(0);
      }
    };
    fetchCounts();
    interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch events from backend and poll every 10 seconds
  useEffect(() => {
    let interval;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const response = await api.post('/event/index', {}, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
            'Content-Type': 'application/json',
          }
        });
        let backendEvents = [];
        if (Array.isArray(response.data?.data?.event)) {
          backendEvents = response.data.data.event;
        } else if (Array.isArray(response.data?.data?.events)) {
          backendEvents = response.data.data.events;
        } else if (Array.isArray(response.data?.data)) {
          backendEvents = response.data.data;
        } else if (Array.isArray(response.data)) {
          backendEvents = response.data;
        } else if (response.data?.data && typeof response.data.data === 'object') {
          backendEvents = Object.values(response.data.data);
        } else {
          backendEvents = [];
        }
        // Map backend fields to calendar event structure
        const mappedEvents = backendEvents.map((e, idx) => {
          // Parse date and time
          let eventDate;
          if (e.event_date && e.event_time) {
            eventDate = new Date(`${e.event_date}T${e.event_time}`);
          } else if (e.datetime) {
            eventDate = new Date(e.datetime);
          } else if (e.date_time) {
            eventDate = new Date(e.date_time);
          } else if (e.date) {
            eventDate = new Date(e.date);
          } else {
            eventDate = new Date();
          }
          // Determine type
          const today = new Date();
          today.setHours(0,0,0,0);
          const eventDay = new Date(eventDate);
          eventDay.setHours(0,0,0,0);
          let type = 'upcoming';
          if (eventDay < today) type = 'past';
          else if (eventDay.getTime() === today.getTime()) type = 'today';
          return {
            name: e.event_title || e.event || e.title || e.name || '',
            date: eventDate,
            attendees: e.attendees || e.attendee_count || e.count || 0,
            description: e.event_description || e.agenda || e.description || '',
            type,
          };
        });
        setEvents(mappedEvents);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

        <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-800 max-w-7xl w-full mx-auto">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-indigo-600 text-xl" />
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Calendar Management</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiClock className="text-indigo-600" />
                <span>Manage events and schedules</span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">{todayCount} Today</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">{upcomingCount} Upcoming</span>
                <span className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-semibold">{pastCount} Past</span>
                <span className="text-gray-700 dark:text-gray-200 font-semibold ml-2">{time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{time.toLocaleTimeString([], { hour12: false })}</span>
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
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 relative">
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
                      <span className="text-gray-700 dark:text-gray-200">Today</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
                      <span className="text-gray-700 dark:text-gray-200">Upcoming</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span>
                      <span className="text-gray-700 dark:text-gray-200">Past</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Event Details Card */}
            <div className="w-full xl:w-96 flex-shrink-0">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <FiEye className="text-indigo-600" />
                    Event Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
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
                      <FiCalendar className="text-gray-300 dark:text-gray-600 text-4xl mx-auto mb-3" />
                      <p className="text-gray-400 dark:text-gray-300 text-sm">No events scheduled for this date</p>
                    </div>
                  ) : (
                    eventsForDate.map((ev, idx) => (
                      <div key={idx} className={`rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                        ev.type === 'today' 
                          ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700' 
                          : ev.type === 'upcoming' 
                            ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700' 
                            : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
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
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{ev.name}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ev.type === 'today' 
                              ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200' 
                              : ev.type === 'upcoming' 
                                ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200' 
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                          }`}>
                                {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                              </span>
                            </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-400" size={14} />
                            <span>{ev.date.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                            <FiUsers className="text-gray-400" size={14} />
                            <span>{ev.attendees} attendees</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-200 text-sm">{ev.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <button className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-400 transition-colors" title="View Details">
                            <FiEye size={16} />
                          </button>
                          <button className="text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors" title="Edit Event">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="text-red-600 dark:text-red-300 hover:text-red-900 dark:hover:text-red-400 transition-colors" title="Delete Event">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
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
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Create a new event for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Attendees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="Number of attendees"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    rows={4}
                    placeholder="Describe the event details and agenda"
                    required
                  />
                </div>
                
                {formError && (
                  <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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