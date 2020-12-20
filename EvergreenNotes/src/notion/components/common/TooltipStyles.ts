import { withStyles, Theme, Tooltip } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const LightTooltip = withStyles((theme: Theme) => ({
   tooltip: {
      backgroundColor: grey[100],
      color: grey[800],
      boxShadow: theme.shadows[1],
      fontSize: 11,
   },
}))(Tooltip);
