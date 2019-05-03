import actionsTypes from '../actions/actionsTypes';
const { SET_LOGIN } = actionsTypes;

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  adminToken: null,
  userId: null,
};

const actionsMap = {
  [SET_LOGIN]: (state, action) => {
    let { isLoggedIn, accessToken, adminToken, id: userId } = action.data;
    adminToken = adminToken || null;
    return {
      ...state,
      isLoggedIn,
      accessToken,
      adminToken,
      userId,
    };
  },
};

const reducer = (state = initialState, action = {}) => {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
};

export default reducer;
