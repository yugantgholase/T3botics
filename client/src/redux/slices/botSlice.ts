import type { Conversation } from "../../components/chatbot/ChatRoom";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// const dummyFollowup = [
//   "What are the specific performance metrics that degrade when exceeding the maximum number of devices?",
//   "How does this degradation impact overall system availability?",
//   "Can you provide more information on how to monitor andtroubleshoot MAC authentication issues when exceeding themaximum number of devices?",
// ];

export type WindowSize = "normal" | "minimized" | "maximized";
type ConnectionStatus = "Connecting" | "Connected" | "Failed" | "Disconnected";

interface BotSliceState {
  windowSize: WindowSize;
  conversation: Array<Conversation>;
  followupQuestions: Array<string>;
  connectionStatus: ConnectionStatus;
  responseStream: string;
  isStreaming: boolean;
  isProcessing: boolean;
}

const initialState: BotSliceState = {
  windowSize: "normal",
  conversation: [],
  followupQuestions: [],
  connectionStatus: "Connecting",
  responseStream: "",
  isStreaming: false,
  isProcessing: false,
};

const botSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setWindowSize(state, action: PayloadAction<WindowSize>) {
      state.windowSize = action.payload;
    },

    setConversation(state, action: PayloadAction<Conversation>) {
      state.conversation.push(action.payload);
    },

    setFollowupQuestions(state, action: PayloadAction<Array<string>>) {
      state.followupQuestions = action.payload;
    },

    setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
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
  setWindowSize,
  setConversation,
  setFollowupQuestions,
  setConnectionStatus,
  setResponseStream,
  setIsStreaming,
  setIsProcessing,
} = botSlice.actions;

export default botSlice.reducer;
