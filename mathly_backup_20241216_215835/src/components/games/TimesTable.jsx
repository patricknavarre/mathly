import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const TimesTable = ({ type = 'basic' }) => {
  return (
    <Box>
      <Typography variant="h4">
        {type === 'basic' ? 'Times Tables' : 'Speed Multiplication'}
      </Typography>
      {/* Game content will go here */}
    </Box>
  );
};

export default TimesTable; 