import { create } from 'zustand'
import { Club } from '@/types'

interface ClubState {
  club: Club | null
  setClub: (club: Club | null) => void
}

export const useClubStore = create<ClubState>((set) => ({
  club: null,
  setClub: (club) => set({ club }),
}))