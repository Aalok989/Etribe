import React, { useState } from "react";

const events = [
  {
    id: 1,
    day: "Sun",
    date: "20",
    month: "July",
    year: "2025",
    title: "Forever Together Gala",
    time: "6:00 PM",
    venue: "Main Hall",
    description:
      "A gala event for all members. Join us for an evening of celebration and connection. Enjoy the evening with music, dance, and networking opportunities for all participants. A gala event for all members. Join us for an evening of celebration and connection. Enjoy the evening with music, dance, and networking opportunities for all participants. A gala event for all members. Join us for an evening of celebration and connection. Enjoy the evening with music, dance, and networking opportunities for all participants. A gala event for all members. Join us for an evening of celebration and connection. Enjoy the evening with music, dance, and networking opportunities for all participants. A gala event for all members. Join us for an evening of celebration and connection. Enjoy the evening with music, dance, and networking opportunities for all participants.  ",
  },
  {
    id: 2,
    day: "Tue",
    date: "22",
    month: "July",
    year: "2025",
    title: "Urban Fest",
    time: "2:00 PM",
    venue: "Club Lawn",
    description:
      "A fun festival with music, food stalls, games, and live performances. Bring your friends and family for a memorable time filled with joy and entertainment.",
  },
  {
    id: 3,
    day: "Fri",
    date: "25",
    month: "July",
    year: "2025",
    title: "Tech Symposium",
    time: "10:00 AM",
    venue: "Conference Room",
    description:
      "A symposium for tech enthusiasts featuring keynote speakers, panel discussions, workshops, and networking sessions. Stay ahead with the latest tech trends.",
  },
];

export default function UpcomingEvents() {
  const [selected, setSelected] = useState(events[0]);

  return (
    <div className="rounded-2xl shadow-lg bg-white h-full w-full flex flex-col">
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-blue-100 to-blue-200" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-white/30" />
        <h2 className="relative z-10 text-lg font-bold text-gray-900 tracking-wide px-5 py-3">
          Upcoming Events
        </h2>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex space-x-3 overflow-visible pb-2 mb-3">
            {events.map((event) => (
              <button
                key={event.id}
                className={`relative flex flex-col items-center px-3 py-2 rounded-lg border-2 transition-colors duration-150 min-w-[65px] shadow-sm font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 mx-1 overflow-hidden ${
                  selected.id === event.id
                    ? "bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-100 border-indigo-400 scale-105 z-10"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-100 hover:border-indigo-400"
                }`}
                onClick={() => setSelected(event)}
              >
                {selected.id === event.id ? (
                  <>
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-lg pointer-events-none" />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                      <span className="font-bold text-sm text-gray-900">
                        {event.day}
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {event.date}
                      </span>
                      <span className="text-xs text-gray-900">
                        {event.month}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-sm">{event.day}</span>
                    <span className="text-xl font-bold">{event.date}</span>
                    <span className="text-xs">{event.month}</span>
                  </>
                )}
              </button>
            ))}
          </div>

          {selected && (
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-indigo-100 shadow-inner h-72 overflow-y-auto custom-scroll">
              <h3 className="text-base font-bold mb-1 text-indigo-700">
                {selected.title}
              </h3>
              <div className="text-xs mb-1 text-gray-700">
                <span className="font-semibold">Date:</span> {selected.day},{" "}
                {selected.date} {selected.month} {selected.year}
              </div>
              <div className="text-xs mb-1 text-gray-700">
                <span className="font-semibold">Time:</span> {selected.time}
              </div>
              <div className="text-xs mb-1 text-gray-700">
                <span className="font-semibold">Venue:</span> {selected.venue}
              </div>
              <div className="text-xs text-gray-700 whitespace-pre-line">
                <span className="font-semibold">Description:</span>{" "}
                {selected.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
