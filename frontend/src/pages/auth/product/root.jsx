import { useState } from 'react'
import Content from './content';
import Bar from './bar';
import Supplement from './supplement';
import { createContext } from 'react';
import '../css/product.css'

export const supplementOpenContext = createContext();


export default function Root() {
    const [supplementOpened, setOpened] = useState('block');
    return (
      <>
        <Bar />
        <supplementOpenContext.Provider value={[supplementOpened, setOpened]}>
          <Content />
          <Supplement />
        </supplementOpenContext.Provider>
      </>
  
    );
  }