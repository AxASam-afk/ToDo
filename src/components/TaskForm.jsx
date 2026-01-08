import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { formatDateForInput, formatTimeForInput, combineDateAndTime, getTodayDate } from '../utils/dateHelpers';

/**
 * Composant formulaire pour ajouter ou modifier une tâche
 * @param {Object} props
 * @param {Object|null} props.task - Tâche à modifier (null pour création)
 * @param {Function} props.onClose - Fonction appelée à la fermeture
 * @param {string|null} props.initialDate - Date initiale pour la création (format YYYY-MM-DD)
 * @param {Date|null} props.initialDateTime - Date/heure initiale pour la création (avec heure)
 */
const TaskForm = ({ task = null, onClose, initialDate = null, initialDateTime = null }) => {
  const { addTask, updateTask } = useTaskContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: getTodayDate(), // Date par défaut = aujourd'hui
    endDate: '',
    startTime: '',
    endTime: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState({});

  // Charger les données de la tâche si en mode édition, ou utiliser initialDate pour création
  useEffect(() => {
    if (task) {
      // Extraire la date et l'heure si elles existent
      const startDateTime = task.startDateTime ? new Date(task.startDateTime) : null;
      const endDateTime = task.endDateTime ? new Date(task.endDateTime) : null;
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: task.startDate ? formatDateForInput(task.startDate) : (startDateTime ? formatDateForInput(startDateTime) : getTodayDate()),
        endDate: task.endDate ? formatDateForInput(task.endDate) : (endDateTime ? formatDateForInput(endDateTime) : ''),
        startTime: startDateTime ? formatTimeForInput(startDateTime) : '',
        endTime: endDateTime ? formatTimeForInput(endDateTime) : '',
        priority: task.priority || 'medium',
      });
    } else if (initialDateTime) {
      // Si une date/heure est fournie (clic dans timeGrid), pré-remplir date et heure
      setFormData({
        title: '',
        description: '',
        startDate: formatDateForInput(initialDateTime),
        endDate: '',
        startTime: formatTimeForInput(initialDateTime),
        endTime: '',
        priority: 'medium',
      });
    } else if (initialDate) {
      // Si seulement une date est fournie (clic dans dayGrid), pré-remplir seulement la date
      setFormData((prev) => ({
        ...prev,
        startDate: initialDate,
      }));
    }
  }, [task, initialDate, initialDateTime]);

  /**
   * Gère les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Valide le formulaire
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    // Validation des dates
    if (formData.startDate && formData.endDate) {
      const start = combineDateAndTime(formData.startDate, formData.startTime) || new Date(formData.startDate);
      const end = combineDateAndTime(formData.endDate, formData.endTime) || new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'La date/heure de fin doit être après la date/heure de début';
      }
    }

    // Validation des heures si les deux sont renseignées
    if (formData.startTime && formData.endTime && formData.startDate === formData.endDate) {
      const [startH, startM] = formData.startTime.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      if (endH < startH || (endH === startH && endM <= startM)) {
        newErrors.endTime = "L'heure de fin doit être après l'heure de début";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Combiner dates et heures si les heures sont renseignées
    const startDateTime = formData.startTime && formData.startDate 
      ? combineDateAndTime(formData.startDate, formData.startTime)
      : null;
    
    const endDateTime = formData.endTime && formData.endDate
      ? combineDateAndTime(formData.endDate, formData.endTime)
      : null;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      startTime: formData.startTime || null,
      endTime: formData.endTime || null,
      startDateTime: startDateTime ? startDateTime.toISOString() : null,
      endDateTime: endDateTime ? endDateTime.toISOString() : null,
      priority: formData.priority,
    };

    if (task) {
      // Mode édition
      updateTask(task.id, taskData);
    } else {
      // Mode création
      addTask(taskData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Ex: Réunion équipe"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              rows="3"
              placeholder="Détails de la tâche..."
            />
          </div>

          {/* Date de début */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Date de début
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Date de fin */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Date de fin
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`input-field ${errors.endDate ? 'border-red-500' : ''}`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>

          {/* Heure de début */}
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Heure de début <span className="text-xs text-gray-500">(optionnel)</span>
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="input-field"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Si vide, la tâche sera sur toute la journée
            </p>
          </div>

          {/* Heure de fin */}
          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Heure de fin <span className="text-xs text-gray-500">(optionnel)</span>
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Si vide, la tâche sera sur toute la journée
            </p>
          </div>

          {/* Priorité */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Priorité
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary flex-1">
              {task ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

