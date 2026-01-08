import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useTaskContext } from '../context/TaskContext';

/**
 * Composant calendrier utilisant FullCalendar
 * @param {Object} props
 * @param {Function} props.onDateClick - Callback appelé lors d'un clic sur une date
 * @param {Function} props.onEventClick - Callback appelé lors d'un clic sur un événement
 */
const Calendar = ({ onDateClick, onEventClick }) => {
  const { tasks, updateTask } = useTaskContext();
  const calendarRef = useRef(null);

  /**
   * Convertit les tâches en événements FullCalendar
   */
  const events = tasks.map((task) => {
    // Déterminer la couleur selon la priorité
    let color = '#3b82f6'; // bleu par défaut (medium)
    if (task.priority === 'high') {
      color = '#ef4444'; // rouge
    } else if (task.priority === 'low') {
      color = '#10b981'; // vert
    }

    // Si la tâche est complétée, utiliser une couleur grisée
    if (task.completed) {
      color = '#9ca3af'; // gris
    }

    // Préparer les dates pour FullCalendar
    let startDate = task.startDate || task.createdAt;
    let endDate = task.endDate;
    
    // Si pas de date de fin, utiliser la date de début + 1 jour pour l'affichage
    if (!endDate && startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1);
      endDate = start.toISOString().split('T')[0];
    }

    return {
      id: task.id,
      title: task.title,
      start: startDate,
      end: endDate || startDate,
      allDay: true, // Toutes les tâches sont des événements sur toute la journée
      backgroundColor: color,
      borderColor: color,
      textColor: '#ffffff',
      extendedProps: {
        task: task,
      },
    };
  });

  /**
   * Gère le clic sur une date
   */
  const handleDateClick = (arg) => {
    if (onDateClick) {
      onDateClick(arg.date);
    }
  };

  /**
   * Gère le clic sur un événement
   */
  const handleEventClick = (arg) => {
    if (onEventClick) {
      onEventClick(arg.event.extendedProps.task);
    }
  };

  /**
   * Gère le changement de date d'un événement (drag & drop)
   */
  const handleEventDrop = (arg) => {
    const task = arg.event.extendedProps.task;
    const newStartDate = arg.event.start;
    const newEndDate = arg.event.end || newStartDate;

    // Mettre à jour la tâche avec les nouvelles dates
    updateTask(task.id, {
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
    });
  };

  return (
    <div className="h-full w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale={frLocale}
        firstDay={1} // Lundi comme premier jour
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        aspectRatio={1.8}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
        }}
        className="h-full"
      />
    </div>
  );
};

export default Calendar;

