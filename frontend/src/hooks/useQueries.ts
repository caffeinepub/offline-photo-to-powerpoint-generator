import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// Placeholder for future backend integration
// Currently, the app handles everything client-side

export function useBackendHealth() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      if (!actor) return { status: 'disconnected' };
      return { status: 'connected' };
    },
    enabled: !!actor && !isFetching,
  });
}
