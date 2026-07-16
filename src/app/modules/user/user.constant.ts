export const userSearchableFields: readonly string[] = ['email', "profile.name"] as const;
export const userFilterableFields: readonly string[] = ['email', 'status', 'role_id', 'searchTerm'] as const;