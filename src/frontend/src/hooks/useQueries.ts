// This app works fully offline — no backend actor calls are needed from the frontend.
// Stub exported to satisfy any existing imports.

export function useBackendHealth() {
  return { data: { status: "offline-app" }, isLoading: false, error: null };
}
