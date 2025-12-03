/**
 * Blacklist Management Page
 * Manages blacklisted entities and sanctions
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
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Refresh,
  Add,
  Block,
  CheckCircle,
  FileDownload,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_BLACKLIST_ITEMS } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const BlacklistPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [blacklistItems, setBlacklistItems] = useState(MOCK_BLACKLIST_ITEMS);
  const [totalCount, setTotalCount] = useState(MOCK_BLACKLIST_ITEMS.length);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sanctionTypeFilter, setSanctionTypeFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, nameFilter, typeFilter, statusFilter, sanctionTypeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      let filteredData = [...MOCK_BLACKLIST_ITEMS];

      if (nameFilter) {
        filteredData = filteredData.filter((item: any) => {
          const fullName = item.personType === 'INDIVIDUAL'
            ? `${item.firstName} ${item.lastName}`.toLowerCase()
            : item.organizationName?.toLowerCase() || '';
          return fullName.includes(nameFilter.toLowerCase());
        });
      }

      if (typeFilter) {
        filteredData = filteredData.filter((item: any) => item.personType === typeFilter);
      }

      if (statusFilter) {
        filteredData = filteredData.filter((item: any) => item.status === statusFilter);
      }

      if (sanctionTypeFilter) {
        filteredData = filteredData.filter((item: any) => item.sanctionType === sanctionTypeFilter);
      }

      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

      setBlacklistItems(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Failed to load blacklist:', error);
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

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedItem(null);
  };

  const handleExportToExcel = () => {
    console.log('Exporting to Excel...');
    // In real implementation: export blacklist data to Excel
  };

  const getStatusColor = (status: string): 'error' | 'success' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'error';
      case 'REMOVED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSanctionTypeLabel = (type: string): string => {
    switch (type) {
      case 'FINANCIAL':
        return 'Financial Sanctions';
      case 'TRAVEL':
        return 'Travel Ban';
      case 'ASSET_FREEZE':
        return 'Asset Freeze';
      case 'ARMS_EMBARGO':
        return 'Arms Embargo';
      default:
        return type;
    }
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Blacklist Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExportToExcel}
            sx={{ mr: 1 }}
          >
            Export to Excel
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add to Blacklist
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Name / ID Number"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              label="Person Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="INDIVIDUAL">Individual</MenuItem>
              <MenuItem value="LEGAL_ENTITY">Legal Entity</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="REMOVED">Removed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              label="Sanction Type"
              value={sanctionTypeFilter}
              onChange={(e) => setSanctionTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="FINANCIAL">Financial Sanctions</MenuItem>
              <MenuItem value="TRAVEL">Travel Ban</MenuItem>
              <MenuItem value="ASSET_FREEZE">Asset Freeze</MenuItem>
              <MenuItem value="ARMS_EMBARGO">Arms Embargo</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>ID Number</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Sanction Type</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Added</TableCell>
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
            ) : blacklistItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No blacklist items found
                </TableCell>
              </TableRow>
            ) : (
              blacklistItems.map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Chip
                      label={item.personType === 'INDIVIDUAL' ? 'Individual' : 'Legal Entity'}
                      size="small"
                      color={item.personType === 'INDIVIDUAL' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {item.personType === 'INDIVIDUAL'
                        ? `${item.firstName} ${item.lastName}`
                        : item.organizationName}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.idNumber || '-'}</TableCell>
                  <TableCell>
                    {item.dateOfBirth
                      ? getFormattedDateTimeValue(item.dateOfBirth, 'yyyy/MM/dd')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getSanctionTypeLabel(item.sanctionType)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.source}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={item.status === 'ACTIVE' ? <Block /> : <CheckCircle />}
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getFormattedDateTimeValue(item.dateAdded, 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewItem(item)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from Blacklist">
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
        {selectedItem && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Blacklist Entry Details</Typography>
                <Chip
                  label={selectedItem.status}
                  color={getStatusColor(selectedItem.status)}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Person Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedItem.personType === 'INDIVIDUAL' ? 'Individual' : 'Legal Entity'}
                  </Typography>
                </Grid>

                {selectedItem.personType === 'INDIVIDUAL' ? (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1">{selectedItem.firstName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1">{selectedItem.lastName}</Typography>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Organization Name
                    </Typography>
                    <Typography variant="body1">{selectedItem.organizationName}</Typography>
                  </Grid>
                )}

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID Number
                  </Typography>
                  <Typography variant="body1">{selectedItem.idNumber || '-'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {selectedItem.dateOfBirth
                      ? getFormattedDateTimeValue(selectedItem.dateOfBirth, 'yyyy/MM/dd')
                      : '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sanction Type
                  </Typography>
                  <Chip
                    label={getSanctionTypeLabel(selectedItem.sanctionType)}
                    size="small"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Source
                  </Typography>
                  <Typography variant="body1">{selectedItem.source}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body1">{selectedItem.reason}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date Added
                  </Typography>
                  <Typography variant="body1">
                    {getFormattedDateTimeValue(selectedItem.dateAdded, 'yyyy/MM/dd')}
                  </Typography>
                </Grid>

                {selectedItem.dateRemoved && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date Removed
                    </Typography>
                    <Typography variant="body1">
                      {getFormattedDateTimeValue(selectedItem.dateRemoved, 'yyyy/MM/dd')}
                    </Typography>
                  </Grid>
                )}

                {selectedItem.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Additional Notes
                    </Typography>
                    <Typography variant="body2">{selectedItem.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail}>Close</Button>
              {selectedItem.status === 'ACTIVE' && (
                <Button variant="contained" color="error">
                  Remove from Blacklist
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BlacklistPage;
