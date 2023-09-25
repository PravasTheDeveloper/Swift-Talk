import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchChatsAsync = createAsyncThunk(
    "chats/fetchChats",
    async () => {
        try {
            const response = await fetch(`/api/userchatting`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const Status = response.status;
            const Chats = await response.json();

            return { Chats, Status };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

const chattingSlice = createSlice({
    name: "chatting",
    initialState: {
        data: [],
        status: null,
        loading: false,
    },
    reducers: {
        openSearchSliders: (state) => {
            state.status = 200
        },

        addLatestChatting: (state, action) => {

            const chatId = action.payload.selectedChatCompare;
            const content = action.payload.newMessageReceived.content

            const foundChat = state.data.find((data) => data._id === chatId);

            foundChat.letestMessege.content = content
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.Status;
                state.data = action.payload.Chats;
            })
            .addCase(fetchChatsAsync.rejected, (state) => {
                state.loading = false;
                state.status = 400;
            });
    },
});

export const { openSearchSliders, addLatestChatting } = chattingSlice.actions;

export default chattingSlice.reducer;