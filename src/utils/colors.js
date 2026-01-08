/**
 * Palette de couleurs professionnelles pour les tâches
 * Couleurs douces et cohérentes avec le thème
 */

export const TASK_COLORS = [
  {
    id: 'blue',
    name: 'Bleu',
    value: '#3b82f6', // blue-500
    light: '#dbeafe', // blue-100
    dark: '#1e40af', // blue-800
  },
  {
    id: 'indigo',
    name: 'Indigo',
    value: '#6366f1', // indigo-500
    light: '#e0e7ff', // indigo-100
    dark: '#3730a3', // indigo-800
  },
  {
    id: 'purple',
    name: 'Violet',
    value: '#8b5cf6', // purple-500
    light: '#ede9fe', // purple-100
    dark: '#5b21b6', // purple-800
  },
  {
    id: 'pink',
    name: 'Rose',
    value: '#ec4899', // pink-500
    light: '#fce7f3', // pink-100
    dark: '#9f1239', // pink-800
  },
  {
    id: 'red',
    name: 'Rouge',
    value: '#ef4444', // red-500
    light: '#fee2e2', // red-100
    dark: '#991b1b', // red-800
  },
  {
    id: 'orange',
    name: 'Orange',
    value: '#f97316', // orange-500
    light: '#ffedd5', // orange-100
    dark: '#9a3412', // orange-800
  },
  {
    id: 'amber',
    name: 'Ambre',
    value: '#f59e0b', // amber-500
    light: '#fef3c7', // amber-100
    dark: '#92400e', // amber-800
  },
  {
    id: 'yellow',
    name: 'Jaune',
    value: '#eab308', // yellow-500
    light: '#fef9c3', // yellow-100
    dark: '#854d0e', // yellow-800
  },
  {
    id: 'lime',
    name: 'Lime',
    value: '#84cc16', // lime-500
    light: '#ecfccb', // lime-100
    dark: '#365314', // lime-800
  },
  {
    id: 'green',
    name: 'Vert',
    value: '#10b981', // green-500
    light: '#d1fae5', // green-100
    dark: '#065f46', // green-800
  },
  {
    id: 'emerald',
    name: 'Émeraude',
    value: '#14b8a6', // emerald-500
    light: '#d1fae5', // emerald-100
    dark: '#064e3b', // emerald-800
  },
  {
    id: 'teal',
    name: 'Sarcelle',
    value: '#06b6d4', // teal-500
    light: '#ccfbf1', // teal-100
    dark: '#164e63', // teal-800
  },
];

/**
 * Obtient la couleur par défaut selon la priorité
 */
export const getDefaultColorByPriority = (priority) => {
  switch (priority) {
    case 'high':
      return TASK_COLORS.find(c => c.id === 'red')?.value || '#ef4444';
    case 'medium':
      return TASK_COLORS.find(c => c.id === 'blue')?.value || '#3b82f6';
    case 'low':
      return TASK_COLORS.find(c => c.id === 'green')?.value || '#10b981';
    default:
      return TASK_COLORS.find(c => c.id === 'blue')?.value || '#3b82f6';
  }
};

/**
 * Obtient une couleur par son ID
 */
export const getColorById = (colorId) => {
  return TASK_COLORS.find(c => c.id === colorId)?.value || getDefaultColorByPriority('medium');
};

