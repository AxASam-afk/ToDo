/**
 * Utilitaires pour la manipulation des dates
 */

/**
 * Formate une date au format YYYY-MM-DD
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formate une date pour l'affichage
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée (ex: "15 janvier 2024")
 */
export const formatDateDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formate une date et heure pour l'affichage
 * @param {Date|string} date - Date à formater
 * @returns {string} Date et heure formatées
 */
export const formatDateTimeDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Vérifie si une date est aujourd'hui
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean}
 */
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Vérifie si une date est passée
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean}
 */
export const isPast = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

/**
 * Obtient la date de début de la journée
 * @param {Date|string} date - Date
 * @returns {Date} Date avec heure à 00:00:00
 */
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Obtient la date de fin de la journée
 * @param {Date|string} date - Date
 * @returns {Date} Date avec heure à 23:59:59
 */
export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Formate une heure au format HH:MM pour les inputs time
 * @param {Date|string} date - Date avec heure
 * @returns {string} Heure formatée (HH:MM)
 */
export const formatTimeForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Combine une date et une heure en un objet Date
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @param {string} timeStr - Heure au format HH:MM
 * @returns {Date|null} Date combinée ou null si dateStr est vide
 */
export const combineDateAndTime = (dateStr, timeStr) => {
  if (!dateStr) return null;
  if (!timeStr) return new Date(dateStr);
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(dateStr);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
};

/**
 * Obtient la date d'aujourd'hui au format YYYY-MM-DD
 * @returns {string} Date d'aujourd'hui
 */
export const getTodayDate = () => {
  return formatDateForInput(new Date());
};

