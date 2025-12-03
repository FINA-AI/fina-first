/**
 * FI Type Configuration Page
 * Manages financial institution type definitions and workflow assignments
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  AccountTree,
  Business,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_FI_TYPES } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const FiTypePage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [fiTypes, setFiTypes] = useState(MOCK_FI_TYPES);
  const [totalCount, setTotalCount] = useState(MOCK_FI_TYPES.length);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, nameFilter, activeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      let filteredData = [...MOCK_FI_TYPES];

      if (nameFilter) {
        filteredData = filteredData.filter((type: any) =>
          type.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
          type.code.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (activeFilter !== '') {
        const isActive = activeFilter === 'true';
        filteredData = filteredData.filter((type: any) => type.isActive === isActive);
      }

      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

      setFiTypes(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Failed to load FI types:', error);
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

  const handleViewType = (type: any) => {
    setSelectedType(type);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedType(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">FI Type Configuration</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            New FI Type
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
              label="Type Name / Code"
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
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Branch Types</TableCell>
              <TableCell>Workflows</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : fiTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No FI types found
                </TableCell>
              </TableRow>
            ) : (
              fiTypes.map((type: any) => (
                <TableRow key={type.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {type.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Business color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">{type.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {type.branchTypes.slice(0, 2).map((branchType: string, index: number) => (
                        <Chip
                          key={index}
                          label={branchType}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {type.branchTypes.length > 2 && (
                        <Chip
                          label={`+${type.branchTypes.length - 2}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<AccountTree />}
                      label={`${Object.keys(type.workflows).length} workflows`}
                      size="small"
                      color="info"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={type.isActive ? 'Active' : 'Inactive'}
                      color={type.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewType(type)}>
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

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        {selectedType && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Business color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{selectedType.name}</Typography>
                </Box>
                <Chip
                  label={selectedType.isActive ? 'Active' : 'Inactive'}
                  color={selectedType.isActive ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Code
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedType.code}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedType.description}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Branch Types
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedType.branchTypes.map((branchType: string, index: number) => (
                      <Chip
                        key={index}
                        label={branchType}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Workflow Assignments
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Registration Workflow"
                        secondary={selectedType.workflows.registration || 'Not assigned'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="License Issuance Workflow"
                        secondary={selectedType.workflows.licenseIssuance || 'Not assigned'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="License Renewal Workflow"
                        secondary={selectedType.workflows.licenseRenewal || 'Not assigned'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="License Revocation Workflow"
                        secondary={selectedType.workflows.licenseRevocation || 'Not assigned'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Modification Workflow"
                        secondary={selectedType.workflows.modification || 'Not assigned'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Closure Workflow"
                        secondary={selectedType.workflows.closure || 'Not assigned'}
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {getFormattedDateTimeValue(selectedType.createdAt, 'yyyy/MM/dd HH:mm')}
                  </Typography>
                </Grid>

                {selectedType.modifiedAt && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Modified At
                    </Typography>
                    <Typography variant="body2">
                      {getFormattedDateTimeValue(selectedType.modifiedAt, 'yyyy/MM/dd HH:mm')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail}>Close</Button>
              <Button variant="contained" color="primary">
                Edit Type
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default FiTypePage;
