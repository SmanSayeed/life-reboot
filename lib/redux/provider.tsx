"use client"

import type React from "react"

import { store } from "./store"
import { Provider } from "react-redux"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
