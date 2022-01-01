import React from 'react'
import { storesContext } from '../contexts/storesContext'

export const useStores = () => React.useContext(storesContext)