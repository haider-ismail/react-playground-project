import React, { useContext, useState, useEffect, useRef, FormEvent } from 'react';
import history from '../../history';

// contexts
import { ResultsStoreContext } from "../../contexts/resultsStoreContext";

import './SearchForm.scss';

interface IProps {
  submitHandler?: () => void;
  cssClasses?: string;
}

const SearchForm: React.FC<IProps> = ({ submitHandler, cssClasses }) => { 
  const  { keyword, setKeyword } = useContext(ResultsStoreContext);


  const [localKeyword, setLocalKeyword] = useState<string>('')
  const firstUpdate = useRef(true);

  const handleSubmit = async (e: FormEvent) =>  {
    if(e) e.preventDefault()

    if (submitHandler) submitHandler()
  }

  // Utilising useEffect hook and timeout to only trigger search when user stops typing
  useEffect(() => {    
    const typingTimeoutId = setTimeout(() => {
      // Skip for first render 
      if (firstUpdate.current) { 
        if (keyword) setLocalKeyword(keyword)
        return firstUpdate.current = false;
      }

      history.push({
        pathname: '/results',
        search: `?keyword=${localKeyword}`
      })

      setKeyword(localKeyword as string);
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
        value={localKeyword} 
        placeholder="Type to search..." 
        aria-controls="resultsListing"
      />

      { submitHandler && <button type="submit" className="bg-white p-4 text-black">Search</button> }
    </form>     
  );
}

export default SearchForm;
