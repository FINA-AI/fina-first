/**
 * FI Registration Creation Page
 * Multi-step form for creating new FI registrations
 * Based on Ext JS FiTaskWizardView implementation
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useHistory } from 'react-router-dom';
import { ArrowBack, Save } from '@mui/icons-material';
import {
  loadFiTypes,
  loadBranchTypes,
} from '../../../api/services/first/fiTypeService';
import {
  loadRegions,
  loadCitiesByRegion,
  searchFiByIdentity,
  loadLegalForms,
  validateFiTypeForIdentity,
  createWorkflow,
  copyDataFromExistingFi,
} from '../../../api/services/first/registrationServiceEnhanced';
import { MOCK_FI_TYPES, IDENTITY_REGEX } from '../../../api/services/first/mockData';

interface RegistrationFormData {
  // Step 0: Initial Card
  edocNumber: string;
  edocDate: Date | null;
  identity: string;

  // Step 1: Registration Form
  fiTypeCode: string;
  registrationNumber: string;
  legalFormType: string;
  fiName: string;
  legalAddressRegion: string;
  legalAddressCity: string;
  legalAddress: string;
  isAddressSame: boolean;
  factualAddressRegion: string;
  factualAddressCity: string;
  factualAddress: string;
  copyDataFromFi: boolean;
}

const STEPS = ['Basic Information', 'Registration Details', 'Review'];

const RegistrationCreatePage: React.FC = () => {
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fiTypes, setFiTypes] = useState<any[]>([]);
  const [legalForms, setLegalForms] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [legalCities, setLegalCities] = useState<any[]>([]);
  const [factualCities, setFactualCities] = useState<any[]>([]);
  const [existingFiWarning, setExistingFiWarning] = useState<string>('');

  const [formData, setFormData] = useState<RegistrationFormData>({
    edocNumber: '',
    edocDate: null,
    identity: '',
    fiTypeCode: '',
    registrationNumber: '',
    legalFormType: '',
    fiName: '',
    legalAddressRegion: '',
    legalAddressCity: '',
    legalAddress: '',
    isAddressSame: true,
    factualAddressRegion: '',
    factualAddressCity: '',
    factualAddress: '',
    copyDataFromFi: false,
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load FI Types
      try {
        const fiTypesResp = await loadFiTypes();
        setFiTypes(fiTypesResp.data.list || MOCK_FI_TYPES);
      } catch (error) {
        console.error('Failed to load FI types, using mock data');
        setFiTypes(MOCK_FI_TYPES);
      }

      // Load Regions
      const regionsResp = await loadRegions();
      setRegions(regionsResp.data);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cities when region changes
  useEffect(() => {
    if (formData.legalAddressRegion) {
      loadCitiesByRegion(formData.legalAddressRegion).then(resp => {
        setLegalCities(resp.data);
        // Auto-select if only one city
        if (resp.data.length === 1) {
          setFormData(prev => ({ ...prev, legalAddressCity: resp.data[0].id }));
        }
      });
    }
  }, [formData.legalAddressRegion]);

  useEffect(() => {
    if (formData.factualAddressRegion && !formData.isAddressSame) {
      loadCitiesByRegion(formData.factualAddressRegion).then(resp => {
        setFactualCities(resp.data);
        if (resp.data.length === 1) {
          setFormData(prev => ({ ...prev, factualAddressCity: resp.data[0].id }));
        }
      });
    }
  }, [formData.factualAddressRegion, formData.isAddressSame]);

  // Validate identity and load legal forms
  useEffect(() => {
    if (formData.identity.length === 9 || formData.identity.length === 11) {
      if (!IDENTITY_REGEX.test(formData.identity)) {
        setErrors(prev => ({ ...prev, identity: 'Identity must be alphanumeric' }));
        return;
      }

      // Clear error
      setErrors(prev => ({ ...prev, identity: '' }));

      // Load legal forms based on identity length
      loadLegalForms(formData.identity.length).then(resp => {
        setLegalForms(resp.data);

        // Auto-select for individual entrepreneur (11 digits)
        if (formData.identity.length === 11) {
          setFormData(prev => ({ ...prev, legalFormType: 'individualEntrepreneur' }));
        }
      });

      // Check for existing FI
      searchFiByIdentity(formData.identity).then(resp => {
        if (resp.data.list && resp.data.list.length > 0) {
          const existingFi = resp.data.list[0];
          setExistingFiWarning(
            `Found existing FI: ${existingFi.name} (${existingFi.code}) - Type: ${existingFi.fiTypeCode}, Status: ${existingFi.status}`
          );
        } else {
          setExistingFiWarning('');
        }
      });
    }
  }, [formData.identity]);

  const handleFieldChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Handle address same toggle
    if (field === 'isAddressSame' && value === true) {
      setFormData(prev => ({
        ...prev,
        factualAddressRegion: '',
        factualAddressCity: '',
        factualAddress: '',
      }));
    }
  };

  const validateStep0 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.edocNumber.trim()) {
      newErrors.edocNumber = 'E-doc number is required';
    }

    if (!formData.edocDate) {
      newErrors.edocDate = 'E-doc date is required';
    }

    if (!formData.identity.trim()) {
      newErrors.identity = 'Identity is required';
    } else if (formData.identity.length !== 9 && formData.identity.length !== 11) {
      newErrors.identity = 'Identity must be 9 or 11 characters';
    } else if (!IDENTITY_REGEX.test(formData.identity)) {
      newErrors.identity = 'Identity must be alphanumeric';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fiTypeCode) {
      newErrors.fiTypeCode = 'FI Type is required';
    }

    if (!formData.legalFormType) {
      newErrors.legalFormType = 'Legal form is required';
    }

    if (!formData.fiName.trim()) {
      newErrors.fiName = 'FI name is required';
    }

    if (!formData.legalAddressRegion) {
      newErrors.legalAddressRegion = 'Legal address region is required';
    }

    if (!formData.legalAddressCity) {
      newErrors.legalAddressCity = 'Legal address city is required';
    }

    if (!formData.legalAddress.trim()) {
      newErrors.legalAddress = 'Legal address is required';
    }

    if (!formData.isAddressSame) {
      if (!formData.factualAddressRegion) {
        newErrors.factualAddressRegion = 'Factual address region is required';
      }
      if (!formData.factualAddressCity) {
        newErrors.factualAddressCity = 'Factual address city is required';
      }
      if (!formData.factualAddress.trim()) {
        newErrors.factualAddress = 'Factual address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateStep0()) return;
    } else if (activeStep === 1) {
      if (!validateStep1()) return;
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get workflow key from selected FI type
      const selectedFiType = fiTypes.find(ft => ft.code === formData.fiTypeCode);
      const workflowKey = selectedFiType?.registrationWorkflowKey || 'fiRegistration';

      // Prepare workflow variables (matching Ext JS variable names)
      const variables: Record<string, any> = {
        fwf_fiStartTaskBaseFiIdentity: formData.identity,
        fwf_fiStartTaskBaseTaskNumber: formData.edocNumber,
        fwf_fiStartTaskBaseTaskReceiptDate: formData.edocDate?.toISOString(),
        fiTypeCode: formData.fiTypeCode,
        fwf_fiRegLegalFormType: formData.legalFormType,
        fwf_fiRegFiName: formData.fiName,
        fwf_fiRegRegistryAddressRegion: formData.legalAddressRegion,
        fwf_fiRegRegistryAddressCity: formData.legalAddressCity,
        fina_legalAddressAddress: formData.legalAddress,
        fwf_fiRegFiIsAddressSame: formData.isAddressSame,
      };

      // Add factual address if different
      if (!formData.isAddressSame) {
        variables.fwf_fiRegRegistryFactualAddressRegion = formData.factualAddressRegion;
        variables.fwf_fiRegRegistryFactualAddressCity = formData.factualAddressCity;
        variables.fwf_fiRegFiFactualAddress = formData.factualAddress;
      }

      // Add registration number if provided
      if (formData.registrationNumber) {
        variables.fwf_fiStartTaskBaseFiCode = formData.registrationNumber;
      }

      // Create workflow
      const response = await createWorkflow(workflowKey, {
        variables,
        businessKey: formData.identity,
      });

      console.log('Workflow created:', response.data);

      // Navigate to the created FI (mock ID for now)
      alert('Registration created successfully! (Mock mode - no actual FI created)');
      history.push('/first/registration');
    } catch (error) {
      console.error('Failed to create registration:', error);
      alert('Failed to create registration. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep0 = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info">
          Enter the basic information to start the FI registration process.
        </Alert>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="E-doc Number"
          value={formData.edocNumber}
          onChange={(e) => handleFieldChange('edocNumber', e.target.value)}
          error={!!errors.edocNumber}
          helperText={errors.edocNumber}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="E-doc Date *"
            value={formData.edocDate}
            onChange={(date) => handleFieldChange('edocDate', date)}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: !!errors.edocDate,
                helperText: errors.edocDate,
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Identity (Tax ID / Personal ID)"
          value={formData.identity}
          onChange={(e) => handleFieldChange('identity', e.target.value)}
          error={!!errors.identity}
          helperText={errors.identity || '9 digits for organizations, 11 digits for individuals'}
          inputProps={{ maxLength: 11 }}
        />
      </Grid>

      {existingFiWarning && (
        <Grid item xs={12}>
          <Alert severity="warning">{existingFiWarning}</Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderStep1 = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info">
          Complete the registration form with FI details.
        </Alert>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          select
          label="FI Type"
          value={formData.fiTypeCode}
          onChange={(e) => handleFieldChange('fiTypeCode', e.target.value)}
          error={!!errors.fiTypeCode}
          helperText={errors.fiTypeCode}
        >
          {fiTypes.map(type => (
            <MenuItem key={type.code} value={type.code}>
              {type.code} - {type.description}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Registration Number (Optional)"
          value={formData.registrationNumber}
          onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          select
          label="Legal Form"
          value={formData.legalFormType}
          onChange={(e) => handleFieldChange('legalFormType', e.target.value)}
          error={!!errors.legalFormType}
          helperText={errors.legalFormType}
          disabled={formData.identity.length === 11}
        >
          {legalForms.map(form => (
            <MenuItem key={form.value} value={form.value}>
              {form.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label="Legal Name"
          value={formData.fiName}
          onChange={(e) => handleFieldChange('fiName', e.target.value)}
          error={!!errors.fiName}
          helperText={errors.fiName}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Legal Address
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          select
          label="Region"
          value={formData.legalAddressRegion}
          onChange={(e) => handleFieldChange('legalAddressRegion', e.target.value)}
          error={!!errors.legalAddressRegion}
          helperText={errors.legalAddressRegion}
        >
          {regions.map(region => (
            <MenuItem key={region.id} value={region.id}>
              {region.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          select
          label="City"
          value={formData.legalAddressCity}
          onChange={(e) => handleFieldChange('legalAddressCity', e.target.value)}
          error={!!errors.legalAddressCity}
          helperText={errors.legalAddressCity}
          disabled={!formData.legalAddressRegion}
        >
          {legalCities.map(city => (
            <MenuItem key={city.id} value={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          required
          label="Address"
          value={formData.legalAddress}
          onChange={(e) => handleFieldChange('legalAddress', e.target.value)}
          error={!!errors.legalAddress}
          helperText={errors.legalAddress}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Factual Address Same as Legal?</FormLabel>
          <RadioGroup
            row
            value={formData.isAddressSame}
            onChange={(e) => handleFieldChange('isAddressSame', e.target.value === 'true')}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {!formData.isAddressSame && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Factual Address
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              select
              label="Region"
              value={formData.factualAddressRegion}
              onChange={(e) => handleFieldChange('factualAddressRegion', e.target.value)}
              error={!!errors.factualAddressRegion}
              helperText={errors.factualAddressRegion}
            >
              {regions.map(region => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              select
              label="City"
              value={formData.factualAddressCity}
              onChange={(e) => handleFieldChange('factualAddressCity', e.target.value)}
              error={!!errors.factualAddressCity}
              helperText={errors.factualAddressCity}
              disabled={!formData.factualAddressRegion}
            >
              {factualCities.map(city => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="Address"
              value={formData.factualAddress}
              onChange={(e) => handleFieldChange('factualAddress', e.target.value)}
              error={!!errors.factualAddress}
              helperText={errors.factualAddress}
            />
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderStep2 = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="success">
          Review your registration details before submitting.
        </Alert>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
          <Typography><strong>E-doc Number:</strong> {formData.edocNumber}</Typography>
          <Typography><strong>E-doc Date:</strong> {formData.edocDate?.toLocaleDateString()}</Typography>
          <Typography><strong>Identity:</strong> {formData.identity}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Registration Details</Typography>
          <Typography><strong>FI Type:</strong> {fiTypes.find(ft => ft.code === formData.fiTypeCode)?.description}</Typography>
          <Typography><strong>Legal Form:</strong> {legalForms.find(lf => lf.value === formData.legalFormType)?.label}</Typography>
          <Typography><strong>Legal Name:</strong> {formData.fiName}</Typography>
          {formData.registrationNumber && (
            <Typography><strong>Registration Number:</strong> {formData.registrationNumber}</Typography>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Legal Address</Typography>
          <Typography><strong>Region:</strong> {regions.find(r => r.id === formData.legalAddressRegion)?.name}</Typography>
          <Typography><strong>City:</strong> {legalCities.find(c => c.id === formData.legalAddressCity)?.name}</Typography>
          <Typography><strong>Address:</strong> {formData.legalAddress}</Typography>
        </Paper>
      </Grid>

      {!formData.isAddressSame && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Factual Address</Typography>
            <Typography><strong>Region:</strong> {regions.find(r => r.id === formData.factualAddressRegion)?.name}</Typography>
            <Typography><strong>City:</strong> {factualCities.find(c => c.id === formData.factualAddressCity)?.name}</Typography>
            <Typography><strong>Address:</strong> {formData.factualAddress}</Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

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
        <Typography variant="h4">Create New FI Registration</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeStep === 0 && renderStep0()}
            {activeStep === 1 && renderStep1()}
            {activeStep === 2 && renderStep2()}

            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>

              <Box>
                {activeStep === STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Submit Registration
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default RegistrationCreatePage;
