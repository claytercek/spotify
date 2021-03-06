import * as types from './actionTypes';
import fetch from 'cross-fetch';
import { apiUrl } from '../constants/constants';

export const updateTokenSuccess = (access_token, expires_in) => ({
	type: types.UPDATE_TOKEN_SUCCESS,
	access_token,
	expires_in
});

export const updateToken = () => dispatch => {
	return fetch(apiUrl + `/auth/token`, {
		method: 'GET'
	})
		.then(res => res.json(), error => console.log('Error fetching token.', error))
		.then(res => {
			if (res) {
				dispatch(updateTokenSuccess(res.access_token, res.expires_in));
			}
		});
};

export const groupJoin = (groupID, isHost) => ({
	type: types.GROUP_JOIN,
	groupID,
	isHost
});

export const setHostToken = token => ({
	type: types.SET_HOST_TOKEN,
	token
});

export const setName = name => ({
	type: types.SET_NAME,
	name
});
