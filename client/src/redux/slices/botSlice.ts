import type { Conversation } from "../../components/chatbot/ChatRoom";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BotSliceState {
  conversation: Array<Conversation>;
  connectionStatus: string;
  responseStream: string;
  isStreaming: boolean;
  isProcessing: boolean;
}

const initialState: BotSliceState = {
  // socket: null,
  conversation: [],
  connectionStatus: "Connecting...",
  responseStream: "",
  isStreaming: false,
  isProcessing: false,
};

const botSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<Conversation>) {
      state.conversation.push(action.payload);
    },

    setConnectionStatus(state, action: PayloadAction<string>) {
      state.connectionStatus = action.payload;
    },

    setResponseStream(state, action: PayloadAction<string>) {
      state.responseStream = action.payload;
    },

    setIsStreaming(state, action: PayloadAction<boolean>) {
      state.isStreaming = action.payload;
    },

    setIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload;
    },
  },
});

export const {
  setConversation,
  setConnectionStatus,
  setResponseStream,
  setIsStreaming,
  setIsProcessing,
} = botSlice.actions;

export default botSlice.reducer;
