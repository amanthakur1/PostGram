export const chatInitialState = null;

export const chatReducer = (chatState, action) => {
    if(action.type === "INIT"){
        return { chatData : [] };
    }

    if(action.type === "CLEAR"){
        return chatInitialState;
    }

    // New Message Received/Sent
    if(action.type === "NEW_MESSAGE"){
        return {
            chatData: [
                ...chatState.chatData,
                {
                    msg: action.payload.message,
                    by: action.payload.by,
                    email: action.payload.otherUserEmail
                }
            ]
        }
    }

    return chatState;
}