export const appPositionTop = () => 43;
export const appWidth = (wWidth: number) => Math.max(wWidth * 0.25, 290);
export const appPositionLeft = (wWidth: number) =>
   wWidth - appWidth(wWidth) - 21;
export const appHeight = (wHeight: number) =>
   Math.max(wHeight - appPositionTop() - 1, 400);
