import { createContext } from 'react';

const store = createContext([]);

export * from './reducer';
export * from './initialState';

export default store;
