import React from 'react';
import { Link } from "react-router-dom";

// hooks
import useCurrentPath from '../../hooks/currentPath'

import SearchForm from '../SearchForm'

const Header: React.FC = () => { 
  return (
    <header className="py-8 md:pt-16 md:pb-10">
      <div className="container mx-auto">
          <div className="flex flex-wrap align-center justify-between">
              <Link to="/" aria-label="Home" className="block flex items-center text-white">
                <svg fill="currentColor" className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="504" height="720" viewBox="0 0 504 720"><title>Asset 1</title><rect width="144" height="720"/><rect x="144" y="360" width="144" height="144"/><rect x="360" y="180" width="144" height="540"/><rect x="216" y="180" width="144" height="144"/><rect x="360" width="144" height="144"/></svg>
              </Link>

              { useCurrentPath() === '/results' && 
                <SearchForm />
              } 
          </div>
      </div>
    </header>
  );
}

export default Header;