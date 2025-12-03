/**
 * Attestation Management Page
 * Manages attestations and certifications for candidates
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Refresh,
  Add,
  ExpandMore,
  ExpandLess,
  Description,
  Download,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_ATTESTATIONS } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const AttestationPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [attestations, setAttestations] = useState(MOCK_ATTESTATIONS);
  const [totalCount, setTotalCount] = useState(MOCK_ATTESTATIONS.length);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, nameFilter, statusFilter, typeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      let filteredData = [...MOCK_ATTESTATIONS];

      if (nameFilter) {
        filteredData = filteredData.filter((att: any) =>
          att.candidateName.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (statusFilter) {
        filteredData = filteredData.filter((att: any) => att.status === statusFilter);
      }

      if (typeFilter) {
        filteredData = filteredData.filter((att: any) => att.type === typeFilter);
      }

      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

      setAttestations(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Failed to load attestations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleGenerateDocument = (attestation: any, docType: string) => {
    console.log(`Generating ${docType} document for attestation:`, attestation.id);
    // In real implementation: call API to generate document
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'RECOGNIZED':
        return 'success';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RECOGNIZED':
        return <CheckCircle />;
      case 'UNDER_REVIEW':
        return <HourglassEmpty />;
      case 'REJECTED':
        return <Cancel />;
      default:
        return null;
    }
  };

  const getDaysColor = (days: number): string => {
    if (days > 180) return '#4caf50'; // Green - good
    if (days > 90) return '#ff9800'; // Orange - warning
    return '#f44336'; // Red - critical
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Attestation Management</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            New Attestation
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Candidate Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="RECOGNIZED">Recognized</MenuItem>
              <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="LONG">Long Form</MenuItem>
              <MenuItem value="SHORT">Short Form</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Certificate #</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Days Remaining</TableCell>
              <TableCell>Exam Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : attestations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No attestations found
                </TableCell>
              </TableRow>
            ) : (
              attestations.map((attestation: any) => (
                <React.Fragment key={attestation.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleExpandRow(attestation.id)}
                      >
                        {expandedRow === attestation.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {attestation.candidateName}
                      </Typography>
                    </TableCell>
                    <TableCell>{attestation.position}</TableCell>
                    <TableCell>
                      <Chip
                        label={attestation.type}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(attestation.status)}
                        label={attestation.status.replace('_', ' ')}
                        color={getStatusColor(attestation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {attestation.certificateNumber || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={attestation.score}
                        color={attestation.score >= 80 ? 'success' : attestation.score >= 60 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${attestation.daysRemaining} days`}
                        size="small"
                        sx={{
                          bgcolor: getDaysColor(attestation.daysRemaining),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {getFormattedDateTimeValue(attestation.examDate, 'yyyy/MM/dd')}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row - Documents */}
                  <TableRow>
                    <TableCell colSpan={10} sx={{ p: 0 }}>
                      <Collapse in={expandedRow === attestation.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                          <Grid container spacing={3}>
                            {/* Candidate Details */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Candidate Details
                              </Typography>
                              <List dense>
                                <ListItem>
                                  <ListItemText
                                    primary="Personal ID"
                                    secondary={attestation.personalId}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Phone"
                                    secondary={attestation.phone}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Email"
                                    secondary={attestation.email}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Education"
                                    secondary={attestation.education}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Experience"
                                    secondary={`${attestation.experienceYears} years`}
                                  />
                                </ListItem>
                              </List>
                            </Grid>

                            {/* Exam Details */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Exam Details
                              </Typography>
                              <List dense>
                                <ListItem>
                                  <ListItemText
                                    primary="Exam Type"
                                    secondary={attestation.examType}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Exam Date"
                                    secondary={getFormattedDateTimeValue(attestation.examDate, 'yyyy/MM/dd')}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Score"
                                    secondary={`${attestation.score} / 100`}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Validity Period"
                                    secondary={`${attestation.validityPeriod} months`}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Days Remaining"
                                    secondary={`${attestation.daysRemaining} days`}
                                  />
                                </ListItem>
                              </List>
                            </Grid>

                            {/* Documents Section */}
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Documents
                              </Typography>
                              <Grid container spacing={2}>
                                {attestation.documents.map((doc: any, index: number) => (
                                  <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Paper
                                      sx={{
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <Box display="flex" alignItems="center">
                                        <Description color="primary" sx={{ mr: 1 }} />
                                        <Box>
                                          <Typography variant="body2" fontWeight="bold">
                                            {doc.name}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {doc.type}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <IconButton size="small">
                                        <Download fontSize="small" />
                                      </IconButton>
                                    </Paper>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>

                            {/* Document Generation Actions */}
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Generate Documents
                              </Typography>
                              <Box display="flex" gap={2}>
                                <Button
                                  variant="outlined"
                                  startIcon={<Description />}
                                  onClick={() => handleGenerateDocument(attestation, 'CERTIFICATE')}
                                >
                                  Generate Certificate
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<Description />}
                                  onClick={() => handleGenerateDocument(attestation, 'REPORT')}
                                >
                                  Generate Report
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<Description />}
                                  onClick={() => handleGenerateDocument(attestation, 'TRANSCRIPT')}
                                >
                                  Generate Transcript
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </TableContainer>
    </Box>
  );
};

export default AttestationPage;
