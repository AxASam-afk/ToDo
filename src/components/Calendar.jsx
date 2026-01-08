import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useTaskContext } from '../context/TaskContext';
import { getDefaultColorByPriority, getColorById } from '../utils/colors';
import { generateRecurringEvents } from '../utils/recurrence';

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
    // Déterminer la couleur : personnalisée > priorité > gris si complétée
    let color;
    if (task.completed) {
      color = '#9ca3af'; // gris pour les tâches complétées
    } else if (task.color) {
      color = getColorById(task.color); // couleur personnalisée
    } else {
      color = getDefaultColorByPriority(task.priority); // couleur par défaut selon priorité
    }

    // Déterminer si la tâche a des heures (timed event) ou est all-day
    const hasTime = task.startDateTime || (task.startTime && task.startDate);
    const hasEndTime = task.endDateTime || (task.endTime && task.endDate);

    let start, end;
    let allDay = true;

    if (hasTime) {
      // Événement avec heure précise
      if (task.startDateTime) {
        start = task.startDateTime;
      } else if (task.startTime && task.startDate) {
        // Construire la date/heure à partir de startDate et startTime
        const [hours, minutes] = task.startTime.split(':').map(Number);
        const startDate = new Date(task.startDate);
        startDate.setHours(hours || 0, minutes || 0, 0, 0);
        start = startDate.toISOString();
      } else {
        start = task.startDate || task.createdAt;
      }

      if (hasEndTime) {
        if (task.endDateTime) {
          end = task.endDateTime;
        } else if (task.endTime && task.endDate) {
          const [hours, minutes] = task.endTime.split(':').map(Number);
          const endDate = new Date(task.endDate);
          endDate.setHours(hours || 0, minutes || 0, 0, 0);
          end = endDate.toISOString();
        } else {
          // Si heure de début mais pas de fin, ajouter 1 heure par défaut
          const startDate = new Date(start);
          startDate.setHours(startDate.getHours() + 1);
          end = startDate.toISOString();
        }
      } else {
        // Si heure de début mais pas de fin, ajouter 1 heure par défaut
        const startDate = new Date(start);
        startDate.setHours(startDate.getHours() + 1);
        end = startDate.toISOString();
      }

      allDay = false;
    } else {
      // Événement all-day
      start = task.startDate || task.createdAt;
      end = task.endDate;
      
      // Si pas de date de fin, utiliser la date de début + 1 jour pour l'affichage
      if (!end && start) {
        const startDate = new Date(start);
        startDate.setDate(startDate.getDate() + 1);
        end = startDate.toISOString().split('T')[0];
      }
    }

    const baseEvent = {
      id: task.id,
      title: task.title,
      start: start,
      end: end || start,
      allDay: allDay,
      backgroundColor: color,
      borderColor: color,
      textColor: '#ffffff',
      editable: true,
      startEditable: true,
      durationEditable: true,
      extendedProps: {
        task: task,
      },
    };

    // Générer les occurrences si la tâche est récurrente
    if (task.recurrenceType && task.recurrenceType !== 'none') {
      return generateRecurringEvents(task, baseEvent, 100);
    }

    return baseEvent;
  }).flat(); // Aplatir le tableau car generateRecurringEvents retourne un tableau

  /**
   * Gère le clic sur une date
   */
  const handleDateClick = (arg) => {
    if (onDateClick) {
      // Si c'est un clic dans timeGrid (vue semaine/jour), passer aussi l'heure
      if (arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay') {
        onDateClick(arg.date);
      } else {
        // Vue mois : passer seulement la date
        onDateClick(arg.date);
      }
    }
  };

  /**
   * Gère le clic sur un événement
   */
  const handleEventClick = (arg) => {
    if (onEventClick) {
      // Toujours passer la tâche principale, même si c'est une occurrence récurrente
      const extendedProps = arg.event.extendedProps;
      onEventClick(extendedProps.task);
    }
  };

  /**
   * Gère le changement de date/heure d'un événement (drag & drop)
   */
  const handleEventDrop = (arg) => {
    const extendedProps = arg.event.extendedProps;
    const task = extendedProps.task;
    
    // Si c'est une occurrence récurrente, on ne modifie que cette occurrence
    // Pour l'instant, on modifie la tâche principale (à améliorer pour gérer les exceptions)
    if (extendedProps.isRecurrence) {
      // Pour les tâches récurrentes, on pourrait créer une exception
      // Pour simplifier, on met à jour la date de début de la série
      const newStart = arg.event.start;
      const newEnd = arg.event.end || newStart;
      const isAllDay = arg.event.allDay;

      if (isAllDay) {
        updateTask(task.id, {
          startDate: newStart.toISOString().split('T')[0],
        });
      } else {
        const startDate = newStart.toISOString().split('T')[0];
        const startTime = `${String(newStart.getHours()).padStart(2, '0')}:${String(newStart.getMinutes()).padStart(2, '0')}`;
        updateTask(task.id, {
          startDate: startDate,
          startTime: startTime,
          startDateTime: newStart.toISOString(),
        });
      }
      return;
    }

    // Tâche normale (non récurrente)
    const newStart = arg.event.start;
    const newEnd = arg.event.end || newStart;
    const isAllDay = arg.event.allDay;

    if (isAllDay) {
      // Événement all-day : mettre à jour seulement les dates
      updateTask(task.id, {
        startDate: newStart.toISOString().split('T')[0],
        endDate: newEnd.toISOString().split('T')[0],
        startTime: null,
        endTime: null,
        startDateTime: null,
        endDateTime: null,
      });
    } else {
      // Événement avec heure : mettre à jour les dates et heures
      const startDate = newStart.toISOString().split('T')[0];
      const startTime = `${String(newStart.getHours()).padStart(2, '0')}:${String(newStart.getMinutes()).padStart(2, '0')}`;
      const endDate = newEnd.toISOString().split('T')[0];
      const endTime = `${String(newEnd.getHours()).padStart(2, '0')}:${String(newEnd.getMinutes()).padStart(2, '0')}`;

      updateTask(task.id, {
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        startDateTime: newStart.toISOString(),
        endDateTime: newEnd.toISOString(),
      });
    }
  };

  /**
   * Gère le redimensionnement d'un événement (changement de durée)
   */
  const handleEventResize = (arg) => {
    const task = arg.event.extendedProps.task;
    const newStart = arg.event.start;
    const newEnd = arg.event.end || newStart;
    const isAllDay = arg.event.allDay;

    if (isAllDay) {
      // Événement all-day : mettre à jour seulement la date de fin
      updateTask(task.id, {
        endDate: newEnd.toISOString().split('T')[0],
      });
    } else {
      // Événement avec heure : mettre à jour l'heure de fin
      const endDate = newEnd.toISOString().split('T')[0];
      const endTime = `${String(newEnd.getHours()).padStart(2, '0')}:${String(newEnd.getMinutes()).padStart(2, '0')}`;

      updateTask(task.id, {
        endDate: endDate,
        endTime: endTime,
        endDateTime: newEnd.toISOString(),
      });
    }
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
        initialDate={new Date()} // Positionner sur aujourd'hui par défaut
        editable={true}
        droppable={true}
        eventResizableFromStart={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={true}
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

