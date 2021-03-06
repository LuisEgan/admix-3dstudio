import actionsTypes from '../actions/actionsTypes';
import STR from '../utils/strFuncs';
const { SET_SELECTED, RESET_SELECTED } = actionsTypes;

const initialState = {
  selectedCampaign: {},
  selectedGroup: {},
  selectedCreative: {},
};

const actionsMap = {
  [SET_SELECTED]: (state, action) => {
    let { selectItem, value } = action;
    return {
      ...state,
      [`selected${STR.capitalizeFirstLetter(selectItem)}`]: value,
    };
  },

  [RESET_SELECTED]: (state, action) => {
    return {
      ...state,
      selectedCampaign: {},
      selectedGroup: {},
      selectedCreative: {},
    };
  },
};

const reducer = (state = initialState, action = {}) => {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
};

export default reducer;
