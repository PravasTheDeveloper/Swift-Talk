import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./SliderRedux";
import chattingReducer from "./ChattingRedux"
import userdetaisReducer from "./UserRedux"

const store = configureStore({
    reducer: {
        slider: sliderReducer,
        chatting: chattingReducer,
        userdetails: userdetaisReducer
    },
});

export default store