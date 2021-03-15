import { InitialState } from '@/store/initialState';

type Type = 'setUserInfo' | 'setUserList';

export const reducer = (
  state: InitialState,
  { type, payload }: { type: Type; payload: any }
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
