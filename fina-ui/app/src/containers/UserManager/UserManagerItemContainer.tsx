import UsersItemPage from "../../components/UserManagement/Users/UsersItemPage";
import { useHistory } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { userBaseRoute } from "../../components/UserManagement/Users/Common/UserRoutes";
import {
  deleteUser,
  loadUser,
  loadUserGroups,
  loadUsersAndGroups,
  restoreDeletedUser,
  updateUser,
} from "../../api/services/userManagerService";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import UserManagerItemSkeleton from "../../components/UserManagement/skeletons/UserManagerItemSkeleton";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import RelationsModal from "../../components/UserManagement/Users/RelationsModal";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { bindActionCreators } from "redux";
import {
  changeEditMode,
  updateUser as updateCurrUser,
} from "../../redux/actions/userActions";
import { connect } from "react-redux";
import { UserAuthTypeEnum } from "../../types/common.type";
import {
  NewUserInfo,
  UserAndGroup,
  UserAndGroupWithUIProps,
  UserType,
  UserTypeEnum,
  UserTypeWithUIProps,
} from "../../types/user.type";
import {
  validateEmail as isMailValid,
  validatePassword as isPasswordValid,
  validateUserLogin as isLoginValid,
} from "../../util/component/validationUtil";
import LogoutModal from "../../components/Sidebar/LogoutModal";
import { Config } from "../../types/config.type";
import { Group } from "../../types/group.type";
import { CancelIcon } from "../../api/ui/icons/CancelIcon";

interface IUserValidationForm {
  config: Config;
  isLoginValid: boolean;
  isEmailValid: boolean;
  requiredFields: string[];
  isPasswordValid: boolean;
  passwordMatch: boolean;
  isRequiredFieldsFilled: boolean;
  invalidPasswordTooltip: string | boolean;
  validateLogin(login: string): void;
  validateEmail(currUser: UserType, email: string): boolean;
  validatePassword(currUser: UserType, password: string): boolean;
  isValidForm(user: UserType): boolean | string;
  getValidationMessageI18nKey(): string;
}

class UserValidationForm {
  config: Config;
  isLoginValid: boolean;
  isEmailValid: boolean;
  requiredFields: string[];
  isPasswordValid: boolean;
  passwordMatch: boolean;
  isRequiredFieldsFilled: boolean;
  invalidPasswordTooltip: string | boolean;

  constructor(
    config: Config,
    requiredFields: string[],
    isValidRequiredField: boolean
  ) {
    const isPassValid =
      config.authenticationType === UserAuthTypeEnum.LDAP
        ? true
        : isValidRequiredField;
    this.config = config;
    this.isLoginValid = isValidRequiredField;
    this.isEmailValid = true;
    this.requiredFields = requiredFields;
    this.isPasswordValid = isPassValid;
    this.passwordMatch = isPassValid;
    this.isRequiredFieldsFilled = isValidRequiredField;
    this.invalidPasswordTooltip = "";
  }

  validateLogin(login: string) {
    this.isLoginValid = isLoginValid(login);
  }

  validateEmail(currUser: UserType, email: string) {
    if (currUser.userType === UserTypeEnum.FINA_USER) {
      let isValid = true;
      if (email?.trim().length === 0 && this.requiredFields.includes("email")) {
        isValid = false;
        this.isEmailValid = isValid;
        return isValid;
      }

      isValid = isMailValid(this.config, email);
      this.isEmailValid = isValid;
      return isValid;
    }
    this.isEmailValid = true;
    return true;
  }

  validatePassword(currUser: UserType, password: string) {
    const invalidPassword = isPasswordValid(this.config, password);
    if (invalidPassword) {
      this.invalidPasswordTooltip = invalidPassword;
      this.isPasswordValid = false;
      return false;
    }
    this.isPasswordValid = true;
    this.invalidPasswordTooltip = "";
    return true;
  }

