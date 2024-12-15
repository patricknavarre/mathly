import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const Subtraction = ({ type = 'basic' }) => {
  return (
    <Box>
      <Typography variant="h4">
        {type === 'basic' ? 'Basic Subtraction' : 'Borrowing Numbers'}
      </Typography>
      {/* Game content will go here */}
    </Box>
  );
};

export default Subtraction; 