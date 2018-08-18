import { FETCH_QUEUE_SUCCESS } from "../actions/actionTypes";

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_QUEUE_SUCCESS:
			return action.data;
		default:
			return state;
	}
};
