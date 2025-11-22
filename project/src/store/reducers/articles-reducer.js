import { ActionTypes } from "../constants";

const initialState = {
  list: [],
};

export const articlesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_ARTICLES:
      return {
        ...state,
        list: action.payload,
      };

    case ActionTypes.LIKE_ARTICLE: {
      const { articleId, delta } = action.payload;

      return {
        ...state,
        list: state.list.map((item) =>
          item.articleId === articleId
            ? { ...item, currentLikes: item.currentLikes + delta }
            : item
        ),
      };
    }

    case ActionTypes.SET_COMMENTS_COUNT: {
      const { articleId, count } = action.payload;

      return {
        ...state,
        list: state.list.map((item) =>
          item.articleId === articleId
            ? { ...item, commentsCount: count }
            : item
        ),
      };
    }

    default:
      return state;
  }
};