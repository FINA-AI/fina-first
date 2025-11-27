import menuLink from "./menuLink";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import GavelIcon from "@mui/icons-material/Gavel";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RuleIcon from "@mui/icons-material/Rule";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import PollIcon from "@mui/icons-material/Poll";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { PERMISSIONS } from "../permissions";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import QuizIcon from "@mui/icons-material/Quiz";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import EventIcon from "@mui/icons-material/Event";
import TranslateIcon from "@mui/icons-material/Translate";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DvrIcon from "@mui/icons-material/Dvr";
import React from "react";
import DashboardPage from "../../components/Dashboard/DashboardPage";
import CEMSRouter from "../../components/CEMS/CEMSRouter";
import EmsRouter from "../../components/EMS/EmsRouter";
import CatalogMainContainer from "../../components/Catalog/CatalogMainContainer";
import ActiveUsersContainer from "../../containers/Activeusers/ActiveUsersContainer";
import SurveyContainer from "../../containers/SurveyContainer";
import SettingsContainer from "../../containers/Settings/SettingsContainer";
import ReturnManagerTabPanel from "../../components/ReturnManager/ReturnManagerTabPanel";
import ReturnDefinitionsContainer from "../../containers/ReturnDefinitions/ReturnDefinitionsContainer";
import ImportManagerPage from "../../components/ImportManager/ImportManagerPage";
import ReportManageRouter from "../../components/ReportManager/ReportManageRouter";
import ToolsContainer from "../../containers/Tools/ToolsContainer";
import CalendarContainer from "../../containers/Calendar/CalendarContainer";
import MatrixRouter from "../../components/Matrix/MatrixRouter";
import AboutContainer from "../../containers/About/AboutContainer";
import MessagesContainer from "../../containers/Messages/MessagesContainer";
import NotificationsContainer from "../../containers/Notifications/NotificationsContainer";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { MainMenuItem, PermittedMenuItem } from "../../types/mainMenu.type";
import { Config } from "../../types/config.type";

const FI = React.lazy(() => import("../../components/FI/FIRouter"));
const ConfigurationRouter = React.lazy(
  () => import("../../components/FI/ConfigurationRouter")
);
const MDT = React.lazy(() => import("../../containers/MDT/MDTContainer"));
const UserManager = React.lazy(
  () => import("../../components/UserManagement/UserManagerRouter")
);
const ComparisonRules = React.lazy(
  () => import("../../containers/ComparisonsRules/ComparisonsRulesContainer")
);

const ReturnScheduler = React.lazy(
  () =>
    import(
      "../../components/ReturnCreationSchedule/ReturnCreationScheduleRouter"
    )
);

const PeriodDefinitions = React.lazy(
  () => import("../../components/PeriodDefinition/PeriodDefinitionPage")
);
const Schedules = React.lazy(
  () => import("../../containers/Schedules/SchedulesContainer")
);

const LegislativeDocument = React.lazy(
  () =>
    import("../../containers/LegislativeDocument/LegislativeDocumentContainer")
);
const FAQ = React.lazy(() => import("../../containers/FAQ/FAQContainer"));
const UserFileSpace = React.lazy(
  () => import("../../components/UserFileSpace/UserFileSpacePage")
);

const Bundles = React.lazy(
  () => import("../../containers/Bundles/BundlesContainer")
);

