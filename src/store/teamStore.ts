import { create } from 'zustand'
import { Team, Player } from '@/types'

interface TeamState {
  team: Team | null
  players: Player[]
  selectedPlayers: Player[]
  setTeam: (team: Team | null) => void
  setPlayers: (players: Player[]) => void
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
  clearTeam: () => void
}

export const useTeamStore = create<TeamState>((set) => ({
  team: null,
  players: [],
  selectedPlayers: [],
  setTeam: (team) => set({ team }),
  setPlayers: (players) => set({ players }),
  addPlayer: (player) =>
    set((state) => ({
      selectedPlayers: [...state.selectedPlayers, player],
    })),
  removePlayer: (playerId) =>
    set((state) => ({
      selectedPlayers: state.selectedPlayers.filter((p) => p.id !== playerId),
    })),
  clearTeam: () => set({ selectedPlayers: [] }),
}))