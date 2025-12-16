/**
 * Application constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || '811 Ticket Tracker';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const TICKET_STATUS = {
  ACTIVE: 'active',
  EXPIRING_SOON: 'expiring_soon',
  EXPIRED: 'expired',
  RENEWED: 'renewed',
};

export const USER_ROLES = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
};

export const US_STATES = [
  { code: 'VA', name: 'Virginia' },
  { code: 'MD', name: 'Maryland' },
  { code: 'DC', name: 'District of Columbia' },
];

export const EXPIRATION_THRESHOLD_DAYS = 5;
