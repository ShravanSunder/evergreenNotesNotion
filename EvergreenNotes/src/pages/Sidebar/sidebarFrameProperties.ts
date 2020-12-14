export const appPositionTop = () => 43;
export const appScrollMargin = 18;
export const minFrameWidth = 290;
export const appWidth = (wWidth: number) =>
   Math.max(wWidth * 0.27, minFrameWidth);
export const appPositionLeft = (wWidth: number) =>
   wWidth - appWidth(wWidth) - appScrollMargin;
export const appHeight = (wHeight: number) =>
   Math.max(wHeight - appPositionTop() - 1, 400);
export const menuPadding = 0;
