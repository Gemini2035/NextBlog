'use client'

import { ToastContainer as GeminiToastContainer, toast } from 'gemini-uis'

const ToastContainer = () => {
  return <GeminiToastContainer />
}

export default ToastContainer;
export { toast }
export type { ToastOptions, ToastType, ToastInstance } from 'gemini-uis'