const menuItems: MainMenuItem[] = [
  {
    key: "fi",
    name: "Fis",
    icon: AccountBalanceIcon,
    link: menuLink.fi,
    i18nKey: "menu_fis",
    isOpened: true,
    permissions: [PERMISSIONS.FI_REVIEW],
    component: FI,
  },
  {
    key: "fi_config",
    name: "Configuration",
    icon: PermDataSettingIcon,
    link: menuLink.configuration,
    i18nKey: "menu_fi_config",
    isOpened: true,
    permissions: [PERMISSIONS.FI_AMEND],
    component: ConfigurationRouter,
  },
  {
    key: "user_manager",
    name: "User Management",
    icon: GroupIcon,
    link: menuLink.userManagement,
    isOpened: false,
    i18nKey: "menu_user_manager",
    permissions: [PERMISSIONS.USER_REVIEW],
    component: UserManager,
  },
  {
    key: "cems",
    name: "cems",
    icon: GavelIcon,
    link: menuLink.cems,
    i18nKey: "menu_cems",
    permissions: [PERMISSIONS.CEMS_INSPECTION_REVIEW],
    component: CEMSRouter,
  },
  {
    key: "ems",
    name: "Ems",
    icon: GavelIcon,
    link: menuLink.ems,
    i18nKey: "menu_ems",
    permissions: [PERMISSIONS.EMS_INSPECTION_REVIEW],
    component: EmsRouter,
  },
  {
    key: "catalog",
    name: "Catalog",
    icon: ListAltIcon,
    link: menuLink.catalog,
    isOpened: false,
    i18nKey: "menu_catalog",
    permissions: [PERMISSIONS.CATALOG_REVIEW],
    component: CatalogMainContainer,
  },
  {
    key: "active_users",
    name: "Active Users",
    icon: GroupAddIcon,
    link: menuLink.activeUsers,
    isOpened: false,
    i18nKey: "menu_active_users",
    permissions: [PERMISSIONS.ACTIVE_USER_REVIEW],
    component: ActiveUsersContainer,
  },
  {
    key: "settings",
    name: "Settings",
    icon: SettingsIcon,
    link: menuLink.settings,
    isOpened: false,
    i18nKey: "menu_settings",
    permissions: [PERMISSIONS.SETTINGS],
    component: SettingsContainer,
  },
  {
    key: "mdt",
    name: "MDT",
    icon: AccountTreeIcon,
    link: menuLink.mdt,
    isOpened: false,
    i18nKey: "menu_mdt",
    permissions: [PERMISSIONS.MDT_REVIEW],
    component: MDT,
  },
  {
    key: "comparisons",
    name: "Comparisons",
    icon: RuleIcon,
    link: menuLink.comparisons,
    isOpened: false,
    i18nKey: "menu_comparisons",
    permissions: [PERMISSIONS.MDT_REVIEW],
    component: ComparisonRules,
  },
  {
    key: "survey",
    name: "Survey",
    icon: PollIcon,
    link: menuLink.survey,
    isOpened: false,
    i18nKey: "menu_survey",
    permissions: [PERMISSIONS.SURVEY_REVIEW],
    component: SurveyContainer,
  },
  {
    key: "return_manager",
    name: "Return Manager",
    icon: BusinessCenterIcon,
    link: menuLink.returnManager,
    isOpened: false,
    i18nKey: "menu_return_manager",
    permissions: [PERMISSIONS.RETURNS_REVIEW],
    component: ReturnManagerTabPanel,
  },
  {
    key: "RETURN_DEFINITION",
    name: "Return Definitions",
    icon: NewspaperIcon,
    link: menuLink.returndefinitions,
    isOpened: false,
    i18nKey: "menu_return_definitions",
    permissions: [PERMISSIONS.RETURN_DEFINITION_REVIEW],
    component: ReturnDefinitionsContainer,
  },
  {
    key: "return_schedule",
    name: "Return Scheduler",
    icon: PendingActionsIcon,
    link: menuLink.returncreationschedule,
    isOpened: false,
    i18nKey: "menu_return_schedule",
    permissions: [PERMISSIONS.RETURN_SCHEDULER_REVIEW],
    component: ReturnScheduler,
  },
  {
    key: "period_definitions",
    name: "Period Definitions",
    icon: CalendarMonthIcon,
    link: menuLink.perioddefinitions,
    isOpened: false,
    i18nKey: "menu_period_definitions",
    permissions: [PERMISSIONS.PERIODS_REVIEW],
    component: PeriodDefinitions,
  },
  {
    key: "import_manager",
    name: "Import Manager",
    icon: DownloadIcon,
    link: menuLink.importmanager,
    isOpened: false,
    i18nKey: "menu_import_manager",
    permissions: [PERMISSIONS.IMPORT_MANAGER_REVIEW],
    component: ImportManagerPage,
  },
  {
    key: "reports",
    name: "Reports",
    icon: QueryStatsIcon,
    link: menuLink.reports,
    isOpened: false,
    i18nKey: "menu_reports",
    permissions: [PERMISSIONS.REPORTS_REVIEW],
    component: ReportManageRouter,
  },
  {
    key: "schedules",
    name: "Schedules",
    icon: ScheduleIcon,
    link: menuLink.schedules,
    isOpened: false,
    i18nKey: "menu_schedules",
    permissions: [PERMISSIONS.SCHEDULE_REVIEW],
    component: Schedules,
  },
  {
    key: "tools",
    name: "Tools",
    icon: ManageAccountsIcon,
    link: menuLink.tools,
    isOpened: false,
    i18nKey: "menu_tools",
    permissions: [PERMISSIONS.TOOLS_REVIEW],
    component: ToolsContainer,
  },
  {
    key: "legislative",
    name: "Legislative Document",
    icon: ReceiptLongIcon,
    link: menuLink.legislativeDocument,
    isOpened: false,
    i18nKey: "menu_legislative",
    permissions: [PERMISSIONS.LEGISLATIVE_DOCUMENT_REVIEW],
    component: LegislativeDocument,
  },
  {
    key: "faq",
    name: "FAQ",
    icon: QuizIcon,
    link: menuLink.faq,
    isOpened: false,
    i18nKey: "menu_faq",
    permissions: [PERMISSIONS.FAQ_REVIEW],
    component: FAQ,
  },
  {
    key: "user_file_space",
    name: "User File Space",
    icon: FolderSharedIcon,
    link: menuLink.userFileSpace,
    isOpened: false,
    i18nKey: "menu_user_file_space",
    permissions: [PERMISSIONS.USER_FILE_SPACE_REVIEW],
    component: UserFileSpace,
  },
  {
    key: "calendar",
    name: "Calendar",
    icon: EventIcon,
    link: menuLink.calendar,
    isOpened: false,
    i18nKey: "menu_calendar",
    permissions: [PERMISSIONS.FINA_CALENDAR_REVIEW],
    component: CalendarContainer,
  },
  {
    key: "bundles",
    name: "Bundles",
    icon: TranslateIcon,
    link: menuLink.bundles,
    isOpened: false,
    i18nKey: "menu_bundle",
    permissions: [PERMISSIONS.FINA_TRANSLATIONS],
    component: Bundles,
  },
  {
    key: "first",
    name: "First",
    icon: DvrIcon,
    link: menuLink.first,
    isOpened: false,
    i18nKey: "menu_first",
    permissions: [PERMISSIONS.FINA_FIRST],
  },
  {
    key: "matrix",
    name: "Matrix",
    icon: DvrIcon,
    link: menuLink.matrix,
    isOpened: false,
    i18nKey: "menu_matrix",
    permissions: [PERMISSIONS.MENU_MATRIX],
    component: MatrixRouter,
  },
  {
    key: "document_management",
    name: "Document Management",
    icon: DvrIcon,
    link: menuLink.documentManagement,
    isOpened: false,
    i18nKey: "menu_document_management",
    permissions: [PERMISSIONS.DOCUMENT_MANAGEMENT],
  },
  {
    key: "first_dashboard",
    name: "First Dashboard",
    icon: DvrIcon,
    link: menuLink.firstDashboard,
    isOpened: false,
    i18nKey: "menu_first_dashboard",
    permissions: [PERMISSIONS.FIRST_DASHBOARD],
  },
];

