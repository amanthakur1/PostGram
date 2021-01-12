export const initialState = null;

export const reducer = (state, action) =>{

    if(action.type === "USER"){
        return action.payload;
    }
    if(action.type === "CLEAR"){
        return null;
    }
    if(action.type === "UPDATE"){
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if(action.type === "UPDATEPIC"){
        return{
            ...state,
            pic:action.payload
        }
    }
    if(action.type === "MESSAGES"){
        if(state && state.messages) return state;
        return{
            ...state,
            messages: action.payload
        }
    }


    if(action.type === "NEW-MESSAGE"){
        const data = action.payload;
        let GlobalStateMessages = state.messages;
        const otherPersonEmail = data.sender.email.toString();
        if(!GlobalStateMessages[otherPersonEmail]){
            GlobalStateMessages[otherPersonEmail] = {};
            GlobalStateMessages[otherPersonEmail].user = data.sender;
            GlobalStateMessages[otherPersonEmail].messages = [];
        }
        GlobalStateMessages[otherPersonEmail].messages.push({by:"other", msg:data.message});
        state.messages = GlobalStateMessages;
        return state;
    }

    return state;
}