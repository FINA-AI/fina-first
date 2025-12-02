/**
 * FI Registration List Page
 * Main page for viewing and managing FI registrations
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  FileDownload,
  FileUpload,
  Refresh,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import {
  loadFiRegistry,
  exportFiRegistry,
  deleteFi,
} from '../../../api/services/first';
import { FiRegistry, FiStatus, ActionType } from '../../../types/first';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const RegistrationPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<FiRegistry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Filters
  const [codeFilter, setCodeFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FiStatus | ''>('');
  const [actionTypeFilter, setActionTypeFilter] = useState<ActionType | ''>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (codeFilter) filters.code = codeFilter;
      if (nameFilter) filters.name = nameFilter;
      if (statusFilter) filters.status = [statusFilter];
      if (actionTypeFilter) filters.actionType = [actionTypeFilter];
      filters.excludeDisabledFis = false;

      const response = await loadFiRegistry(page + 1, rowsPerPage, filters);
      setRegistrations(response.data.list);
      setTotalCount(response.data.totalResults);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, codeFilter, nameFilter, statusFilter, actionTypeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (fiId: string) => {
    history.push(`/first/registration/${fiId}`);
  };

  const handleDelete = async (fiId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteFi(fiId);
        loadData();
      } catch (error) {
        console.error('Failed to delete FI:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportFiRegistry('en_US');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fi-registry-${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const getStatusColor = (status: FiStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'GAP':
        return 'warning';
      case 'DECLINED':
      case 'CANCELED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">FI Registration</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileUpload />}
            sx={{ mr: 1 }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExport}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => history.push('/first/registration/new')}
          >
            New Registration
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Code"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FiStatus)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACCEPTED">Accepted</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="GAP">Gap</MenuItem>
              <MenuItem value="DECLINED">Declined</MenuItem>
              <MenuItem value="CANCELED">Canceled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Action Type"
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value as ActionType)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="REGISTRATION">Registration</MenuItem>
              <MenuItem value="CHANGE">Change</MenuItem>
              <MenuItem value="BRANCHES_CHANGE">Branch Change</MenuItem>
              <MenuItem value="CANCELLATION">Cancellation</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadData}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>FI Type</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>License Status</TableCell>
              <TableCell>Last Action Date</TableCell>
              <TableCell>Author</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No registrations found
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id} hover>
                  <TableCell>{reg.code}</TableCell>
                  <TableCell>{reg.name}</TableCell>
                  <TableCell>{reg.fiTypeCode}</TableCell>
                  <TableCell>{reg.actionType}</TableCell>
                  <TableCell>
                    <Chip
                      label={reg.status}
                      color={getStatusColor(reg.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={reg.licenseStatus} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {reg.lastActionDate
                      ? getFormattedDateTimeValue(reg.lastActionDate, 'yyyy/MM/dd')
                      : '-'}
                  </TableCell>
                  <TableCell>{reg.author}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => handleView(reg.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => history.push(`/first/registration/${reg.id}/edit`)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(reg.id, reg.name)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
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

export default RegistrationPage;
