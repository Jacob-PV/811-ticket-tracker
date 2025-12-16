/**
 * Tickets data hook using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tickets as ticketsAPI } from '../lib/api';

export function useTickets(filters = {}) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsAPI.list(filters),
  });

  const createTicket = useMutation({
    mutationFn: (ticketData) => ticketsAPI.create(ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-stats'] });
    },
  });

  const updateTicket = useMutation({
    mutationFn: ({ id, data }) => ticketsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-stats'] });
    },
  });

  const renewTicket = useMutation({
    mutationFn: ({ id, newExpirationDate }) => ticketsAPI.renew(id, newExpirationDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-stats'] });
    },
  });

  const deleteTicket = useMutation({
    mutationFn: (id) => ticketsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-stats'] });
    },
  });

  return {
    tickets: data?.tickets || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
    createTicket,
    updateTicket,
    renewTicket,
    deleteTicket,
  };
}

export function useTicket(ticketId) {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsAPI.get(ticketId),
    enabled: !!ticketId,
  });
}

export function useTicketStats() {
  return useQuery({
    queryKey: ['ticket-stats'],
    queryFn: () => ticketsAPI.stats(),
  });
}
