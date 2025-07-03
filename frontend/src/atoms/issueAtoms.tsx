import { atom } from "jotai";

export const createIssueCoordinatesAtom = atom<{ lat: number, lng: number }>()