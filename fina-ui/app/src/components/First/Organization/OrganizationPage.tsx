/**
 * Organization/Individual Registry Page
 * Manages organization and individual entities with license information
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
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Refresh,
  Add,
  Business,
  Person,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_ORGANIZATIONS_EXTENDED } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const OrganizationPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState(MOCK_ORGANIZATIONS_EXTENDED);
  const [totalCount, setTotalCount] = useState(MOCK_ORGANIZATIONS_EXTENDED.length);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, nameFilter, typeFilter, activeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      let filteredData = [...MOCK_ORGANIZATIONS_EXTENDED];

      if (nameFilter) {
        filteredData = filteredData.filter((org: any) =>
          org.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (typeFilter) {
        filteredData = filteredData.filter((org: any) => org.type === typeFilter);
      }

      if (activeFilter !== '') {
        const isActive = activeFilter === 'true';
        filteredData = filteredData.filter((org: any) => org.isActive === isActive);
      }

      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

      setOrganizations(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Failed to load organizations:', error);
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

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Organization & Individual Registry</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            New Entity
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Name / Tax ID"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ORGANIZATION">Organization</MenuItem>
              <MenuItem value="INDIVIDUAL">Individual</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
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
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Tax ID / Personal ID</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>License</TableCell>
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
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No entities found
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org: any) => (
                <TableRow key={org.id} hover>
                  <TableCell>
                    <Chip
                      icon={org.type === 'ORGANIZATION' ? <Business /> : <Person />}
                      label={org.type}
                      color={org.type === 'ORGANIZATION' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {org.name}
                    </Typography>
                    {org.type === 'ORGANIZATION' && (
                      <Typography variant="caption" color="text.secondary">
                        {org.organizationalForm}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{org.taxId}</TableCell>
                  <TableCell>{org.city || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{org.phone || '-'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {org.email || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {org.hasLicense ? (
                      <Tooltip title={`${org.licenseType} - ${org.licenseNumber}`}>
                        <Chip label="Licensed" color="success" size="small" />
                      </Tooltip>
                    ) : (
                      <Chip label="No License" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={org.isActive ? 'Active' : 'Inactive'}
                      color={org.isActive ? 'success' : 'default'}
                      size="small"
                    />
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

export default OrganizationPage;
