import { InitialState } from '@/store/initialState';

type Type = 'setUserInfo' | 'setUserList';

export interface DispatchAction {
  type: Type;
  payload: any;
}

export const reducer = (
  state: InitialState,
  { type, payload }: DispatchAction
): InitialState => {
  switch (type) {
    case 'setUserInfo':
      return {
        ...state,
        userInfo: payload
      };
    case 'setUserList':
      return {
        ...state,
        userList: payload
      };
  }
};
