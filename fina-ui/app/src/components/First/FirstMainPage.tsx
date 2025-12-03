/**
 * FIRST Module Main Page
 * Landing page for the FIRST module with quick access to all features
 */
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import {
  Description,
  Task,
  Business,
  Quiz,
  Category,
  Dashboard,
  Block,
  Verified,
  CardMembership,
  Search,
} from '@mui/icons-material';

interface ModuleCard {
  title: string;
  description: string;
  path: string;
  icon: React.ReactElement;
  color: string;
}

const FirstMainPage: React.FC = () => {
  const history = useHistory();

  const modules: ModuleCard[] = [
    {
      title: 'FI Registration',
      description: 'Manage financial institution registrations, changes, and cancellations',
      path: '/first/registration',
      icon: <Description fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Dashboard',
      description: 'View analytics and statistics for financial institutions',
      path: '/first/dashboard',
      icon: <Dashboard fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Tasks',
      description: 'Manage workflow tasks and approvals',
      path: '/first/tasks',
      icon: <Task fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Organizations',
      description: 'Manage organizations and individuals registry',
      path: '/first/organization',
      icon: <Business fontSize="large" />,
      color: '#9c27b0',
    },
    {
      title: 'Questionnaires',
      description: 'Configure questionnaires for registration processes',
      path: '/first/questionnaire',
      icon: <Quiz fontSize="large" />,
      color: '#0288d1',
    },
    {
      title: 'FI Types',
      description: 'Configure financial institution types and workflows',
      path: '/first/fi-types',
      icon: <Category fontSize="large" />,
      color: '#d32f2f',
    },
    {
      title: 'Blacklist',
      description: 'Manage blacklisted entities',
      path: '/first/blacklist',
      icon: <Block fontSize="large" />,
      color: '#c62828',
    },
    {
      title: 'Attestation',
      description: 'Manage attestations for individuals and organizations',
      path: '/first/attestation',
      icon: <Verified fontSize="large" />,
      color: '#00796b',
    },
    {
      title: 'License Types',
      description: 'Configure license and certificate types',
      path: '/first/license-types',
      icon: <CardMembership fontSize="large" />,
      color: '#5e35b1',
    },
    {
      title: 'Search',
      description: 'Search across all FIRST module data',
      path: '/first/search',
      icon: <Search fontSize="large" />,
      color: '#f57c00',
    },
  ];

  const handleCardClick = (path: string) => {
    history.push(path);
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          FIRST Module
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Financial Institution Registration and Supervision Tracking
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={module.path}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(module.path)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2,
                      color: module.color,
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Container>
    </Box>
  );
};

export default FirstMainPage;
