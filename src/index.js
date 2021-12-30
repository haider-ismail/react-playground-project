import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
