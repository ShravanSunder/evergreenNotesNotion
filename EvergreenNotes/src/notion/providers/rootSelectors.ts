import { RootState } from 'aNotion/providers/rootReducer';

export const sidebarExtensionSelector = (state: RootState) =>
   state.sidebarExtension;
export const currentPageSelector = (state: RootState) =>
   state.sidebarExtension.currentNotionPage;
export const referenceSelector = (state: RootState) => state.references;
export const contentSelector = (state: RootState) => state.content;
export const blockSelector = (state: RootState) => state.blocks;
export const mentionSelector = (state: RootState) => state.mentions;
export const pageMarksSelector = (state: RootState) => state.pageMarks;
