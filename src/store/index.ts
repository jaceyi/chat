import { createContext, Dispatch } from 'react';
import { initialState, InitialState } from './initialState';
import { DispatchAction } from './reducer';

const store = createContext<[InitialState, Dispatch<DispatchAction>?]>([
  initialState
]);

export * from './reducer';
export * from './initialState';

export default store;
