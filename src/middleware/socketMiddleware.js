import { QUEUE_TRACK, GROUP_JOIN, VOTE_UP, VOTE_DOWN, VOTE_NEUTRAL } from "../actions/actionTypes";
import { fetchQueue, fetchNowPlaying } from "../actions/queueActions";
import { playTrack } from "../actions/playbackActions";
import { apiUrl } from "../constants/constants";
import io from "socket.io-client";

var socket = null;

export function socketMiddleware(store) {
	return next => action => {
		const result = next(action);
		const session = store.getState().session;

		if (socket) {
			switch (action.type) {
				case QUEUE_TRACK: {
					socket.emit("queueTrack", action.id, session.group, session.user_id, session.name);
					break;
				}
				case VOTE_UP: {
					socket.emit("voteUp", action.trackIndex, session.group, session.user_id);
					break;
				}
				case VOTE_DOWN: {
					socket.emit("voteDown", action.trackIndex, session.group, session.user_id);
					break;
				}
				case VOTE_NEUTRAL: {
					socket.emit("voteNeutral", action.trackIndex, session.group, session.user_id);
					break;
				}
				case GROUP_JOIN: {
					socket.emit("groupJoin", action.groupID, action.isHost);
					break;
				}
				default:
					break;
			}
		}

		return result;
	};
}
export default function(store) {
	socket = io.connect(
		apiUrl,
		{ "reconnection limit": 3000, "max reconnection attempts": Number.MAX_VALUE, "connect timeout": 7000 }
	);

	socket.on("disconnect", function() {
		alert("disconnected");
	});

	socket.on("reconnecting", function(attempt) {
		alert("reconnecting", attempt);
	});

	socket.on("reconnect_error", function(error) {
		alert("reconnect error", error);
	});

	socket.on("updateQueue", () => {
		store.dispatch(fetchQueue());
	});

	socket.on("updateNowPlaying", () => {
		store.dispatch(fetchQueue());
		store.dispatch(fetchNowPlaying());
	});

	socket.on("play track", track => {
		store.dispatch(playTrack(track));
	});

	// todo: manage end song, end queue
}
