import { atom } from "jotai";

export const bottomSheetSnapPointsAtom = atom([-40, 400, 100]);
export const bottomSheetCurrentSnapIndexAtom = atom(1);
export const bottomSheetCurrentSnapAtom = atom((get) => {
  const snapPoints = get(bottomSheetSnapPointsAtom);
  const currentIndex = get(bottomSheetCurrentSnapIndexAtom);
  return snapPoints[currentIndex];
});