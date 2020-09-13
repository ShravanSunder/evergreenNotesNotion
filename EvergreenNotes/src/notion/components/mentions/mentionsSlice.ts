import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { MentionsState } from 'aNotion/components/mentions/mentionsState';
import { NotionUserRecord } from 'aNotion/types/notionV3/notionRecordTypes';

const initialState: MentionsState = {
   users: {},
};

const saveUser: CaseReducer<
   MentionsState,
   PayloadAction<NotionUserRecord | undefined>
> = (state, action) => {
   let user = action.payload?.value;
   if (user?.id != null) {
      state.users[user.id] = {
         user: user,
         status: thunkStatus.fulfilled,
      };
   }
};

const saveAllUsers: CaseReducer<
   MentionsState,
   PayloadAction<{ [key: string]: NotionUserRecord } | undefined>
> = (state, action) => {
   let users = action.payload;
   if (users != null) {
      Object.keys(users).forEach((k, i) => {
         if (users?.[k].value != null) {
            state.users[k] = {
               user: users?.[k].value,
               status: thunkStatus.fulfilled,
            };
         }
      });
   }
};

const mentionsSlice = createSlice({
   name: 'usersSlice',
   initialState: initialState,
   reducers: {
      saveUser: saveUser,
      saveAllUsers: saveAllUsers,
   },
   extraReducers: {},
});

export const mentionsActions = {
   ...mentionsSlice.actions,
};
export const mentionsReducers = mentionsSlice.reducer;
