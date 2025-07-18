// In a real application, this data would come from a secure database
// and passwords would be hashed (e.g., using bcrypt).
export const USERS = Array.from({ length: 40 }, (_, i) => ({
  username: `user${i + 1}`,
  password: `password${i + 1}`, // In a real app, store hashed passwords
}))
