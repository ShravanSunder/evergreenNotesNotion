import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useBlockStyles } from './useBlockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { hasValidChildren } from 'aUtilities/reactHelpers';
import * as ReactIs from 'react-is';

export const BulletUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let classes = useBlockStyles();

   const textUIComponent = (
      <TextUi
         block={block}
         semanticFilter={semanticFilter}
         style={style}
         interactive={interactive}></TextUi>
   );

   const d = ReactIs.isElement(textUIComponent);
   console.log(d);
   if (!hasValidChildren(textUIComponent)) {
      return null;
   }

   return (
      <Grid
         id="BulletUI"
         container
         justify="flex-start"
         style={style}
         className={classes.blockUiGrids}>
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.bulletsAndIndents}>
               <Typography display={'inline'} variant={'body1'}>
                  {' • '}
               </Typography>
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            {textUIComponent}
         </Grid>
      </Grid>
   );
};
