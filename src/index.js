import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom/client'

// Helpers
import './styles/main.scss'

// Components
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