  isValidForm(user: UserType) {
    let valid = true;
    if (user.userType === UserTypeEnum.LDAP_USER) {
      this.isRequiredFieldsFilled = false;
      return user.login;
    }
    if (this.config.authenticationType !== UserAuthTypeEnum.LDAP) {
      this.isRequiredFieldsFilled = this.requiredFields.every((field) => {
        const key = field as keyof UserType;
        const value = user[key];

        return (
          value || (typeof value === "string" && value?.trim()?.length > 0)
        );
      });
    }

    return (
      valid &&
      this.isLoginValid &&
      this.isEmailValid &&
      this.isPasswordValid &&
      this.passwordMatch &&
      this.isRequiredFieldsFilled
    );
  }

  getValidationMessageI18nKey() {
    if (!this.isLoginValid) {
      return "invalidlogin";
    }
    if (!this.passwordMatch) {
      return "passwordDoesntMatch";
    }
    if (!this.isEmailValid) {
      return "invalidemail";
    }
    if (!this.isRequiredFieldsFilled) {
      return "requiredFieldsAreEmpty";
    }
    if (!this.isPasswordValid) {
      switch (this.invalidPasswordTooltip) {
        case "MINIMUM_LENGTH":
          return "passwordMinimalLength";
        case "WITH_CHARS":
          return "passwordLetters";
        case "WITH_NUMS":
          return "passwordShouldContainNumbers";
        case "WITH_SPECIAL_CHARACTERS":
          return "passwordSpecialCharacters";
        case "WITH_CHARS_UPPER":
          return "passwordUpperCase";
        default:
          return "";
      }
    }
    return "";
  }
}

const parseRequiredFieldsConfig = (config: Config) => {
  try {
    if (
      config.properties["net.fina.user.requiredFields"] &&
      config.properties["net.fina.user.requiredFields"].length > 0
    ) {
      return config.properties["net.fina.user.requiredFields"].split(",");
    }
  } catch (e) {
    console.error(e);
  }

  return ["login"];
};

interface UserManagerItemContainerProps {
  config: Config;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  userId: string;
  tabName?: string;
  updateCurrUser: (user: Partial<UserType>) => void;
}

