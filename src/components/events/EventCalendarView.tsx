import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Event, Member } from '../../types';

export interface EventCalendarViewProps {
  events: Event[];
  currentUser: Member;
  onSelectEvent: (event: Event) => void;
}

export const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  currentUser,
  onSelectEvent
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0: Sunday, 1: Monday...

    const cells: { dayNum: number | null; dateString: string | null }[] = [];

    // Padding for days of previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ dayNum: null, dateString: null });
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateString = `${year}-${monthStr}-${dayStr}`;
      cells.push({ dayNum: day, dateString });
    }

    return cells;
  }, [year, month]);

  // Group events by YYYY-MM-DD date string
  const eventsByDate = useMemo(() => {
    const mapping: Record<string, Event[]> = {};
    events.forEach(event => {
      const dateVal = event.event_date || event.date;
      if (!dateVal) return;
      try {
        const dObj = new Date(dateVal);
        if (isNaN(dObj.getTime())) return;
        const y = dObj.getFullYear();
        const m = String(dObj.getMonth() + 1).padStart(2, '0');
        const d = String(dObj.getDate()).padStart(2, '0');
        const key = `${y}-${m}-${d}`;
        if (!mapping[key]) {
          mapping[key] = [];
        }
        mapping[key].push(event);
      } catch (e) {
        // Safe fail
      }
    });
    return mapping;
  }, [events]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Currently selected cell in calendar to show lists below it if multiple
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDateKey) return [];
    return eventsByDate[selectedDateKey] || [];
  }, [selectedDateKey, eventsByDate]);

  const handleDayClick = (dateString: string | null) => {
    if (!dateString) return;
    setSelectedDateKey(dateString);
  };

  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-3xl border border-navy-950/5 shadow-sm p-5 space-y-5 text-left" id="events-calendar-component">
      {/* Calendar Header Nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#fbf9f4] rounded-2xl text-[#c5a059] border border-navy-950/5">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide">
              {monthName} {year}
            </h4>
            <p className="text-[9px] font-mono font-bold text-navy-400 uppercase tracking-widest mt-0.5">Sovereign Conclaves Calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleToday}
            className="px-3 py-1.5 text-[9.5px] font-mono font-black text-navy-600 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center border border-navy-950/5 rounded-lg bg-navy-50/50">
            <button 
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-2 text-navy-600 hover:text-[#c5a059] transition-colors hover:bg-navy-50 rounded-l-lg cursor-pointer focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-navy-950/5" />
            <button 
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-2 text-navy-600 hover:text-[#c5a059] transition-colors hover:bg-navy-50 rounded-r-lg cursor-pointer focus:outline-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Day Labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map(day => (
          <span key={day} className="text-[9px] font-mono font-black text-navy-400 uppercase tracking-widest py-1">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell, idx) => {
          const hasEvents = cell.dateString ? !!eventsByDate[cell.dateString] : false;
          const dayEvents = cell.dateString ? eventsByDate[cell.dateString] || [] : [];
          const isToday = cell.dateString === todayStr;
          const isSelected = cell.dateString === selectedDateKey;

          return (
            <button
              key={idx}
              disabled={!cell.dayNum}
              onClick={() => handleDayClick(cell.dateString)}
              className={`aspect-square sm:aspect-[1.3] relative p-1 rounded-xl flex flex-col justify-between border transition-all focus:outline-none focus:ring-1 focus:ring-[#c5a059]/40 ${
                !cell.dayNum 
                  ? 'bg-transparent border-transparent cursor-default' 
                  : isSelected 
                    ? 'bg-navy-950 border-navy-950 text-gold-500 shadow-md'
                    : isToday
                      ? 'bg-[#c5a059]/10 border-[#c5a059]/30 text-navy-950 font-bold'
                      : 'bg-[#fbf9f4]/40 border-navy-950/5 text-navy-800 hover:bg-[#fbf9f4] hover:border-navy-950/10 cursor-pointer'
              }`}
            >
              {cell.dayNum && (
                <>
                  <span className="text-[10px] font-sans font-bold leading-none">
                    {cell.dayNum}
                  </span>

                  {/* Indicators for scheduled events */}
                  {hasEvents && (
                    <div className="flex flex-wrap gap-0.5 mt-auto self-end sm:self-start w-full">
                      {/* On mobile, small dot. On desktop, small bar or dot stack */}
                      {dayEvents.map((evt) => (
                        <span 
                          key={evt.id}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-1 rounded-full sm:rounded-sm shrink-0 ${
                            isSelected ? 'bg-gold-400' : 'bg-[#c5a059]'
                          }`}
                          title={evt.title}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda Panel */}
      {selectedDateKey && (
        <div className="mt-4 p-4.5 bg-[#fbf9f4] border border-[#c5a059]/15 rounded-2xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#c5a059]/10">
            <h5 className="text-[10px] font-mono font-black text-[#c5a059] uppercase tracking-wider">
              Agenda: {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </h5>
            <button 
              onClick={() => setSelectedDateKey(null)}
              className="text-[9px] font-mono font-bold text-navy-400 hover:text-navy-700 uppercase"
            >
              Clear selection
            </button>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="space-y-2.5">
              {selectedDayEvents.map((evt) => (
                <div 
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="p-3 bg-white border border-navy-950/5 rounded-xl hover:shadow-sm cursor-pointer transition-all flex items-center justify-between hover:border-[#c5a059]/25"
                >
                  <div>
                    <h6 className="font-serif font-black text-navy-950 text-xs uppercase tracking-wide leading-tight">{evt.title}</h6>
                    <p className="text-[9px] font-mono text-navy-400 uppercase tracking-widest mt-1">
                      {evt.location} — {evt.time || 'Time TBA'}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-wider font-mono">View Details &rarr;</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-navy-400 text-[10px] italic flex items-center justify-center gap-2">
              <Info className="w-3.5 h-3.5" /> No scheduled conclave assemblies on this date.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
