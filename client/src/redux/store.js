import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import assignmentsSaga from "./assignmentsSaga";
import createSagaMiddleware from "redux-saga";

const sagaMiddleWare = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: () => [sagaMiddleWare],
});

sagaMiddleWare.run(assignmentsSaga);
export default store;
