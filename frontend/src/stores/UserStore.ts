import { create } from 'zustand'

type UserState = {
  userId: number | undefined;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  updateUserId: (id: number) => void;
}

export const UserStore = create<UserState>((set) => ({
  userId: undefined,
  firstName: 'Ryan',
  lastName: 'Towner',
  email: 'ryan@towner.com',
  role: 1,
  updateUserId: (id: number) => set(() => ({userId: id})),
  updateFirstName: (first: string) => set(() => ({firstName: first})),
  updateLastName: (last: string) => set(() => ({lastName: last})),
  updateEmail: (email: string) => set(() => ({email: email})),
  updateRole: (id: number) => set(() => ({role: id})),
}))