import actionsTypes from './actionsTypes';
const { SET_SELECTED, RESET_SELECTED } = actionsTypes;

const setSelected = ({ selectItem, value }) => dispatch => {
  try {
    dispatch({
      type: SET_SELECTED,
      selectItem,
      value,
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

const resetSelected = () => dispatch => {
  try {
    dispatch({
      type: RESET_SELECTED,
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

export default {
  setSelected,
  resetSelected,
};
