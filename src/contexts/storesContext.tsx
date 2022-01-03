import React from 'react'
import { UIStore } from '../stores/uiStore'

export const StoresContext = React.createContext({
  uiStore: new UIStore()
})