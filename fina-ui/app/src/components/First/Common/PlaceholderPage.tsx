/**
 * Placeholder Page Component
 * Used for modules that are not yet fully implemented
 */
import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Construction } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const history = useHistory();

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This module is currently under development. The full implementation will follow
          the same patterns established in the Registration module.
        </Typography>
        <Box mt={3}>
          <Button
            variant="contained"
            onClick={() => history.push('/first')}
          >
            Back to FIRST Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;
