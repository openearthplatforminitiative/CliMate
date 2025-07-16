import { Issue } from "@/types/issue"
import { atom } from "jotai"

export const createIssueCoordinatesAtom = atom<{ lat: number; lng: number }>()

export const currentIssueAtom = atom<Issue>()
