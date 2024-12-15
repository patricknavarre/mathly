import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const Addition = ({ type = 'basic' }) => {
  return (
    <Box>
      <Typography variant="h4">
        {type === 'basic' ? 'Basic Addition' : 'Speed Addition'}
      </Typography>
      {/* Game content will go here */}
    </Box>
  );
};

export default Addition; 