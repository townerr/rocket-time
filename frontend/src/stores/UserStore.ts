import { create } from 'zustand'

export const UserStore = create((set) => ({
  userId: '',
  firstName: '',
  lastName: '',
  updateUserId: (id: string) => set(() => ({userId: id})),
  updateFirstName: (first: string) => set(() => ({firstName: first})),
  updateLastName: (last: string) => set(() => ({lastName: last})),
}))