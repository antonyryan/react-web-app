import { makeStyles  } from '@material-ui/styles';
import colors from 'helpers/colors';


export default makeStyles(theme => ({
  fullHeight: {
    minHeight: '100vh',
    display: 'flex',
  },

  fullWidth: {
    position: 'absolute',
    left: '0',
    width: '100%'
  },

  formPanel: {
    display: 'flex',
    flexDirection: 'column',

    '& .MuiFormControl-root': {
      margin: '0.5em 0'
    }
  },

  textTitle: {
    fontSize: '25px',
    fontWeight: 'bold',
    letterSpacing: '1.5px',

    [theme.breakpoints.only('xs')]: {
      fontSize: '18px'
    }
  },

  textTitleFixed: {
    fontSize: '25px',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    
  },

  textSubTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
  },

  textSizeA: {
    fontSize: '34px',
  },

  textSizeB: {
    fontSize: '30px',
  },

  textSizeC: {
    fontSize: '25px'
  },

  textSizeD: {
    fontSize: '20px',
  },

  textPrimary: {
    color: colors.text.primary.primary
  },

  textContrast: {
    color: colors.text.primary.contrast
  },

  textNormal: {
    color: colors.text.primary.normal
  },

  textLight: {
    color: colors.text.primary.light
  },

  textGray: {
    color: colors.text.primary.gray
  },

  textInverseNormal: {
    color: colors.text.inverse.normal
  },

  textInverseHighlight: {
    color: colors.text.inverse.highlight
  }
}));