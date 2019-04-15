import actionsTypes from '../actions/actionsTypes';
import STR from '../utils/strFuncs';
const { SET_SELECTED } = actionsTypes;

const initialState = {
  selectedCampaign: null,
  selectedGroup: null,
};

const actionsMap = {
  [SET_SELECTED]: (state, action) => {
    let { selectItem, value } = action;
    return {
      ...state,
      [`selected${STR.capitalizeFirstLetter(selectItem)}`]: value,
    };
  },
};

const reducer = (state = initialState, action = {}) => {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
};

export default reducer;
