import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";

// -- Sample events -------------------------------------------------------------
const initialEvents = [
  {
    name: "Annual Meetup",
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    attendees: 120,
    description: "A gathering of all community members for networking and fun.",
    type: "past",
  },
  {
    name: "Tech Workshop",
    date: new Date(),
    attendees: 45,
    description: "Hands-on workshop on the latest web technologies.",
    type: "today",
  },
  {
    name: "Charity Run",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    attendees: 200,
    description: "A 5K run to raise funds for local charities.",
    type: "upcoming",
  },
  {
    name: "Board Meeting",
    date: new Date(new Date().setDate(new Date().getDate() - 10)),
    attendees: 15,
    description: "Quarterly board meeting to discuss progress and plans.",
    type: "past",
  },
  {
    name: "Community Picnic",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    attendees: 80,
    description: "A fun picnic for families and friends in the park.",
    type: "upcoming",
  },
  {
    name: "Today's Green Event",
    date: new Date(),
    attendees: 60,
    description: "A special event happening today!",
    type: "today",
  },
  {
    name: "Sprint Planning",
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    attendees: 10,
    description: "Plan the next sprint tasks and priorities.",
    type: "upcoming",
  },
  {
    name: "Retrospective",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    attendees: 11,
    description: "Team retrospective for the last sprint.",
    type: "past",
  },
];

// -- Helpers ------------------------------------------------------------------
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getEventDotColor(events) {
  if (events.some((ev) => ev.type === "today")) return "bg-gradient-to-r from-emerald-400 to-green-500";
  if (events.some((ev) => ev.type === "upcoming")) return "bg-gradient-to-r from-blue-400 to-cyan-500";
  return "bg-gradient-to-r from-red-400 to-pink-500";
}

// Simple calendar component
const SimpleCalendar = ({ selectedDate, onDateSelect, events }) => {
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + direction);
    onDateSelect(newDate);
  };
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-inner border border-gray-100">
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
              key={day}
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
                  <div className="pointer-events-none absolute -top-12 left-1/2 hidden w-max max-w-48 -translate-x-1/2 
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

// -- Main Calendar Page --------------------------------------------------------
export default function Calendar() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    attendees: '',
    description: '',
    type: 'upcoming',
  });
  const [formError, setFormError] = useState('');

  // live clock update
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // filter events on the selected date
  const eventsForDate = events.filter((ev) =>
    isSameDay(ev.date, selectedDate)
  );

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name || !formData.date || !formData.attendees || !formData.description) {
      setFormError('All fields are required.');
      return;
    }
    const eventDate = new Date(formData.date);
    let type = 'upcoming';
    const today = new Date();
    today.setHours(0,0,0,0);
    eventDate.setHours(0,0,0,0);
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
    setFormData({ name: '', date: '', attendees: '', description: '', type: 'upcoming' });
    setSelectedDate(eventDate);
  };

  const eventStats = {
    total: events.length,
    today: events.filter(e => e.type === 'today').length,
    upcoming: events.filter(e => e.type === 'upcoming').length,
    past: events.filter(e => e.type === 'past').length,
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4 pb-8">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 mb-4 rounded-2xl shadow-xl mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Event Calendar
                  </h1>
                  <p className="text-gray-600 mt-0.5">Manage your events with style</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 lg:mt-0">
                {/* Stats Pills */}
                <div className="flex gap-1">
                  <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm font-semibold shadow-lg">
                    {eventStats.today} Today
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-semibold shadow-lg">
                    {eventStats.upcoming} Upcoming
                  </div>
                </div>
                {/* Live Clock */}
                <div className="text-right">
                  <div className="text-base font-bold text-gray-800">
                    {time.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    {time.toLocaleTimeString([], { hour12: false })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Calendar Section */}
              <div className="xl:col-span-2">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-gray-200/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-blue-600 rounded-full"></div>
                      Calendar View
                    </h2>
                    <button
                      className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        showForm
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-red-200'
                          : 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-emerald-200'
                      }`}
                      onClick={() => setShowForm((v) => !v)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showForm ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        )}
                      </svg>
                      {showForm ? 'Cancel' : 'Add Event'}
                    </button>
                  </div>
                  {/* Enhanced Form */}
                  {showForm && (
                    <form className="mb-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-4 border border-emerald-200/50 shadow-inner" onSubmit={handleFormSubmit}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 peer placeholder-transparent"
                              placeholder="Event Name"
                              id="event-name"
                            />
                            <label htmlFor="event-name" className="absolute left-4 -top-2 text-sm text-gray-600 bg-white px-2 rounded transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-emerald-600">
                              Event Name
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                              id="event-date"
                            />
                            <label htmlFor="event-date" className="absolute left-4 -top-2 text-sm text-gray-600 bg-white px-2 rounded">
                              Date
                            </label>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            name="attendees"
                            value={formData.attendees}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 peer placeholder-transparent"
                            min="1"
                            placeholder="Number of attendees"
                            id="event-attendees"
                          />
                          <label htmlFor="event-attendees" className="absolute left-4 -top-2 text-sm text-gray-600 bg-white px-2 rounded transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-emerald-600">
                            Number of Attendees
                          </label>
                        </div>
                        <div className="relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 peer placeholder-transparent resize-none"
                            rows={3}
                            placeholder="Event description"
                            id="event-description"
                          />
                          <label htmlFor="event-description" className="absolute left-4 -top-2 text-sm text-gray-600 bg-white px-2 rounded transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-emerald-600">
                            Description
                          </label>
                        </div>
                        {formError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {formError}
                          </div>
                        )}
                        <button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Create Event
                        </button>
                      </div>
                    </form>
                  )}
                  {/* Calendar */}
                  <SimpleCalendar 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    events={events}
                  />
                  {/* Enhanced Legend */}
                  <div className="mt-3 p-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                    <div className="flex flex-wrap gap-6 justify-center items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg"></div>
                        <span className="font-medium text-gray-700">Today ({eventStats.today})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg"></div>
                        <span className="font-medium text-gray-700">Upcoming ({eventStats.upcoming})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-600 shadow-lg"></div>
                        <span className="font-medium text-gray-700">Past ({eventStats.past})</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm text-gray-600">
                    <span className="font-semibold">Selected Date:</span> {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
              {/* Enhanced Event Details Sidebar */}
              <div className="xl:col-span-1">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-3 border border-gray-200/50 sticky top-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
                  </div>
                  {eventsForDate.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-center">No events scheduled for this date</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Add Event" to create one</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {eventsForDate.map((ev, idx) => {
                        const gradientClass =
                          ev.type === "today"
                            ? "from-emerald-500 to-green-600"
                            : ev.type === "upcoming"
                            ? "from-blue-500 to-cyan-600"
                            : "from-red-500 to-pink-600";
                        const bgClass =
                          ev.type === "today"
                            ? "from-emerald-50 to-green-50"
                            : ev.type === "upcoming"
                            ? "from-blue-50 to-cyan-50"
                            : "from-red-50 to-pink-50";
                        return (
                          <div
                            key={idx}
                            className={`bg-gradient-to-br ${bgClass} rounded-2xl p-3 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradientClass} shadow-lg`}></div>
                                {ev.name}
                              </h3>
                              <span className={`px-2 py-1 bg-gradient-to-r ${gradientClass} text-white rounded-full text-xs font-semibold shadow-lg`}>
                                {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {ev.date.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.197a4 4 0 11-8.485-2.829" />
                                </svg>
                                {ev.attendees} attendees
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {ev.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 