const notificationsMenuItem = {
  key: "notifications",
  name: "Notifications",
  icon: NotificationsActiveIcon,
  link: menuLink.notification,
  isOpened: false,
  i18nKey: "menu_notifications",
  permissions: [PERMISSIONS.FINA_NOTIFICATIONS],
  component: NotificationsContainer,
  hidden: true,
};

const messagesMenuItem = {
  key: "messages",
  name: "Messages",
  icon: EmailIcon,
  link: menuLink.messages,
  isOpened: false,
  i18nKey: "menu_messages",
  permissions: [PERMISSIONS.COMMUNICATOR_MESSAGES_REVIEW],
  component: MessagesContainer,
  hidden: true,
};

export const dashboardMenuitem = {
  key: "dashboard",
  name: "Dashboard",
  icon: HomeIcon,
  link: menuLink.dashboard,
  isOpened: false,
  i18nKey: "menu_dashboard",
  permissions: [],
  component: DashboardPage,
};

const aboutMenuItem = {
  key: "about",
  name: "About",
  icon: HelpOutlineIcon,
  link: menuLink.about,
  isOpened: false,
  i18nKey: "menu_about",
  permissions: [],
  component: AboutContainer,
};

export const getMenus = (permittedMenus: PermittedMenuItem[]) => {
  const result: MainMenuItem[] = [dashboardMenuitem];
  if (!permittedMenus) {
    return result;
  }

  permittedMenus.forEach((prm) => {
    const m: MainMenuItem | undefined = menuItems.find(
      (mi) => mi.key.toLowerCase() === prm.code.toLowerCase()
    );

    if (m) {
      m.i18n = prm.i18n;
      m.iframeSrc = prm.iframeSrc;
      //check permission
      if (prm.permissions.some((item) => m.permissions.includes(item))) {
        result.push(m);
      } else {
        //if empty permissions allow
        result.push(m);
      }
    }
  });
  result.push(aboutMenuItem);
  return result;
};

export const getCommunicatorMenus = (config: Config): MainMenuItem[] => {
  const result = [];
  const hasMessagesPermission = config.permissions?.includes(
    PERMISSIONS.COMMUNICATOR_MESSAGES_REVIEW
  );
  const hasNotificationsPermissions = config.permissions?.includes(
    PERMISSIONS.FINA_NOTIFICATIONS
  );

  if (hasNotificationsPermissions) result.push(notificationsMenuItem);
  if (hasMessagesPermission) result.push(messagesMenuItem);

  return result;
};
