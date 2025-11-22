import { combineReducers } from "redux";
import { articlesReducer } from "./articles-reducer";

export const rootReducer = combineReducers({
  articles: articlesReducer,
});