export interface UserInfo {
  name: string;
  uid: string;
  email: string;
  avatar: string;
}

export interface InitialState {
  userInfo: UserInfo;
  userList: UserInfo[];
}

export const initialState: InitialState = {
  userInfo: null,
  userList: []
};
