export interface UserInfo {
  name: string;
  uid: string;
  email: string;
  avatar: string;
  state: string;
  disabled?: boolean;
}

export interface InitialState {
  userInfo: UserInfo | null;
  userList: UserInfo[];
}

export const initialState: InitialState = {
  userInfo: null,
  userList: []
};
