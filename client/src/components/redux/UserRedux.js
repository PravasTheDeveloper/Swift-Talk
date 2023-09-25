import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserDetails = createAsyncThunk(
    "users/fetchUsers",
    async () => {
        try {
            const response = await fetch(`/api/userdetails`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const Status = response.status;
            const User = await response.json();

            // if(!User){
            
            // }
            
            return { User, Status };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

const userdetaisSlice = createSlice({
    name: "userdetails",
    initialState: {
        userdata: [],
        status: null,
        loading: false,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.Status;
                state.userdata = action.payload.User;
                
            })
            .addCase(fetchUserDetails.rejected, (state) => {
                state.loading = false;
                state.status = 400;
            });
    },
});

export const { } = userdetaisSlice.actions;

export default userdetaisSlice.reducer;