/**
 * FI Registration Detail Page
 * Detailed view of a single FI registration with tabs
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useHistory } from 'react-router-dom';
import { loadFiById } from '../../../api/services/first';
import { FiProfile } from '../../../types/first';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const RegistrationDetailPage: React.FC = () => {
  const { fiId } = useParams<{ fiId: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [fi, setFi] = useState<FiProfile | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const loadFi = async () => {
      try {
        setLoading(true);
        const response = await loadFiById(fiId);
        setFi(response.data);
      } catch (error) {
        console.error('Failed to load FI:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFi();
  }, [fiId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!fi) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>FI not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => history.push('/first/registration')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4">{fi.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Code: {fi.code} | Status: {fi.status}
          </Typography>
        </Box>
      </Box>

      <Paper>
        <Tabs value={currentTab} onChange={(_e, v) => setCurrentTab(v)}>
          <Tab label="General Info" />
          <Tab label="Branches" />
          <Tab label="Beneficiaries" />
          <Tab label="Management" />
          <Tab label="Authorized Persons" />
          <Tab label="Documentation" />
          <Tab label="Questionnaire" />
          <Tab label="Tasks" />
          <Tab label="History" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6">General Information</Typography>
          <Box mt={2}>
            <Typography><strong>Name:</strong> {fi.name}</Typography>
            <Typography><strong>Code:</strong> {fi.code}</Typography>
            <Typography><strong>Type:</strong> {fi.fiTypeCode}</Typography>
            <Typography><strong>Status:</strong> {fi.status}</Typography>
            <Typography><strong>License Status:</strong> {fi.licenseStatus}</Typography>
            <Typography><strong>Address:</strong> {fi.address || 'N/A'}</Typography>
            <Typography><strong>Phone:</strong> {fi.phone || 'N/A'}</Typography>
            <Typography><strong>Email:</strong> {fi.email || 'N/A'}</Typography>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography>Branches module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography>Beneficiaries module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Typography>Management module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <Typography>Authorized Persons module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={5}>
          <Typography>Documentation module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={6}>
          <Typography>Questionnaire module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={7}>
          <Typography>Tasks module - To be implemented</Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={8}>
          <Typography>History module - To be implemented</Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default RegistrationDetailPage;
