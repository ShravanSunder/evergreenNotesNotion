const notionPageContentClass = 'notion-page-content';
const notionPageControlsClass = 'notion-page-controls';
export function reduceNotionContentPadding(notionApp: HTMLElement) {
   let notionPageContent = notionApp.getElementsByClassName(
      notionPageContentClass
   )[0] as HTMLElement;
   let notionPageControlParent = notionApp.getElementsByClassName(
      notionPageControlsClass
   )[0].parentElement as HTMLElement;

   const offset = ' - 40px ';
   //only pages have conent
   // notion lists do not
   if (notionPageContent != null) {
      notionPageContent.style.paddingLeft =
         notionPageContent.style.paddingLeft + offset;
      notionPageContent.style.paddingRight =
         notionPageContent.style.paddingRight + offset;
      notionPageControlParent.style.paddingLeft =
         notionPageControlParent.style.paddingLeft + offset;
      notionPageControlParent.style.paddingRight =
         notionPageControlParent.style.paddingRight + offset;
   }
}
