import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import ResultsStore from '../../stores/resultsStore';
import history from '../../history';

// hooks
import useCurrentPath from '../../hooks/currentPath'

import './Header.scss';

interface IProps {
  resultsStore?: ResultsStore;
}

const Header: React.FC<IProps> = ({ resultsStore }) => { 
  const [keyword, setKeyword] = useState<string>('')
  const firstUpdate = useRef(true);

  // Utilising useEffect hook and timeout to only trigger search when user stops typing
  useEffect(() => {
    console.log('[useEffect] -->')
    
    const typingTimeoutId = setTimeout(() => {
      if (resultsStore) {
        // TODO: If keyword is empty on intiial render, do not update store, but we still want it to update store keyword if keyword is empty on subsequent query searches

        if (firstUpdate.current) {
          firstUpdate.current = false;
          return
        }

        resultsStore.setKeyword(keyword)

        history.push({
          pathname: '/results',
          search: resultsStore.getQueryParamsString()
        })
      }
    }, 500)
    return () => clearTimeout(typingTimeoutId)
  }, [keyword])
  
  return (
    <header className="py-8 md:pt-16 md:pb-10">
      <div className="container mx-auto">
          <div className="flex flex-wrap align-center justify-between">
              <Link to="/" aria-label="Home" className="block flex items-center text-white">
                <svg fill="currentColor" className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="504" height="720" viewBox="0 0 504 720"><title>Asset 1</title><rect width="144" height="720"/><rect x="144" y="360" width="144" height="144"/><rect x="360" y="180" width="144" height="540"/><rect x="216" y="180" width="144" height="144"/><rect x="360" width="144" height="144"/></svg>
              </Link>

              { useCurrentPath() === '/results' && 
                <form className="w-full md:max-w-md relative mt-4 sm:mt-0" onSubmit={e => { e.preventDefault() }}>
                  <input type="search" 
                    className="border-2 px-3 py-2 w-full  border-white text-white font-bold pr-"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setKeyword(e.target.value)
                    }}
                    id="keyword"
                    value={keyword} 
                    placeholder="Type to search..." 
                    aria-controls="resultsListing"
                  />
                </form>
              } 
          </div>
      </div>
    </header>
  );
}

export default inject('resultsStore')(observer(Header));
