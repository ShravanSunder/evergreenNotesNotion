import React, { Suspense, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import manifest from '../../../manifest.json';
import coffeeDark from '../../../assets/img/buymeacoffee-dark.png';
import coffeeLight from '../../../assets/img/buymeacoffee-light.png';
import patreonRed from '../../../assets/img/patreon-red.png';

import {
   makeStyles,
   createStyles,
   Typography,
   Grid,
   Link,
   useTheme,
} from '@material-ui/core';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import {
   LoadingSection,
   NothingToFind,
} from 'aNotion/components/common/Loading';
import { appOptions, saveOptionsToStorage } from './optionsService';
import { AppOptions, AppOptionDescriptions } from './optionsTypes';

const useStyles = makeStyles(() =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 36,
         marginBottom: 12,
         fontVariant: 'small-caps',
      },
      spacing: {
         marginBottom: 42,
      },
      paragraphs: {
         paddingTop: 6,
         paddingBottom: 6,
      },
   })
);

export const OptionsPane = () => {
   let classes = useStyles();

   const [options, setOptions] = useState<AppOptions>();
   const theme = useTheme();
   const isDark = theme.palette.type === 'dark';

   useEffect(() => {
      setOptions(appOptions);
   }, []);

   useEffect(() => {
      //TODO change this later, when we have more options.
      if (options != null) {
         saveOptionsToStorage(options);
      }
   }, [options]);

   const aboutText1 =
      '📝 Notion is a great tool, wonderful to organize your life.  However there are a few things missing with regards to seeing the connection between your different notes and topics. ';
   const aboutText2 =
      '🔰 Evergreen Notes brings the power of networked notes and combines it with Notions organization, powerful database system and beautiful design.It makes it easy to see your related notes use networked knowledge management to produce better work. All your references, backlinks relations and mentions are right in the sidebar.';

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            <div className={classes.spacing}></div>
            <Typography className={classes.sections} variant="h4">
               <b>Information</b>
            </Typography>
            <div className={classes.paragraphs}></div>
            <Grid container style={{ marginLeft: 9 }}>
               <Grid item>
                  <Typography>{aboutText1}</Typography>
                  <div className={classes.paragraphs}></div>
                  <div className={classes.paragraphs}></div>
                  <Typography>{aboutText2}</Typography>
                  <div className={classes.paragraphs}></div>
                  <div className={classes.paragraphs}></div>
                  <Link
                     variant="body1"
                     target="_blank"
                     href="https://www.notion.so/shravansunder/Evergreen-Notes-For-Notion-e35e6ed4dd5a45b19bf2de2bb86b1a7e">
                     🤙🏾 Find out more here! Feel free to leave comments or email
                     me any questions!
                  </Link>
               </Grid>
            </Grid>
            <></>
            <div className={classes.spacing}></div>
            <Typography className={classes.sections} variant="h4">
               <b>Support and Donations</b>
            </Typography>
            <div className={classes.paragraphs}></div>
            <Grid container style={{ marginLeft: 9 }}>
               <Grid item xs={12}>
                  {!isDark && (
                     <a
                        href="https://www.buymeacoffee.com/ShravanSunder"
                        target="_blank">
                        <img
                           style={{ height: 40 }}
                           src={coffeeLight}
                           alt="Buy me a coffee"></img>
                     </a>
                  )}
                  {isDark && (
                     <a
                        href="https://www.buymeacoffee.com/ShravanSunder"
                        target="_blank">
                        <img
                           style={{ height: 40 }}
                           src={coffeeDark}
                           alt="Buy me a coffee"></img>
                     </a>
                  )}
                  <div className={classes.paragraphs}></div>
                  <div className={classes.paragraphs}></div>
                  <a
                     href="https://www.patreon.com/bePatron?u=47159909"
                     target="_blank">
                     <img
                        style={{ height: 40 }}
                        src={patreonRed}
                        alt="Support me on Patreon"></img>
                  </a>
               </Grid>
            </Grid>
            <></>
            <div className={classes.spacing}></div>
            <Typography className={classes.sections} variant="h4">
               <b>About</b>
            </Typography>
            <div className={classes.paragraphs}></div>
            <Grid container style={{ marginLeft: 9 }}>
               <Grid item xs={12}>
                  <Typography>
                     <strong>Version:</strong> v{manifest.version}
                  </Typography>
                  <Typography display="inline">
                     <strong>Details: </strong>
                  </Typography>
                  <Link
                     variant="subtitle1"
                     target="_blank"
                     href="https://www.notion.so/shravansunder/Evergreen-Notes-For-Notion-e35e6ed4dd5a45b19bf2de2bb86b1a7e">
                     Website
                  </Link>
                  <div />
                  <Typography display="inline">
                     <strong>Roadmap: </strong>
                  </Typography>
                  <Link
                     variant="subtitle1"
                     target="_blank"
                     href="https://www.notion.so/shravansunder/Roadmap-v2-07efd42cac0b41528d32f87ad68a838f">
                     Roadmap
                  </Link>
                  <div></div>
                  <Typography display="inline">
                     <strong>Contact: </strong>
                  </Typography>
                  <Link
                     variant="subtitle1"
                     target="_blank"
                     href="mailto:evergreen.software.dev@gmail.com">
                     evergreen.software.dev@gmail.com
                  </Link>
               </Grid>
            </Grid>
         </Suspense>
      </ErrorBoundary>
   );
};

export default OptionsPane;
