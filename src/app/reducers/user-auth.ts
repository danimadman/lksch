import {UserModel} from "../models/account";
import {access_token_key, access_token_type} from "../options/settings";
import * as userAuth from '../actions/user-auth';

export interface IUserState {
    isAuthenticated: boolean;
    user: UserModel | null;
    access_token: string;
    access_token_type: string;
}

const initialState: IUserState = {
    isAuthenticated: false,
    user: null,
    access_token: localStorage.getItem(access_token_key),
    access_token_type: localStorage.getItem(access_token_type)
};

export function userReducers(state = initialState, action: userAuth.Actions): IUserState {
    switch(action.type) {
        case userAuth.ActionTypes.LOGIN_SUCCESS:
        case userAuth.ActionTypes.LOGOUT_SUCCESS:
        case userAuth.ActionTypes.CHECK_AUTH_SUCCESS: {
            return Object.assign({}, state, action.payload)
        }
        default: {
            return state;
        }
    }
}

export const getUserId = (state: IUserState) => state.user.id;

export const getAuthStatus = (state: IUserState) => state.isAuthenticated && state.access_token != null;

export const getUser = (state: IUserState) => state.user;
