import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexte pour la gestion globale des tâches
 * Utilise localStorage pour la persistance
 */

const TaskContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte des tâches
 */
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

/**
 * Provider pour le contexte des tâches
 */
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    // Charger les tâches depuis localStorage au démarrage
    const savedTasks = localStorage.getItem('todoApp_tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
        return [];
      }
    }
    return [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    // Charger le thème depuis localStorage
    const savedTheme = localStorage.getItem('todoApp_darkMode');
    return savedTheme === 'true';
  });

  // Sauvegarder les tâches dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('todoApp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Appliquer le thème sombre au document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('todoApp_darkMode', darkMode.toString());
  }, [darkMode]);

  /**
   * Ajouter une nouvelle tâche
   */
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  /**
   * Mettre à jour une tâche existante
   */
  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  /**
   * Supprimer une tâche
   */
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /**
   * Basculer l'état de complétion d'une tâche
   */
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Basculer le mode sombre
   */
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const value = {
    tasks,
    darkMode,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleDarkMode,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

