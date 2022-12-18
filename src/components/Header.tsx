import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";


export const Header = () => {
  return (
    <Box component='header' sx={{
        display: 'flex',
        height: '7vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e9e9e9'
      }}>
        <Typography>Test tasks</Typography>
      </Box>
  )
}
