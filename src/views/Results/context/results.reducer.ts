const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "UPDATE_VALUE": {
      return {
        ...state,
        [action.key]: action.value
      };
    }
    default:
      return state;
  }
};

export default reducer;
