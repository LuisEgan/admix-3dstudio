import actionsTypes from "../actions/actionsTypes";
const { SET_LOGIN } = actionsTypes;

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  adminToken: null,
};

const actionsMap = {
  [SET_LOGIN]: (state, action) => {
    let { isLoggedIn, accessToken, adminToken } = action.data;
    adminToken = adminToken || null;
    return {
      ...state,
      isLoggedIn,
      accessToken,
      adminToken,
    };
  },
};

const reducer = (state = initialState, action = {}) => {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
};

export default reducer;
