/**
 * FIRST Module Router
 * Main routing configuration for the FIRST module
 */
import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Lazy load pages
const FirstMainPage = React.lazy(() => import('./FirstMainPage'));
const RegistrationPage = React.lazy(() => import('./Registration/RegistrationPage'));
const RegistrationDetailPage = React.lazy(() => import('./Registration/RegistrationDetailPage'));
const TaskPage = React.lazy(() => import('./Task/TaskPage'));
const OrganizationPage = React.lazy(() => import('./Organization/OrganizationPage'));
const QuestionnairePage = React.lazy(() => import('./Questionnaire/QuestionnairePage'));
const FiTypePage = React.lazy(() => import('./FiType/FiTypePage'));
const DashboardPage = React.lazy(() => import('./Dashboard/DashboardPage'));
const BlacklistPage = React.lazy(() => import('./Blacklist/BlacklistPage'));
const AttestationPage = React.lazy(() => import('./Attestation/AttestationPage'));
const LicenseTypePage = React.lazy(() => import('./LicenseType/LicenseTypePage'));
const SearchPage = React.lazy(() => import('./Search/SearchPage'));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

interface FirstRouterProps {
  config?: any;
}

const FirstRouter: React.FC<FirstRouterProps> = ({ config }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Main FIRST landing page */}
        <Route exact path="/first" component={FirstMainPage} />

        {/* Registration module routes */}
        <Route exact path="/first/registration" component={RegistrationPage} />
        <Route path="/first/registration/:fiId" component={RegistrationDetailPage} />

        {/* Task management */}
        <Route path="/first/tasks" component={TaskPage} />

        {/* Organization/Individual */}
        <Route path="/first/organization" component={OrganizationPage} />

        {/* Questionnaire management */}
        <Route path="/first/questionnaire" component={QuestionnairePage} />

        {/* FI Type configuration */}
        <Route path="/first/fi-types" component={FiTypePage} />

        {/* Dashboard */}
        <Route path="/first/dashboard" component={DashboardPage} />

        {/* Blacklist */}
        <Route path="/first/blacklist" component={BlacklistPage} />

        {/* Attestation */}
        <Route path="/first/attestation" component={AttestationPage} />

        {/* License Types */}
        <Route path="/first/license-types" component={LicenseTypePage} />

        {/* Search */}
        <Route path="/first/search" component={SearchPage} />

        {/* Default redirect */}
        <Redirect to="/first" />
      </Switch>
    </Suspense>
  );
};

export default FirstRouter;
