export const useRenderSession = () => ({
  session: {
    namespaces: {
      store: {
        channel: { value: '1' },
      },
    },
  },
  loading: false,
})
