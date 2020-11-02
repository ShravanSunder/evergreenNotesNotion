export const appPositionTop = () => 43;
export const appScrollMargin = 18;
export const appWidth = (wWidth: number) => Math.max(wWidth * 0.25, 290);
export const appPositionLeft = (wWidth: number) =>
   wWidth - appWidth(wWidth) - appScrollMargin;
export const appHeight = (wHeight: number) =>
   Math.max(wHeight - appPositionTop() - 1, 400);
