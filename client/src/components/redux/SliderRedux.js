import { createSlice } from "@reduxjs/toolkit"

const sliderSlice = createSlice({
    name: "slider",
    initialState: {
        searchSlider: false,
        createGroup: false
    },
    reducers: {
        openSearchSlider: (state) => {
            state.searchSlider = true
        },

        closeSearchSlider: (state) => {
            state.searchSlider = false
        },

        openCreateGroup: (state) => {
            state.createGroup = true
        },

        closeCreateGroup: (state) => {
            state.createGroup = false
        }
    },
});

export const { openSearchSlider, closeSearchSlider, openCreateGroup, closeCreateGroup } = sliderSlice.actions;

export default sliderSlice.reducer;