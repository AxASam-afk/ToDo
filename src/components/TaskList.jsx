import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { formatDateDisplay, isPast } from '../utils/dateHelpers';
import { getDefaultColorByPriority, getColorById } from '../utils/colors';
import TaskForm from './TaskForm';

/**
 * Composant affichant la liste des tâches avec filtrage
 */
const TaskList = ({ onTaskClick }) => {
  const { tasks, toggleTask, deleteTask } = useTaskContext();
  const [filter, setFilter] = useState('all'); // all, active, completed, priority
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, low, medium, high
  const [editingTask, setEditingTask] = useState(null);

  /**
   * Obtient la couleur selon la priorité
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    }
  };

  /**
   * Filtre les tâches selon les critères sélectionnés
   */
  const filteredTasks = tasks.filter((task) => {
    // Filtre par statut
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;

    // Filtre par priorité
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  /**
   * Trie les tâches : non complétées en premier, puis par priorité
   */
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Tâches non complétées en premier
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Puis par priorité (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const handleEdit = (task, e) => {
    e.stopPropagation();
    setEditingTask(task);
  };

  const handleDelete = (taskId, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec filtres */}
      <div className="mb-4 space-y-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Mes Tâches ({filteredTasks.length})
        </h2>

        {/* Filtres par statut */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Actives
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Terminées
          </button>
        </div>

        {/* Filtre par priorité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priorité
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">Toutes les priorités</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Aucune tâche à afficher</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick && onTaskClick(task)}
              className={`card p-4 cursor-pointer hover:shadow-xl transition-all duration-200 ${
                task.completed
                  ? 'opacity-60 bg-gray-50 dark:bg-gray-900'
                  : ''
              } ${
                task.endDate && isPast(task.endDate) && !task.completed
                  ? 'border-l-4 border-red-500'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                />

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-gray-900 dark:text-gray-100 ${
                      task.completed ? 'line-through' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Dates */}
                  {(task.startDate || task.endDate) && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {task.startDate && (
                        <span>Début: {formatDateDisplay(task.startDate)}</span>
                      )}
                      {task.startDate && task.endDate && ' • '}
                      {task.endDate && (
                        <span
                          className={
                            isPast(task.endDate) && !task.completed
                              ? 'text-red-500 font-medium'
                              : ''
                          }
                        >
                          Fin: {formatDateDisplay(task.endDate)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Badge priorité et couleur */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {/* Indicateur de couleur */}
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{
                        backgroundColor: task.color
                          ? getColorById(task.color)
                          : getDefaultColorByPriority(task.priority),
                      }}
                      title={`Couleur: ${task.color || 'par défaut'}`}
                    />
                    {/* Badge priorité */}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority === 'high'
                        ? 'Haute'
                        : task.priority === 'medium'
                        ? 'Moyenne'
                        : 'Basse'}
                    </span>
                    {/* Badge récurrence */}
                    {task.recurrenceType && task.recurrenceType !== 'none' && (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                        🔁 {task.recurrenceType === 'daily' ? 'Quotidien' : task.recurrenceType === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleEdit(task, e)}
                    className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    aria-label="Modifier"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDelete(task.id, e)}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    aria-label="Supprimer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal d'édition */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;

