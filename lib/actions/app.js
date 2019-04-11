import actionsTypes from './actionsTypes';
const { SET_SELECTED } = actionsTypes;

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

export default {
  setSelected,
};
