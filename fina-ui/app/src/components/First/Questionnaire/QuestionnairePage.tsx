/**
 * Questionnaire Management Page
 * Manages questionnaires and question groups for FI registration
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Refresh,
  Add,
  ArrowUpward,
  ArrowDownward,
  QuestionAnswer,
  Assignment,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { MOCK_QUESTIONNAIRES, MOCK_QUESTIONNAIRE_GROUPS } from '../../../api/services/first/mockData';
import { getFormattedDateTimeValue } from '../../../util/appUtil';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const QuestionnairePage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Questions state
  const [questions, setQuestions] = useState(MOCK_QUESTIONNAIRES);
  const [totalQuestions, setTotalQuestions] = useState(MOCK_QUESTIONNAIRES.length);
  const [questionPage, setQuestionPage] = useState(0);
  const [questionRowsPerPage, setQuestionRowsPerPage] = useState(30);

  // Groups state
  const [groups, setGroups] = useState(MOCK_QUESTIONNAIRE_GROUPS);
  const [totalGroups, setTotalGroups] = useState(MOCK_QUESTIONNAIRE_GROUPS.length);
  const [groupPage, setGroupPage] = useState(0);
  const [groupRowsPerPage, setGroupRowsPerPage] = useState(30);

  // Filters
  const [questionFilter, setQuestionFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [questionPage, questionRowsPerPage, groupPage, groupRowsPerPage, questionFilter, groupFilter, typeFilter, activeFilter]);

  const loadData = () => {
    setLoading(true);
    try {
      // Filter questions
      let filteredQuestions = [...MOCK_QUESTIONNAIRES];
      if (questionFilter) {
        filteredQuestions = filteredQuestions.filter((q: any) =>
          q.questionText.toLowerCase().includes(questionFilter.toLowerCase()) ||
          q.questionKey.toLowerCase().includes(questionFilter.toLowerCase())
        );
      }
      if (typeFilter) {
        filteredQuestions = filteredQuestions.filter((q: any) => q.type === typeFilter);
      }
      if (activeFilter !== '') {
        const isActive = activeFilter === 'true';
        filteredQuestions = filteredQuestions.filter((q: any) => q.isActive === isActive);
      }

      const questionStartIndex = questionPage * questionRowsPerPage;
      const paginatedQuestions = filteredQuestions.slice(questionStartIndex, questionStartIndex + questionRowsPerPage);
      setQuestions(paginatedQuestions);
      setTotalQuestions(filteredQuestions.length);

      // Filter groups
      let filteredGroups = [...MOCK_QUESTIONNAIRE_GROUPS];
      if (groupFilter) {
        filteredGroups = filteredGroups.filter((g: any) =>
          g.name.toLowerCase().includes(groupFilter.toLowerCase())
        );
      }

      const groupStartIndex = groupPage * groupRowsPerPage;
      const paginatedGroups = filteredGroups.slice(groupStartIndex, groupStartIndex + groupRowsPerPage);
      setGroups(paginatedGroups);
      setTotalGroups(filteredGroups.length);
    } catch (error) {
      console.error('Failed to load questionnaire data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangeQuestionPage = (_event: unknown, newPage: number) => {
    setQuestionPage(newPage);
  };

  const handleChangeQuestionRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionRowsPerPage(parseInt(event.target.value, 10));
    setQuestionPage(0);
  };

  const handleChangeGroupPage = (_event: unknown, newPage: number) => {
    setGroupPage(newPage);
  };

  const handleChangeGroupRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupRowsPerPage(parseInt(event.target.value, 10));
    setGroupPage(0);
  };

  const handleMoveSequence = (id: string, direction: 'up' | 'down') => {
    console.log(`Moving ${id} ${direction}`);
    // In real implementation: call API to update sequence
  };

  const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' => {
    switch (type) {
      case 'TEXT':
        return 'primary';
      case 'TEXTAREA':
        return 'secondary';
      case 'SELECT':
        return 'success';
      case 'CHECKBOX':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Questionnaire Management</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            {tabValue === 0 ? 'New Question' : 'New Group'}
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<QuestionAnswer />} label="Questions" iconPosition="start" />
          <Tab icon={<Assignment />} label="Question Groups" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Questions Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Filters */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Question Text / Key"
                value={questionFilter}
                onChange={(e) => setQuestionFilter(e.target.value)}
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
                <MenuItem value="TEXT">Text</MenuItem>
                <MenuItem value="TEXTAREA">Text Area</MenuItem>
                <MenuItem value="SELECT">Select</MenuItem>
                <MenuItem value="CHECKBOX">Checkbox</MenuItem>
                <MenuItem value="RADIO">Radio</MenuItem>
                <MenuItem value="DATE">Date</MenuItem>
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

        {/* Questions Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={80}>Sequence</TableCell>
                <TableCell>Question Key</TableCell>
                <TableCell>Question Text</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Required</TableCell>
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
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question: any) => (
                  <TableRow key={question.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">{question.sequence}</Typography>
                        <Box display="flex" flexDirection="column">
                          <IconButton
                            size="small"
                            onClick={() => handleMoveSequence(question.id, 'up')}
                            disabled={question.sequence === 1}
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveSequence(question.id, 'down')}
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {question.questionKey}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{question.questionText}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.type}
                        color={getTypeColor(question.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{question.groupName || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={question.isRequired ? 'Yes' : 'No'}
                        color={question.isRequired ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.isActive ? 'Active' : 'Inactive'}
                        color={question.isActive ? 'success' : 'default'}
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
            count={totalQuestions}
            page={questionPage}
            onPageChange={handleChangeQuestionPage}
            rowsPerPage={questionRowsPerPage}
            onRowsPerPageChange={handleChangeQuestionRowsPerPage}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
          />
        </TableContainer>
      </TabPanel>

      {/* Groups Tab */}
      <TabPanel value={tabValue} index={1}>
        {/* Filters */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Group Name"
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Groups Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={80}>Sequence</TableCell>
                <TableCell>Group Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>FI Types</TableCell>
                <TableCell>Question Count</TableCell>
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
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No groups found
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group: any) => (
                  <TableRow key={group.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">{group.sequence}</Typography>
                        <Box display="flex" flexDirection="column">
                          <IconButton
                            size="small"
                            onClick={() => handleMoveSequence(group.id, 'up')}
                            disabled={group.sequence === 1}
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveSequence(group.id, 'down')}
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {group.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{group.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {group.fiTypes.map((type: string, index: number) => (
                          <Chip key={index} label={type} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={group.questionCount} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={group.isActive ? 'Active' : 'Inactive'}
                        color={group.isActive ? 'success' : 'default'}
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
            count={totalGroups}
            page={groupPage}
            onPageChange={handleChangeGroupPage}
            rowsPerPage={groupRowsPerPage}
            onRowsPerPageChange={handleChangeGroupRowsPerPage}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
          />
        </TableContainer>
      </TabPanel>
    </Box>
  );
};

export default QuestionnairePage;
