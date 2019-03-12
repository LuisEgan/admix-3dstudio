import actionTypes from "../actions/actionsTypes";

const initialState = {
  lastUpdate: 0,
  light: false,
  count: 0
}

const actionsMap = {
  [actionTypes.TICK]: (state, action) => {
    return Object.assign({}, state, {
      lastUpdate: action.ts,
      light: !!action.light
    })
  },

  [actionTypes.ADD]: (state, action) => {
    return Object.assign({}, state, {
      count: state.count + 1
    })
  },
};

const reducer = (state = initialState, action = {}) => {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
};

export default reducer;
