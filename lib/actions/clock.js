import actionTypes from "./actionsTypes";

const serverRenderClock = isServer => dispatch => {
  return dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() });
};

const startClock = () => dispatch => {
  return setInterval(
    () => dispatch({ type: actionTypes.TICK, light: true, ts: Date.now() }),
    800,
  );
};

const addCount = () => dispatch => {
  return dispatch({ type: actionTypes.ADD });
};

export default {
  serverRenderClock,
  startClock,
  addCount,
};
