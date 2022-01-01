import React from 'react'
import { ResultsStore } from '../stores/resultsStore'
import { UIStore } from '../stores/uiStore'

export const StoresContext = React.createContext({
  resultsStore: new ResultsStore(),
  uiStore: new UIStore()
})