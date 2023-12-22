import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import assignmentListSaga from "./saga/assignmentListSaga";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";

const sagaMiddleWare = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: () => [sagaMiddleWare],
});

sagaMiddleWare.run(rootSaga);
export default store;
