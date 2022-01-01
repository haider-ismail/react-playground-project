import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import history from '../../history';

import { useStores } from '../../hooks/useStores'

import './SearchForm.scss';

interface IProps {
  submitHandler?: () => void;
  cssClasses?: string;
}

const SearchForm: React.FC<IProps> = ({ submitHandler, cssClasses }) => { 
  const { resultsStore } = useStores()
  const [keyword, setKeyword] = useState<string|null>(null)
  const firstUpdate = useRef(true);

  const handleSubmit = (e: FormEvent) =>  {
    if(e) e.preventDefault()

    if (submitHandler) submitHandler()
  }

  // Utilising useEffect hook and timeout to only trigger search when user stops typing
  useEffect(() => {
    console.log('use effect');
    
    const typingTimeoutId = setTimeout(() => {
      if (!resultsStore) return

      // Skip for first render 
      if (firstUpdate.current) return firstUpdate.current = false

      resultsStore.setKeyword(keyword as string)

      history.push({
        pathname: '/results',
        search: resultsStore.getQueryParamsString()
      })
    }, 500)
    return () => clearTimeout(typingTimeoutId)
    // eslint-disable-next-line
  }, [keyword, resultsStore])
  
  return (
    <form className={`flex justify-center w-full md:max-w-md relative mt-4 sm:mt-0 ${cssClasses}`} onSubmit={e => { ( submitHandler ? handleSubmit(e) : e.preventDefault() ) }}>
      <input type="search" 
        className="md:w-80 border-white border-2 p-4"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value)
        }}
        id="keyword"
        value={(keyword !== null ? keyword : resultsStore?.keyword)} 
        placeholder="Type to search..." 
        aria-controls="resultsListing"
      />

      { submitHandler && <button type="submit" className="bg-white p-4 text-black">Search</button> }
    </form>     
  );
}

export default observer(SearchForm);
