/**
 * FIRST Dashboard Page
 * Displays analytics and statistics for financial institutions
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  Assessment,
  CheckCircle,
  HourglassEmpty,
  Refresh,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useHistory } from 'react-router-dom';
import { MOCK_DASHBOARD_STATS } from '../../../api/services/first/mockData';

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(MOCK_DASHBOARD_STATS);
  const [selectedFITypes, setSelectedFITypes] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedFITypes]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call:
      // await firstService.getDashboardStats({ fiTypes: selectedFITypes })
      // For now, using mock data
      setDashboardData(MOCK_DASHBOARD_STATS);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFITypeToggle = (type: string) => {
    setSelectedFITypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNavigate = (path: string) => {
    history.push(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">FIRST Dashboard</Typography>
        <Button variant="outlined" startIcon={<Refresh />} onClick={loadDashboardData}>
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Statistics */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Business color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Total Financial Institutions
                      </Typography>
                      <Typography variant="h4">{dashboardData.totalFIs}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Active FIs
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {dashboardData.activeFIs}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <HourglassEmpty color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Pending Registrations
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {dashboardData.pendingRegistrations}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Assessment color="info" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Completion Rate
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {Math.round((dashboardData.activeFIs / dashboardData.totalFIs) * 100)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* FI Type Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Filter by FI Type
            </Typography>
            <FormGroup row>
              {dashboardData.fiByType.map((fiType) => (
                <FormControlLabel
                  key={fiType.type}
                  control={
                    <Checkbox
                      checked={selectedFITypes.includes(fiType.type)}
                      onChange={() => handleFITypeToggle(fiType.type)}
                    />
                  }
                  label={`${fiType.label} (${fiType.count})`}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Charts Section */}
          <Grid container spacing={3} mb={4}>
            {/* FI Registrations by Month */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  FI Registrations - Last 6 Months
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.monthlyRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2196f3"
                      strokeWidth={2}
                      name="Registrations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* FI Status Distribution */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  FI Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.fiByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count, percent }) =>
                        `${status}: ${count} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.fiByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* FI by Type Bar Chart */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Financial Institutions by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.fiByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4caf50" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Regional Distribution */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Regional Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.regionalDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="region" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ff9800" name="FI Count" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* License Status Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              License Status Overview
            </Typography>
            <Grid container spacing={2}>
              {dashboardData.licenseStatus.map((status) => (
                <Grid item xs={12} sm={6} md={4} key={status.status}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1">{status.status}</Typography>
                    <Chip
                      label={status.count}
                      color={
                        status.status === 'Active'
                          ? 'success'
                          : status.status === 'Expired'
                          ? 'error'
                          : 'warning'
                      }
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Business />}
                  onClick={() => handleNavigate('/first/registration')}
                >
                  New FI Registration
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                  onClick={() => handleNavigate('/first/registration')}
                >
                  View All Registrations
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  onClick={() => handleNavigate('/first/task')}
                >
                  Active Tasks
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={() => handleNavigate('/first/organization')}
                >
                  Organization Registry
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DashboardPage;
