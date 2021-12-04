import React from 'react';

const ResultItemPlaceholder: React.FC = () => {
  return (
  <article className="cursor-pointer" role="button" tabIndex={0} >
    <div className="w-full h-96 bg-white"></div>
    <div className="text-white  mt-2 "><span className="h-6 w-64 bg-white block"></span></div>
    <div className="text-white  mt-2 "><span className="h-4 w-24 bg-white block"></span></div>
  </article>
)};

export default ResultItemPlaceholder;
