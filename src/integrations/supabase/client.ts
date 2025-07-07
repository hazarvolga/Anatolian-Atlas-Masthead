// Placeholder file to prevent import errors during migration
// This file will be removed after completing the migration to local PostgreSQL

console.warn('⚠️ Supabase client is deprecated. Please use the backend API instead.');

// Mock supabase client to prevent errors
export const supabase = {
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Deprecated' } }) }) }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Deprecated' } }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Deprecated' } }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Deprecated' } }) }),
  }),
  functions: {
    invoke: () => Promise.resolve({ data: null, error: { message: 'Deprecated' } })
  }
};
