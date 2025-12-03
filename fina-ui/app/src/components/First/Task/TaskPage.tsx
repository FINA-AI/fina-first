/**
 * Task Management Page
 * Displays workflow tasks with filtering, sorting, and detail view
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
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  Refresh,
  CheckCircle,
  HourglassEmpty,
  PlayArrow,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_TASKS } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

const TaskPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [totalCount, setTotalCount] = useState(MOCK_TASKS.length);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, nameFilter, stateFilter, assigneeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      // Filter mock data
      let filteredData = [...MOCK_TASKS];

      if (nameFilter) {
        filteredData = filteredData.filter((task) =>
          task.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (stateFilter) {
        filteredData = filteredData.filter((task) => task.state === stateFilter);
      }

      if (assigneeFilter) {
        filteredData = filteredData.filter((task) =>
          task.assignee?.toLowerCase().includes(assigneeFilter.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

      setTasks(paginatedData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Failed to load tasks:', error);
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

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedTask(null);
  };

  const getStateColor = (state: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (state) {
      case 'COMPLETED':
        return 'success';
      case 'ACTIVE':
        return 'info';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: number): string => {
    if (priority >= 8) return '#f44336'; // High
    if (priority >= 5) return '#ff9800'; // Medium
    return '#4caf50'; // Low
  };

  const getPriorityLabel = (priority: number): string => {
    if (priority >= 8) return 'High';
    if (priority >= 5) return 'Medium';
    return 'Low';
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Task Management</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">{MOCK_TASKS.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Tasks
              </Typography>
              <Typography variant="h4" color="primary">
                {MOCK_TASKS.filter((t) => t.state === 'ACTIVE').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" color="error">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Task Name"
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
              label="State"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Assignee"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Process</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Started</TableCell>
              <TableCell>Due Date</TableCell>
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
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {task.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{task.processDefinitionKey}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.processId}
                    </Typography>
                  </TableCell>
                  <TableCell>{task.assignee || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.state}
                      color={getStateColor(task.state)}
                      size="small"
                      icon={
                        task.state === 'COMPLETED' ? (
                          <CheckCircle />
                        ) : task.state === 'ACTIVE' ? (
                          <PlayArrow />
                        ) : (
                          <HourglassEmpty />
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPriorityLabel(task.priority)}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(task.priority),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {task.startedAt
                      ? getFormattedDateTimeValue(task.startedAt, 'yyyy/MM/dd HH:mm')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {task.dueAt
                      ? getFormattedDateTimeValue(task.dueAt, 'yyyy/MM/dd HH:mm')
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewTask(task)}>
                        <Visibility fontSize="small" />
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

      {/* Task Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedTask.name}</Typography>
              <Chip
                label={selectedTask.state}
                color={getStateColor(selectedTask.state)}
                size="small"
                sx={{ ml: 1 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedTask.description}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Task ID
                  </Typography>
                  <Typography variant="body2">{selectedTask.id}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Process ID
                  </Typography>
                  <Typography variant="body2">{selectedTask.processId}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Process Definition
                  </Typography>
                  <Typography variant="body2">
                    {selectedTask.processDefinitionKey}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Assignee
                  </Typography>
                  <Typography variant="body2">{selectedTask.assignee || 'Unassigned'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Priority
                  </Typography>
                  <Chip
                    label={getPriorityLabel(selectedTask.priority)}
                    size="small"
                    sx={{
                      bgcolor: getPriorityColor(selectedTask.priority),
                      color: 'white',
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    State
                  </Typography>
                  <Chip
                    label={selectedTask.state}
                    color={getStateColor(selectedTask.state)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Started At
                  </Typography>
                  <Typography variant="body2">
                    {selectedTask.startedAt
                      ? getFormattedDateTimeValue(selectedTask.startedAt, 'yyyy/MM/dd HH:mm')
                      : '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Due Date
                  </Typography>
                  <Typography variant="body2">
                    {selectedTask.dueAt
                      ? getFormattedDateTimeValue(selectedTask.dueAt, 'yyyy/MM/dd HH:mm')
                      : '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {getFormattedDateTimeValue(selectedTask.createdAt, 'yyyy/MM/dd HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail}>Close</Button>
              <Button variant="contained" color="primary">
                Open Task
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TaskPage;
