export const appPositionTop = () => 45;
export const appPositionLeft = (wWidth: number) =>
   wWidth - appWidth(wWidth) - 3;
export const appWidth = (wWidth: number) => Math.max(wWidth * 0.25, 290);
export const appHeight = (wHeight: number) =>
   Math.max(wHeight - appPositionTop() - 2, 400);
