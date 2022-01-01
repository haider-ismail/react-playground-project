import React from 'react'
import { StoresContext } from '../contexts/storesContext'

export const useStores = () => React.useContext(StoresContext)