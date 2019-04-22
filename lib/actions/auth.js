import actionsTypes from './actionsTypes';
const { SET_LOGIN } = actionsTypes;

const login = ({ accessToken, id }) => async dispatch => {
  console.log('id: ', id);
  console.log('accessToken: ', accessToken);
  try {
    const data = {
      isLoggedIn: true,
      accessToken,
      adminToken: 'sfefew',
      id,
    };

    dispatch({
      type: SET_LOGIN,
      data,
    });
  } catch (error) {
    console.log('error: ', error);
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
