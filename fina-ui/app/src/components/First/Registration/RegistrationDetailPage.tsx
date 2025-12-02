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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from '@mui/icons-material';
import { useParams, useHistory } from 'react-router-dom';
import { loadFiById } from '../../../api/services/first';
import {
  MOCK_FI_PROFILES,
  MOCK_BRANCHES,
  MOCK_BENEFICIARIES,
  MOCK_AUTHORIZED_PERSONS,
  MOCK_MANAGEMENT,
  MOCK_GAPS,
  MOCK_QUESTIONNAIRE_RESPONSES,
  MOCK_PROCESS_HISTORY,
  MOCK_CORRESPONDENCE,
} from '../../../api/services/first/mockData';
import { FiProfile } from '../../../types/first';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

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
        console.warn('API failed, using mock data:', error);
        // Use mock data as fallback
        const mockFi = MOCK_FI_PROFILES[fiId];
        if (mockFi) {
          setFi(mockFi);
        }
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

  const branches = MOCK_BRANCHES[fiId] || [];
  const beneficiaries = MOCK_BENEFICIARIES[fiId] || [];
  const authorizedPersons = MOCK_AUTHORIZED_PERSONS[fiId] || [];
  const management = MOCK_MANAGEMENT[fiId] || [];
  const gaps = MOCK_GAPS[fiId] || [];
  const questionnaireResponses = MOCK_QUESTIONNAIRE_RESPONSES[fiId] || [];
  const processHistory = MOCK_PROCESS_HISTORY[fiId] || [];
  const correspondence = MOCK_CORRESPONDENCE[fiId] || [];

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
            Code: {fi.code} | Status: {fi.status} | Type: {fi.fiTypeCode}
          </Typography>
        </Box>
      </Box>

      <Paper>
        <Tabs value={currentTab} onChange={(_e, v) => setCurrentTab(v)}>
          <Tab label="General Info" />
          <Tab label={`Branches (${branches.length})`} />
          <Tab label={`Beneficiaries (${beneficiaries.length})`} />
          <Tab label={`Management (${management.length})`} />
          <Tab label={`Authorized Persons (${authorizedPersons.length})`} />
          <Tab label="Documentation" />
          <Tab label={`Questionnaire (${questionnaireResponses.length})`} />
          <Tab label={`Tasks/Gaps (${gaps.length})`} />
          <Tab label={`History (${processHistory.length})`} />
        </Tabs>

        {/* General Info Tab */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > *': { mb: 1 } }}>
                    <Typography>
                      <strong>Name:</strong> {fi.name}
                    </Typography>
                    <Typography>
                      <strong>Code:</strong> {fi.code}
                    </Typography>
                    <Typography>
                      <strong>FI Type:</strong> {fi.fiTypeCode}
                    </Typography>
                    <Typography>
                      <strong>Legal Form:</strong> {fi.legalForm || 'N/A'}
                    </Typography>
                    <Typography>
                      <strong>Tax ID:</strong> {fi.taxId || 'N/A'}
                    </Typography>
                    <Typography>
                      <strong>Registration Number:</strong> {fi.registrationNumber || 'N/A'}
                    </Typography>
                    <Typography>
                      <strong>Registration Date:</strong>{' '}
                      {fi.registrationDate
                        ? getFormattedDateTimeValue(fi.registrationDate, 'yyyy/MM/dd')
                        : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status & License
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > *': { mb: 1 } }}>
                    <Typography>
                      <strong>Status:</strong>{' '}
                      <Chip label={fi.status} color="primary" size="small" />
                    </Typography>
                    <Typography>
                      <strong>License Status:</strong>{' '}
                      <Chip label={fi.licenseStatus} color="success" size="small" />
                    </Typography>
                    <Typography>
                      <strong>License Number:</strong> {fi.licenseNumber || 'N/A'}
                    </Typography>
                    <Typography>
                      <strong>License Issue Date:</strong>{' '}
                      {fi.licenseIssueDate
                        ? getFormattedDateTimeValue(fi.licenseIssueDate, 'yyyy/MM/dd')
                        : 'N/A'}
                    </Typography>
                    <Typography>
                      <strong>License Expiry Date:</strong>{' '}
                      {fi.licenseExpiryDate
                        ? getFormattedDateTimeValue(fi.licenseExpiryDate, 'yyyy/MM/dd')
                        : 'N/A'}
                    </Typography>
                    <Typography>
                      <strong>Director:</strong> {fi.directorFullName || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography>
                        <strong>Address:</strong> {fi.address || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>City:</strong> {fi.city || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Region:</strong> {fi.region || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>
                        <strong>Phone:</strong> {fi.phone || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {fi.email || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Website:</strong> {fi.website || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {fi.description && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography>
                        <strong>Description:</strong>
                      </Typography>
                      <Typography color="text.secondary">{fi.description}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Branches Tab */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Branch Network
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Open Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No branches found
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>{branch.code}</TableCell>
                      <TableCell>{branch.name}</TableCell>
                      <TableCell>{branch.branchTypeCode}</TableCell>
                      <TableCell>{branch.address}</TableCell>
                      <TableCell>{branch.managerName || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={branch.status}
                          color={branch.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {getFormattedDateTimeValue(branch.openDate, 'yyyy/MM/dd')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Beneficiaries Tab */}
        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Beneficial Owners
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>ID/Tax Number</TableCell>
                  <TableCell align="right">Share %</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beneficiaries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No beneficiaries found
                    </TableCell>
                  </TableRow>
                ) : (
                  beneficiaries.map((ben) => (
                    <TableRow key={ben.id}>
                      <TableCell>
                        <Chip
                          label={ben.personType}
                          color={ben.personType === 'INDIVIDUAL' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {ben.personType === 'INDIVIDUAL'
                          ? `${ben.firstName} ${ben.lastName}`
                          : ben.organizationName}
                      </TableCell>
                      <TableCell>{ben.personalId || ben.taxId}</TableCell>
                      <TableCell align="right">
                        <strong>{ben.sharePercent}%</strong>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ben.status}
                          color={ben.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {beneficiaries.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Share: {beneficiaries.reduce((sum, b) => sum + b.sharePercent, 0)}%
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Management Tab */}
        <TabPanel value={currentTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Management Structure
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {management.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No management records found
                    </TableCell>
                  </TableRow>
                ) : (
                  management.map((mgmt) => (
                    <TableRow key={mgmt.id}>
                      <TableCell>
                        {mgmt.personType === 'INDIVIDUAL'
                          ? `${mgmt.firstName} ${mgmt.lastName}`
                          : mgmt.organizationName}
                      </TableCell>
                      <TableCell>{mgmt.position}</TableCell>
                      <TableCell>
                        <Chip label={mgmt.managementTypeCode} size="small" />
                      </TableCell>
                      <TableCell>
                        {getFormattedDateTimeValue(mgmt.appointmentDate, 'yyyy/MM/dd')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mgmt.status}
                          color={mgmt.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Authorized Persons Tab */}
        <TabPanel value={currentTab} index={4}>
          <Typography variant="h6" gutterBottom>
            Authorized Persons
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Personal ID</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Authority Start Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authorizedPersons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No authorized persons found
                    </TableCell>
                  </TableRow>
                ) : (
                  authorizedPersons.map((auth) => (
                    <TableRow key={auth.id}>
                      <TableCell>
                        {auth.firstName} {auth.lastName}
                      </TableCell>
                      <TableCell>{auth.personalId}</TableCell>
                      <TableCell>{auth.position}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{auth.phone || '-'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {auth.email || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getFormattedDateTimeValue(auth.authorityStartDate, 'yyyy/MM/dd')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={auth.status}
                          color={auth.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Documentation Tab */}
        <TabPanel value={currentTab} index={5}>
          <Typography variant="h6" gutterBottom>
            Documentation & Correspondence
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Direction</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Correspondent</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Reg. Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {correspondence.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No correspondence records found
                    </TableCell>
                  </TableRow>
                ) : (
                  correspondence.map((corr) => (
                    <TableRow key={corr.id}>
                      <TableCell>
                        <Chip
                          label={corr.direction}
                          color={corr.direction === 'INCOMING' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {corr.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {corr.body}
                        </Typography>
                      </TableCell>
                      <TableCell>{corr.correspondent}</TableCell>
                      <TableCell>
                        {getFormattedDateTimeValue(corr.correspondenceDate, 'yyyy/MM/dd')}
                      </TableCell>
                      <TableCell>{corr.registrationNumber || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Questionnaire Tab */}
        <TabPanel value={currentTab} index={6}>
          <Typography variant="h6" gutterBottom>
            Questionnaire Responses
          </Typography>
          {questionnaireResponses.length === 0 ? (
            <Typography>No questionnaire responses found</Typography>
          ) : (
            <Grid container spacing={2}>
              {questionnaireResponses.map((qr) => (
                <Grid item xs={12} key={qr.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">
                        {qr.groupName}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Q:</strong> {qr.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>A:</strong> {qr.answer}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Tasks/Gaps Tab */}
        <TabPanel value={currentTab} index={7}>
          <Typography variant="h6" gutterBottom>
            Gaps & Deficiencies
          </Typography>
          {gaps.length === 0 ? (
            <Box textAlign="center" py={4}>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" color="success.main">
                No Gaps Found
              </Typography>
              <Typography color="text.secondary">
                This FI has no outstanding gaps or deficiencies
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {gaps.map((gap) => (
                <Grid item xs={12} key={gap.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderLeft: 4,
                      borderColor:
                        gap.status === 'RESOLVED'
                          ? 'success.main'
                          : gap.status === 'IN_PROGRESS'
                          ? 'warning.main'
                          : 'error.main',
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Chip label={gap.gapType} size="small" />
                        <Chip
                          label={gap.status}
                          color={
                            gap.status === 'RESOLVED'
                              ? 'success'
                              : gap.status === 'IN_PROGRESS'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      </Box>
                      <Typography variant="body1" gutterBottom>
                        {gap.gapText}
                      </Typography>
                      {gap.resolvedAt && (
                        <Box mt={2} p={2} bgcolor="success.lighter" borderRadius={1}>
                          <Typography variant="body2" color="success.dark">
                            <strong>Resolved:</strong>{' '}
                            {getFormattedDateTimeValue(gap.resolvedAt, 'yyyy/MM/dd HH:mm')} by{' '}
                            {gap.resolvedBy}
                          </Typography>
                          {gap.resolutionNote && (
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              {gap.resolutionNote}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={currentTab} index={8}>
          <Typography variant="h6" gutterBottom>
            Process History
          </Typography>
          {processHistory.length === 0 ? (
            <Typography>No history records found</Typography>
          ) : (
            <Timeline position="alternate">
              {processHistory.map((hist, index) => (
                <TimelineItem key={hist.id}>
                  <TimelineOppositeContent color="text.secondary">
                    {getFormattedDateTimeValue(hist.startedAt, 'yyyy/MM/dd HH:mm')}
                    {hist.completedAt && (
                      <>
                        <br />
                        to
                        <br />
                        {getFormattedDateTimeValue(hist.completedAt, 'yyyy/MM/dd HH:mm')}
                      </>
                    )}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        hist.status === 'COMPLETED'
                          ? 'success'
                          : hist.status === 'IN_PROGRESS'
                          ? 'primary'
                          : 'grey'
                      }
                    >
                      {hist.status === 'COMPLETED' ? (
                        <CheckCircle />
                      ) : hist.status === 'IN_PROGRESS' ? (
                        <HourglassEmpty />
                      ) : (
                        <Cancel />
                      )}
                    </TimelineDot>
                    {index < processHistory.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="span">
                          {hist.taskName}
                        </Typography>
                        <Typography color="text.secondary">
                          Assignee: {hist.assignee}
                        </Typography>
                        {hist.outcome && (
                          <Chip
                            label={hist.outcome}
                            color={hist.outcome === 'APPROVED' ? 'success' : 'error'}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                        {hist.comments && (
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            {hist.comments}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default RegistrationDetailPage;
