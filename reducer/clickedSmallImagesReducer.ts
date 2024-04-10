interface IClickedSmallImage {
  index: number;
  clicked: boolean;
}

interface IAction {
  type: "toggleClickedImage";
  index: number;
  value: boolean;
}

export function clickedSmallImagesReducer(state: IClickedSmallImage[], action: IAction) {
  switch (action.type) {
    case "toggleClickedImage":
      const { index, value } = action;
      return state.map((item) => {
        if (index === item.index) {
          return { ...item, clicked: value };
        }
        return { ...item };
      });
    default:
      throw new Error("Reducer error");
  }
}