const UserManagerItemContainer: React.FC<UserManagerItemContainerProps> = ({
  config,
  editMode = false,
  setEditMode,
  userId,
  tabName,
  updateCurrUser,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  // const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [currUser, setCurrUser] = useState<Partial<UserTypeWithUIProps> | null>(
    Number(userId) === 0 ? { id: 0 } : Number(userId) === -1 ? { id: -1 } : null
  );
  const [usersData] = useState<UserType[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [usersGroupsData, setUsersGroupsData] = useState<UserAndGroup[]>([]);
  const [nextUserId, setNextUserId] = useState<number>();
  const [cancelModel, setCancelModal] = useState(false);
  const [openRelationWarningModal, setOpenRelationWarningModal] =
    useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [deletedUserId, setDeletedUserId] = useState(-1);
  const [newUserInfo, setNewUserInfo] = useState<NewUserInfo>({
    userLogin: "",
    userFullName: "",
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const currentUserDataRef = useRef<Partial<UserTypeWithUIProps>>({});
  let usersGroupsDataRef = useRef<UserAndGroup[]>([]);

  const requiredFields = parseRequiredFieldsConfig(config);

  const formValidationRef = useRef<IUserValidationForm | null>(null);

  useEffect(() => {
    init();
    formValidationRef.current = new UserValidationForm(
      config,
      requiredFields,
      Number(userId) > 0
    );
  }, [userId]);

  useEffect(() => {
    if (currUser && currUser?.id) {
      loadGroups();
    }
  }, [currUser]);

  const loadGroups = () => {
    const id = currUserData?.id;
    if (id && Number(userId) > 0) {
      loadUserGroups(id).then((resp) => {
        onChangeUserData({
          groupIds: resp.data.map((group: UserAndGroup) => group.id),
        });
        setGroups(resp.data);
      });
    }
  };

  const init = async () => {
    let usersGroups: UserAndGroupWithUIProps[] = usersGroupsData;
    if (!usersGroups || usersGroups.length === 0) {
      const loaded = await loadUsersAndGroupsFunc();
      if (loaded) {
        usersGroups = loaded;
        usersGroupsDataRef.current = loaded;
        setUsersGroupsData(loaded);
      }
    }
    const user = await loadCurrUser();
    if (user) {
      const findFirstUser = usersGroups
        .flatMap((g) => (g.group ? g.users || [] : g))
        .find((u) => u.id === user.id);

      setCurrUser(() => {
        const newUser = {
          ...user,
          uniqueId:
            currentUserDataRef?.current?.uniqueId || findFirstUser?.uniqueId,
        };
        currentUserDataRef.current = newUser;
        return newUser;
      });
    }
  };

  const generateUniqueIdsAndUpdateData = (data: UserAndGroup[]) => {
    return data.map((g) => {
      return g.group
        ? {
            ...g,
            users: g?.users?.map((user) => ({
              ...user,
              uniqueId: user.id + "-" + g.code,
            })),
          }
        : { ...g, uniqueId: g?.id };
    });
  };

  const loadUsersAndGroupsFunc = async () => {
    return loadUsersAndGroups()
      .then((res) => generateUniqueIdsAndUpdateData(res.data))
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const changeNewUserInfo = (key: string, value: string) => {
    let newUserInfoObj = newUserInfo;
    newUserInfo[key as keyof NewUserInfo] = value;
    setNewUserInfo({ ...newUserInfoObj });
  };

  const onTabClickFunction = (route: string) => {
    history.push(`${userBaseRoute}/${userId}/${route}`);
  };

  const loadCurrUser = () => {
    if (Number(userId) > 0) {
      return loadUser(parseInt(userId)).then((resp) => {
        return resp.data;
      });
    } else if (Number(userId) !== -1) {
      setEditMode(true);
    }
  };

  const onChangeUserData = (object: Partial<UserType>) => {
    Object.assign(currentUserDataRef.current, object);
  };

  const resetUserData = (object: Partial<UserType>) => {
    currentUserDataRef.current = object;
  };

  const saveDisabledUser = (disable: boolean) => {
    return saveUser(disable);
  };

  const saveUserApi = (disableRelations: boolean, user: Partial<UserType>) => {
    setLoading(true);
    let info = { ...user };
    if (Number(userId) !== 0 && !user["passwordChanged"]) {
      delete info.password;
    }

    updateUser(user.id, info, disableRelations)
      .then((resp) => {
        enqueueSnackbar(t("saved"), { variant: "success" });
        if (Number(userId) === 0) {
          history.push(`${userBaseRoute}/${resp.data.id}/${tabName}`);
        }
        if (resp.data) {
          let newCurrUser = {
            ...currUser,
            ...resp.data,
            ...(!currUser?.uniqueId && {
              uniqueId: "newUser-" + user.id,
            }),
            groupIds: currentUserDataRef.current.groupIds,
          };

          if (disableRelations) {
            newCurrUser = {
              ...newCurrUser,
              fiIds: [],
              groupIds: [],
              permissionIds: [],
              reportIds: [],
              returnIds: [],
              returnVersions: [],
              ecmGroups: [],
              mdtNodes: [],
            };
          }

          setCurrUser(newCurrUser);
          currentUserDataRef.current = { ...newCurrUser };
          setEditMode(false);
          setShowLogoutModal(resp.data.mustReLogin);

          const isNewUser = Number(userId) === 0;

          setUsersGroupsData((prevState) => {
            usersGroupsDataRef.current = modifyUserGroupsData(
              newCurrUser,
              usersGroupsDataRef.current,
              isNewUser
            );
            return modifyUserGroupsData(newCurrUser, prevState, isNewUser);
          });
          updateCurrUser(newCurrUser);
        }
      })
      .catch((error) => {
        const errorData = error.response?.data;
        if (!errorData) return;
        if (errorData && errorData.code === "USER_PROGRAMMATICALLY_DELETE") {
          setOpenRestoreModal(true);
          const number = parseInt(
            errorData.messageParams.substring(
              1,
              errorData.messageParams.length - 1
            )
          );
          setDeletedUserId(number);
        } else {
          enqueueSnackbar(errorData.message, { variant: "error" });
        }
      })
      .finally(() => setLoading(false));
  };

  const saveUser = (disableRelations: boolean) => {
    const user = currentUserDataRef.current;

    if (config.authenticationType !== UserAuthTypeEnum.LDAP) {
      saveUserApi(disableRelations, user);
    } else {
      saveUserApi(disableRelations, { ...currUser, ...user });
    }
  };

  const saveHandler = (formValidationHelper: any) => {
    const user = currentUserDataRef.current;

    const isValid = formValidationHelper.isValidForm(user);
    if (!isValid) {
      enqueueSnackbar(t(formValidationHelper.getValidationMessageI18nKey()), {
        variant: "error",
      });
      return;
    }
    if (user.disabled && user?.id) {
      handleRelationModal();
    } else {
      saveUser(false);
    }
  };

  const restoreUserHandler = () => {
    return restoreUser(deletedUserId);
  };
  const restoreUser = (id: number) => {
    restoreDeletedUser(id)
      .then((resp) => {
        const restoredUser = {
          ...resp.data,
          groupIds: currentUserDataRef.current.groupIds,
          uniqueId: "restoredUser-" + id,
        };
        setCurrUser(restoredUser);
        setEditMode(false);
        usersGroupsDataRef.current = [restoredUser, ...usersGroupsData];
        setUsersGroupsData([restoredUser, ...usersGroupsData]);
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };
  const onCancelEdit = () => {
    setEditMode(false);
    if (Number(userId) === 0) {
      history.push(userBaseRoute);
    }
  };

  const userChangeHandler = (id?: number) => {
    let splitPath = history.location.pathname.split("/");
    let activeTabName = splitPath[splitPath.length - 1];
    history.push(`${userBaseRoute}/${id}/${activeTabName}`);
  };

  const onUserSelectChange = (item: UserType) => {
    const currUserId = currUser?.id;
    currentUserDataRef.current = item;
    setNextUserId(item.id);
    if (editMode && currUserId !== item.id) {
      setCancelModal(true);
    } else {
      if (currUserId === item.id) {
        setCurrUser(item);
      } else {
        userChangeHandler(item.id);
      }
    }
  };

  const handleRelationModal = () => {
    setOpenRelationWarningModal(true);
  };

  const deleteAndUpdateUsersGroupsData = useCallback(
    (userId: number, data: UserAndGroup[]) => {
      return data.reduce((acc: UserAndGroup[], item) => {
        if (item.group) {
          const updatedUsers = item?.users?.filter(
            (user) => user.id !== userId
          );
          acc.push({ ...item, users: updatedUsers });
        } else if (item.id !== userId) {
          acc.push(item);
        }

        return acc;
      }, []);
    },
    [currUser, usersGroupsData]
  );

  const deleteUserFunction = async (userId: number) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      setUsersGroupsData((prevState) => {
        return deleteAndUpdateUsersGroupsData(userId, prevState);
      });
      updateCurrUser({ ...currUser, deleted: true });
      setCurrUser({ id: -1 });
      currentUserDataRef.current = {};
      usersGroupsDataRef.current = deleteAndUpdateUsersGroupsData(
        userId,
        usersGroupsDataRef.current
      );
      userChangeHandler(-1);

      enqueueSnackbar(t("deleted"), { variant: "success" });
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInUsersGroups = useCallback(
    (currUser: UserTypeWithUIProps, data: UserAndGroupWithUIProps[]) => {
      return data.map((item) => {
        if (item.group) {
          const updatedUsers = item?.users?.map((user) => {
            if (user.id === currUser.id) {
              return { ...currUser, uniqueId: user.uniqueId };
            }
            return user;
          });

          return { ...item, users: updatedUsers };
        } else if (item.id === currUser.id) {
          return { ...currUser, uniqueId: item.uniqueId };
        }
        return item;
      });
    },
    [usersGroupsData, currUser]
  );

  const addRemoveUserInGroups = useCallback(
    (user: UserTypeWithUIProps, newData: UserAndGroup[]) => {
      const hasGroupIds = user.groupIds && user.groupIds.length > 0;

      let data: Partial<UserAndGroupWithUIProps>[] = hasGroupIds
        ? newData.filter((item) => item.id !== user.id)
        : newData;

      data = data.map((group) => {
        if (!group.group || (user.id === group.id && !group.group)) {
          return group;
        }

        const userInGroup = group.users?.some((u) => u.id === user.id) || false;
        const shouldBeInGroup =
          hasGroupIds && group.id && user?.groupIds?.includes(group.id);

        if (
          (!userInGroup && !shouldBeInGroup) ||
          (userInGroup && shouldBeInGroup)
        ) {
          return group;
        }

        if (shouldBeInGroup && !userInGroup) {
          return {
            ...group,
            users: [
              ...(group.users || []),
              { ...user, uniqueId: user.id + "-" + group.code },
            ],
          };
        }

        const filteredUsers = (group?.users ?? []).filter(
          (u) => u.id !== user.id
        );
        return { ...group, users: filteredUsers };
      });

      if (!hasGroupIds) {
        const wasInGroups = newData.some((g) =>
          g.users?.some((u) => u.id === user.id)
        );
        if (wasInGroups) {
          setCurrUser((prevState) => ({ ...prevState, uniqueId: user.id }));
          data.unshift({ ...user, uniqueId: user.id });
        }
      }

      return data;
    },
    [usersGroupsData, currUser]
  );

  const modifyUserGroupsData = useCallback(
    (currUser: UserAndGroup, data: UserAndGroup[], isNewUser: boolean) => {
      let finalModifyUsersGroupsData: any = [...data];

      if (isNewUser) {
        finalModifyUsersGroupsData = [currUser, ...finalModifyUsersGroupsData];
      }

      finalModifyUsersGroupsData = [
        ...updateUserInUsersGroups(currUser, finalModifyUsersGroupsData),
      ];
      finalModifyUsersGroupsData = [
        ...addRemoveUserInGroups(currUser, finalModifyUsersGroupsData),
      ];

      return finalModifyUsersGroupsData;
    },
    [usersGroupsData, currUser]
  );

  const currUserData = useMemo(() => {
    return { ...currUser, ...currentUserDataRef.current };
  }, [currUser, currentUserDataRef.current]);

  return (
    <>
      {currUser ? (
        <UsersItemPage
          editMode={editMode}
          loading={loading}
          onEditFunction={(value) => {
            setEditMode(value !== undefined && value !== null ? !!value : true);
          }}
          onCancelFunction={() => {
            onCancelEdit();
            currentUserDataRef.current = currUser;
          }}
          onSaveFunction={saveHandler}
          currUser={currUserData}
          activeTabName={tabName}
          onTabClickFunction={onTabClickFunction}
          setUserData={onChangeUserData}
          newUserInfo={newUserInfo}
          changeNewUserInfo={changeNewUserInfo}
          onUserSelectChange={onUserSelectChange}
          config={config}
          setCurrUser={setCurrUser}
          deleteUserFunction={deleteUserFunction}
          usersData={usersData}
          usersGroupsData={usersGroupsData}
          setUsersGroupsData={setUsersGroupsData}
          openRestoreModal={openRestoreModal}
          setOpenRestoreModal={setOpenRestoreModal}
          restoreUserFunction={restoreUserHandler}
          formValidationHelper={formValidationRef.current}
          requiredFields={requiredFields}
          resetUserData={resetUserData}
          userId={userId}
          usersGroupsDataRef={usersGroupsDataRef}
          groups={groups}
        />
      ) : (
        <UserManagerItemSkeleton />
      )}
      {cancelModel && (
        <ConfirmModal
          isOpen={cancelModel}
          setIsOpen={setCancelModal}
          onConfirm={() => {
            userChangeHandler(nextUserId);
            setCancelModal(false);
            setEditMode(false);
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
      )}
      {openRelationWarningModal && (
        <RelationsModal
          setOpenRelationWarningModal={setOpenRelationWarningModal}
          openRelationWarningModal={openRelationWarningModal}
          onSave={saveDisabledUser}
          title={"removeuserrelations"}
          saveOnClose={true}
        />
      )}
      {showLogoutModal && (
        <LogoutModal
          modalContent={"permissionchangedlogoutconfirm"}
          openLogoutModal={showLogoutModal}
          setOpenLogoutModal={setShowLogoutModal}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  editMode: state.get("user").editMode,
});

const dispatchToProps = (dispatch: any) => ({
  setEditMode: bindActionCreators(changeEditMode, dispatch),
  updateCurrUser: bindActionCreators(updateCurrUser, dispatch),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(UserManagerItemContainer);
