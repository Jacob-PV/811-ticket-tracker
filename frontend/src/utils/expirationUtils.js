/**
 * Expiration status utilities
 */

import { getDaysUntil } from './dateUtils';
import { EXPIRATION_THRESHOLD_DAYS, TICKET_STATUS } from '../lib/constants';

/**
 * Determine ticket status based on expiration date
 */
export function getExpirationStatus(expirationDate) {
  const daysUntil = getDaysUntil(expirationDate);

  if (daysUntil === null) {
    return {
      status: TICKET_STATUS.ACTIVE,
      daysUntil: null,
      isExpired: false,
      isExpiringSoon: false,
      colorClass: 'bg-white border-gray-200',
      badgeClass: 'bg-green-100 text-green-800',
      textColorClass: 'text-gray-900',
    };
  }

  const isExpired = daysUntil < 0;
  const isExpiringSoon = daysUntil >= 0 && daysUntil <= EXPIRATION_THRESHOLD_DAYS;

  let status = TICKET_STATUS.ACTIVE;
  let colorClass = 'bg-white border-gray-200';
  let badgeClass = 'bg-green-100 text-green-800';
  let textColorClass = 'text-gray-900';

  if (isExpired) {
    status = TICKET_STATUS.EXPIRED;
    colorClass = 'bg-red-50 border-l-4 border-l-red-500';
    badgeClass = 'bg-red-100 text-red-800 font-bold';
    textColorClass = 'text-red-900';
  } else if (isExpiringSoon) {
    status = TICKET_STATUS.EXPIRING_SOON;
    colorClass = 'bg-yellow-50 border-l-4 border-l-yellow-500';
    badgeClass = 'bg-yellow-100 text-yellow-800 font-semibold';
    textColorClass = 'text-yellow-900';
  }

  return {
    status,
    daysUntil,
    isExpired,
    isExpiringSoon,
    colorClass,
    badgeClass,
    textColorClass,
  };
}

/**
 * Get human-readable status text
 */
export function getStatusText(expirationDate) {
  const { daysUntil, isExpired, isExpiringSoon } = getExpirationStatus(expirationDate);

  if (daysUntil === null) return 'Unknown';
  if (isExpired) return `EXPIRED (${Math.abs(daysUntil)} days ago)`;
  if (isExpiringSoon) return `${daysUntil} day${daysUntil === 1 ? '' : 's'} remaining`;
  return `${daysUntil} days remaining`;
}
