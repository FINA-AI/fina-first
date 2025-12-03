/**
 * License Type Configuration Page
 * Manages license and certificate type definitions
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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Refresh,
  Add,
  Assignment,
  MonetizationOn,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_LICENSE_TYPES } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const LicenseTypePage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [licenseTypes, setLicenseTypes] = useState(MOCK_LICENSE_TYPES);
  const [totalCount, setTotalCount] = useState(MOCK_LICENSE_TYPES.length);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, nameFilter, categoryFilter, activeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      let filteredData = [...MOCK_LICENSE_TYPES];

      if (nameFilter) {
        filteredData = filteredData.filter((type: any) =>
          type.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
          type.code.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (categoryFilter) {
        filteredData = filteredData.filter((type: any) => type.category === categoryFilter);
      }

      if (activeFilter !== '') {
        const isActive = activeFilter === 'true';
        filteredData = filteredData.filter((type: any) => type.isActive === isActive);
      }

      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

      setLicenseTypes(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Failed to load license types:', error);
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

  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'success' | 'warning' => {
    switch (category) {
      case 'BUSINESS':
        return 'primary';
      case 'PROFESSIONAL':
        return 'secondary';
      case 'FINANCIAL':
        return 'success';
      case 'REGULATORY':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">License Type Configuration</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            New License Type
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
              label="Name / Code"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="BUSINESS">Business</MenuItem>
              <MenuItem value="PROFESSIONAL">Professional</MenuItem>
              <MenuItem value="FINANCIAL">Financial</MenuItem>
              <MenuItem value="REGULATORY">Regulatory</MenuItem>
            </TextField>
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
              <TableCell>Category</TableCell>
              <TableCell>Validity Period</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Required Documents</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : licenseTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No license types found
                </TableCell>
              </TableRow>
            ) : (
              licenseTypes.map((type: any) => (
                <TableRow key={type.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {type.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{type.name}</Typography>
                    {type.description && (
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={type.category}
                      color={getCategoryColor(type.category)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {type.validityPeriod} months
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <MonetizationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {type.feeAmount.toLocaleString()} {type.feeCurrency}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {type.requiredDocuments.length} document(s)
                    </Typography>
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
                <Typography variant="h6">{selectedType.name}</Typography>
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
                    {selectedType.description || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Chip
                    label={selectedType.category}
                    color={getCategoryColor(selectedType.category)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Validity Period
                  </Typography>
                  <Typography variant="body1">
                    {selectedType.validityPeriod} months
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fee Amount
                  </Typography>
                  <Typography variant="body1">
                    {selectedType.feeAmount.toLocaleString()} {selectedType.feeCurrency}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Renewal Fee
                  </Typography>
                  <Typography variant="body1">
                    {selectedType.renewalFee?.toLocaleString() || '-'} {selectedType.feeCurrency}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Required Documents
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedType.requiredDocuments.map((doc: string, index: number) => (
                      <Chip
                        key={index}
                        icon={<Assignment />}
                        label={doc}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Allowed Operations
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedType.allowedOperations.map((op: string, index: number) => (
                      <Chip
                        key={index}
                        label={op}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                {selectedType.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Additional Notes
                    </Typography>
                    <Typography variant="body2">{selectedType.notes}</Typography>
                  </Grid>
                )}

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

export default LicenseTypePage;
