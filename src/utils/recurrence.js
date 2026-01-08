/**
 * Utilitaires pour la génération d'occurrences récurrentes
 */

/**
 * Génère les occurrences d'une tâche récurrente
 * @param {Object} task - Tâche avec récurrence
 * @param {Date|string} startDate - Date de début
 * @param {number} maxOccurrences - Nombre maximum d'occurrences à générer (défaut: 100)
 * @returns {Array<Date>} Tableau des dates d'occurrences
 */
export const generateRecurrenceDates = (task, startDate, maxOccurrences = 100) => {
  if (!task.recurrenceType || task.recurrenceType === 'none') {
    return [new Date(startDate)];
  }

  const start = new Date(startDate);
  const occurrences = [new Date(start)];
  const interval = task.recurrenceInterval || 1;
  const endDate = task.recurrenceEndDate ? new Date(task.recurrenceEndDate) : null;

  let currentDate = new Date(start);
  let count = 1;

  while (count < maxOccurrences) {
    // Calculer la prochaine occurrence selon le type
    if (task.recurrenceType === 'daily') {
      currentDate.setDate(currentDate.getDate() + interval);
    } else if (task.recurrenceType === 'weekly') {
      currentDate.setDate(currentDate.getDate() + (7 * interval));
    } else if (task.recurrenceType === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + interval);
    }

    // Vérifier si on dépasse la date de fin
    if (endDate && currentDate > endDate) {
      break;
    }

    occurrences.push(new Date(currentDate));
    count++;
  }

  return occurrences;
};

/**
 * Génère les événements FullCalendar pour une tâche récurrente
 * @param {Object} task - Tâche avec récurrence
 * @param {Object} baseEvent - Événement de base (sans récurrence)
 * @param {number} maxOccurrences - Nombre maximum d'occurrences
 * @returns {Array<Object>} Tableau d'événements FullCalendar
 */
export const generateRecurringEvents = (task, baseEvent, maxOccurrences = 100) => {
  if (!task.recurrenceType || task.recurrenceType === 'none') {
    return [baseEvent];
  }

  const startDate = new Date(baseEvent.start);
  const occurrences = generateRecurrenceDates(task, startDate, maxOccurrences);

  return occurrences.map((date, index) => {
    const eventStart = new Date(date);
    const eventEnd = baseEvent.end 
      ? new Date(date.getTime() + (new Date(baseEvent.end) - new Date(baseEvent.start)))
      : new Date(date);

    return {
      ...baseEvent,
      id: `${task.id}_${index}`,
      start: eventStart.toISOString(),
      end: eventEnd.toISOString(),
      extendedProps: {
        ...baseEvent.extendedProps,
        isRecurrence: true,
        originalTaskId: task.id,
        occurrenceIndex: index,
      },
    };
  });
};

