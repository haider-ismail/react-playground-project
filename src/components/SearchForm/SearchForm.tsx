import React, { useContext, useState, useEffect, useRef, FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import history from '../../history';

// contexts
import { ResultsContext } from "../../contexts/resultsStoreContext";

// hooks 
import useCurrentPath from '../../hooks/currentPath'

import './SearchForm.scss';

interface IProps {
  submitHandler?: () => void;
  cssClasses?: string;
}

const SearchForm: React.FC<IProps> = ({ submitHandler, cssClasses }) => { 
  const  { keyword, updateKeyword, getQueryParamsString } = useContext(ResultsContext);
  const currentPath = useCurrentPath()
  const [localKeyword, setLocalKeyword] = useState<string>('')
  const firstUpdate = useRef(true);

  const handleSubmit = (e: FormEvent) =>  {
    if(e) e.preventDefault()

    if (submitHandler) submitHandler()
  }

  // Utilising useEffect hook and timeout to only trigger search when user stops typing
  useEffect(() => {    
    const typingTimeoutId = setTimeout(() => {

      // Skip for first render 
      if (firstUpdate.current) return firstUpdate.current = false;

      (currentPath === '/results'  ? updateKeyword(localKeyword as string, true) :  updateKeyword(localKeyword as string, false))

      console.log('keyword', keyword);
      console.log('getQueryParamsString:', getQueryParamsString());

      history.push({
        pathname: '/results',
        search: `?keyword=${localKeyword}`
      })
    }, 500)
    return () => clearTimeout(typingTimeoutId)
  }, [localKeyword, keyword])
  
  return (
    <form className={`flex justify-center w-full md:max-w-md relative mt-4 sm:mt-0 ${cssClasses}`} onSubmit={e => { ( submitHandler ? handleSubmit(e) : e.preventDefault() ) }}>
      <input type="search" 
        className="md:w-80 border-white border-2 p-4"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLocalKeyword(e.target.value)
        }}
        id="keyword"
        value={(localKeyword !== '' ? localKeyword : keyword)} 
        placeholder="Type to search..." 
        aria-controls="resultsListing"
      />

      { submitHandler && <button type="submit" className="bg-white p-4 text-black">Search</button> }
    </form>     
  );
}

export default observer(SearchForm);
