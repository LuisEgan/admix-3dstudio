import actionsTypes from "./actionsTypes";
const { SET_LOGIN } = actionsTypes;

const login = ({ email, password }) => async dispatch => {
  try {
    //  const { accessToken, adminToken } = api.login({email, password});

    const data = {
      isLoggedIn: true,
      accessToken: "sfefew",
      adminToken: "sfefew",
    };

    dispatch({
      type: SET_LOGIN,
      data,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

const logout = () => dispatch => {
  const data = {
    isLoggedIn: false,
    accessToken: null,
    adminToken: null,
  };

  dispatch({
    type: SET_LOGIN,
    data,
  });
};

export default {
  login,
  logout,
};
