import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { formatDateForInput } from './utils/dateHelpers';

/**
 * Composant principal de l'application
 * Gère le layout et la logique principale
 */
const AppContent = () => {
  const { toggleDarkMode, darkMode } = useTaskContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  /**
   * Gère le clic sur une date du calendrier
   */
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  /**
   * Gère le clic sur un événement du calendrier
   */
  const handleEventClick = (task) => {
    setSelectedTask(task);
    setSelectedDate(null);
    setShowTaskForm(true);
  };

  /**
   * Gère le clic sur une tâche de la liste
   */
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setSelectedDate(null);
    setShowTaskForm(true);
  };

  /**
   * Ferme le formulaire et réinitialise les états
   */
  const handleCloseForm = () => {
    setShowTaskForm(false);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  /**
   * Ouvre le formulaire pour créer une nouvelle tâche
   */
  const handleNewTask = () => {
    setSelectedTask(null);
    setSelectedDate(null);
    setShowTaskForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                📋 Todo App
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gestion professionnelle de vos tâches
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Bouton nouveau */}
              <button
                onClick={handleNewTask}
                className="btn-primary flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nouvelle tâche
              </button>

              {/* Toggle dark mode */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Basculer le thème"
              >
                {darkMode ? (
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Sidebar - Liste des tâches */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="card h-full">
              <TaskList onTaskClick={handleTaskClick} />
            </div>
          </aside>

          {/* Zone principale - Calendrier */}
          <section className="lg:col-span-2">
            <div className="card h-full">
              <Calendar
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            </div>
          </section>
        </div>

        {/* Liste des tâches mobile (visible uniquement sur petits écrans) */}
        <div className="lg:hidden mt-6">
          <div className="card">
            <TaskList onTaskClick={handleTaskClick} />
          </div>
        </div>
      </main>

      {/* Formulaire modal */}
      {showTaskForm && (
        <TaskForm
          task={selectedTask}
          initialDate={selectedDate ? formatDateForInput(selectedDate) : null}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

/**
 * Composant App avec le Provider
 */
const App = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;

