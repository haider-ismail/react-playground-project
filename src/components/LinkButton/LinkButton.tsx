import React from 'react';

import { History } from 'history'

interface IProps { 
  to: string,
  history: History
}

const LinkButton: React.FC<IProps> = (props) => { 
  const {
    history,
    to,
  } = props

  const handleClick = () => {
    history.push(to)
  }

  return (
      <button onClick={() => handleClick()} >
        Click me
    </button>
  );
}

export default LinkButton;