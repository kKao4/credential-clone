export interface IClickedSmallImage {
  index: number;
  clicked: boolean;
}

export type IAction =
  | {
      type: "toggleClickedImage";
      index: number;
      value: boolean;
    }
  | {
      type: "setClickedSmallImages";
      value: IClickedSmallImage[];
    };

export function clickedSmallImagesReducer(state: IClickedSmallImage[], action: IAction) {
  switch (action.type) {
    case "setClickedSmallImages":
      return action.value;
    case "toggleClickedImage":
      const { index, value } = action;
      return state.map((item) => {
        if (index === item.index) {
          return { ...item, clicked: value };
        }
        return item;
      });
    default:
      throw new Error("Reducer error");
  }
}
