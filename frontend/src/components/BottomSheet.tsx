"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Sheet, SheetProps, SheetRef } from "react-modal-sheet"

type BottomSheetProps = SheetProps & {
	snapPoint: number
	children: React.ReactNode
}

const BottomSheet = forwardRef<SheetRef, BottomSheetProps>((props, ref) => {
	const sheetRef = useRef<SheetRef>(null)

	useImperativeHandle(ref, () => sheetRef.current as SheetRef, [])

	useEffect(() => {
		const sheet = sheetRef.current
		if (sheet) {
			if (props.snapPoints && props.snapPoint < props.snapPoints.length) {
				sheet.snapTo(props.snapPoint)
			} else {
				sheet.snapTo(0)
			}
		}
	}, [props.snapPoint, props.snapPoints])

	const handleClose = () => {
		props.onClose()
		const sheet = sheetRef.current
		if (sheet) {
			sheet.snapTo(props.snapPoints?.length || 0)
		}
	}

	return (
		<Sheet ref={sheetRef} {...props} onClose={handleClose}>
			{props.children}
		</Sheet>
	)
})

BottomSheet.displayName = "BottomSheet"

export default BottomSheet
