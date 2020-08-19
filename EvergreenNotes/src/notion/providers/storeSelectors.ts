import { RootState } from 'aNotion/providers/rootReducer';
export const cookieSelector = (state: RootState) => state.site.cookie;
export const navigationSelector = (state: RootState) => state.site.navigation;
export const currentRecordSelector = (state: RootState) =>
   state.site.currentPageRecord;
export const referenceSelector = (state: RootState) => state.references;
export const contentSelector = (state: RootState) => state.content;
export const blockSelector = (state: RootState) => state.blocks;
export const pageMarksSelector = (state: RootState) => state.pageMarks;
