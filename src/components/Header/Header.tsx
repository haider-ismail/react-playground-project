import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import ResultsStore from '../../stores/resultsStore';
import history from '../../history';

// hooks
import useGetCurrentPath from '../../hooks/getCurrentPath'

import './Header.scss';
interface IProps {
  resultsStore?: ResultsStore;
}

const Header: React.FC<IProps> = ({ resultsStore }) => {

  const [typingTimeoutId, setTypingTimeoutId] = useState<any>('');
  const [keyword, setKeyword] = useState<string>('');

  console.log('useGetCurrentPath', useGetCurrentPath());
  
  return (
    <header className="py-8 md:pt-16 md:pb-10">
      <div className="container mx-auto">
          <div className="flex flex-wrap align-center justify-between">
              <Link to="/" aria-label="Home" className="block flex items-center text-white">
                <svg fill="currentColor" className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="504" height="720" viewBox="0 0 504 720"><title>Asset 1</title><rect width="144" height="720"/><rect x="144" y="360" width="144" height="144"/><rect x="360" y="180" width="144" height="540"/><rect x="216" y="180" width="144" height="144"/><rect x="360" width="144" height="144"/></svg>
              </Link>

              { useGetCurrentPath() === '/results' && 
                <form className="w-full md:max-w-md relative mt-4 sm:mt-0" onSubmit={e => { e.preventDefault() }}>
                  <input type="search" 
                    className="border-2 px-3 py-2 w-full  border-white text-white font-bold pr-"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const target = e.target || null
                      // this.setState({ keyword: target.value })
                      setKeyword(target.value)

                      if(typingTimeoutId) clearTimeout(typingTimeoutId)

                      setTypingTimeoutId(
                        setTimeout(() => {
                          if (resultsStore) {
                            resultsStore.setKeyword(target.value)

                            history.push({
                              pathname: '/results',
                              search: resultsStore.getQueryParamsString()
                            })
                          } 
                        }, 500)
                      )
                    }}
                    id="keyword"
                    value={keyword} 
                    placeholder="Search here..." 
                  />

                  <button className="absolute right-0 top-0 p-2 mr-2" arial-label="Search" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { if (resultsStore) resultsStore.setKeyword(keyword) }}>
                    <svg arial-hidden="true" width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="4.32532" height="11.9069" transform="matrix(0.656241 -0.754551 0.650927 0.75914 13.6467 17.3515)" fill="#fff"/> <rect width="2.16265" height="6.49465" transform="matrix(0.656237 -0.754555 0.650923 0.759144 13 15.0356)" fill="#fff"/> <circle cx="8.5" cy="8.5" r="7" stroke="#fff" strokeWidth="3"/> </svg>
                  </button>
                </form>
              } 
          </div>
      </div>
    </header>
  );
}

export default inject('resultsStore')(observer(Header));
