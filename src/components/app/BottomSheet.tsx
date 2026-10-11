import type { ReactNode } from "react"
import { AnimatePresence, motion, useDragControls } from "framer-motion"

/**
 * A sheet that rises from the bottom of the phone column. Drag the handle down (or
 * tap the shade) to dismiss — the body stays free to scroll.
 */
export default function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const controls = useDragControls()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-[#0d1a12]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            className="fixed inset-x-0 bottom-0 z-[81] mx-auto flex max-h-[88vh] max-w-[480px] flex-col rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.18)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragListener={false}
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, i) => (i.offset.y > 110 || i.velocity.y > 600) && onClose()}
          >
            <div onPointerDown={(e) => controls.start(e)} className="flex shrink-0 cursor-grab touch-none justify-center pb-2 pt-3">
              <span className="h-1.5 w-10 rounded-full bg-k-ink/15" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
