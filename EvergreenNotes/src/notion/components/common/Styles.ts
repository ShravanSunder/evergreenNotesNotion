import { withStyles, Theme, Tooltip } from '@material-ui/core';

export const LightTooltip = withStyles((theme: Theme) => ({
   tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
   },
}))(Tooltip);
