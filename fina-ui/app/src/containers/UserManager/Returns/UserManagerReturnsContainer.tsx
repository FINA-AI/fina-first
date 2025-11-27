import UserReturns from "../../../components/UserManagement/Users/Returns/UserReturns";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  getReturnDefinitions,
  getReturnTypes,
} from "../../../api/services/returnsService";
import {
  getGroupReturnDefinitions,
  getUserReturns,
} from "../../../api/services/userManagerService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";
import { ReturnType } from "../../../types/return.type";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";

interface UserManagerReturnsContainerProps {
  editMode: boolean;
  currData?: Partial<UserTypeWithUIProps>;
  groupMode?: boolean;
  tabName?: string;
  setData?(object: Partial<UserType>): void;
}

const UserManagerReturnsContainer: React.FC<
  UserManagerReturnsContainerProps
> = ({ setData, editMode, currData, groupMode = false }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [originalReturnDefinitions, setOriginalReturnDefinitions] = useState<
    ReturnDefinitionType[]
  >([]);
  const [returnDefinitions, setReturnDefinitions] = useState<
    ReturnDefinitionType[]
  >([]);
  const [returns, setReturns] = useState<ReturnDefinitionType[]>([]);
  const [checkedReturns, setCheckedReturns] = useState<ReturnDefinitionType[]>(
    []
  );
  const [returnTypes, setReturnTypes] = useState<ReturnType[]>([]);
  const [selectedReturnType, setSelectedReturnType] = useState<
    Partial<ReturnType>
  >({
    key: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [inheritedPermissions, setInheritedPermissions] = useState<
    ReturnDefinitionType[]
  >([]);
  let returnIds = useRef<number[]>([]);

  useEffect(() => {
    if (returnTypes.length === 0) {
      initReturnTypes();
    }

    initReturnData();
  }, [currData]);

  useEffect(() => {
    setCheckedReturns([...returns]);
    setReturnIds(returns);
  }, [editMode]);

  const initReturnData = () => {
    if (currData?.id) {
      if (groupMode) {
        setLoading(true);
        getGroupReturnDefinitions(currData.id).then((resp) => {
          const perms = resp.data;
          setReturns(perms);
          setCheckedReturns(perms);
          setReturnIds(perms);
          initReturnDefinitions(perms);
        });
      } else {
        setLoading(true);
        getUserReturns(currData.id).then((resp) => {
          const perms = resp.data;
          setReturns(perms);
          setCheckedReturns(perms);
          setReturnIds(perms);
          initReturnDefinitions(perms);
        });
      }
    } else {
      initReturnDefinitions([]);
    }
  };

  const onReturnTypeSelectionChange = (type: ReturnType) => {
    setSelectedReturnType(type);
    if (type.key === 0) {
      filterReturnDefinitions(originalReturnDefinitions, filter);
    } else {
      filterReturnDefinitions(
        originalReturnDefinitions.filter((r) => r.returnType?.id === type.key),
        filter
      );
    }
  };

  const filterReturnDefinitions = (
    definitionsData: ReturnDefinitionType[],
    filterValue: string
  ) => {
    if (filterValue && filterValue.trim().length > 0) {
      const filtered = definitionsData.filter(
        (returnDef) =>
          returnDef["code"]?.toLowerCase().includes(filterValue) ||
          returnDef["name"]?.toLowerCase().includes(filterValue)
      );

      setReturnDefinitions([...filtered]);
    } else {
      setReturnDefinitions(definitionsData);
    }
  };

  const initRawReturns = async () => {
    const getService = (value: number) => {
      if (value !== 0) {
        let params = { FILTER_RETURN_TYPE_ID: value };
        return getReturnDefinitions(params);
      } else {
        let params = { FILTER_LOAD_All: true };
        return getReturnDefinitions(params);
      }
    };
    const res = await getService(0);
    setReturnDefinitions([...res.data]);
    setOriginalReturnDefinitions([...res.data]);
    return res.data;
  };

  const getType = (returnTypes: ReturnType[]) => {
    let arr: any = [];
    returnTypes.forEach((item) => {
      const newReturnObj: any = {};
      newReturnObj.key = item.id;
      newReturnObj.code = item.code;
      newReturnObj.name = `${item.code} / ${item.name}`;
      newReturnObj.additional = item.count;
      arr.push(newReturnObj);
    });
    setReturnTypes(arr);
  };

  const initReturnDefinitions = async (initReturns: ReturnDefinitionType[]) => {
    setLoading(true);
    returnIds.current = initReturns.map((r) => r.id);

    let data = await initRawReturns();

    let arr: any = data.map((row: ReturnDefinitionType) => {
      return {
        ...row,
        userRoleReturnDefinition: initReturns.find(
          (item) => item.id === row.id
        )?.["userRoleReturnDefinition"],
      };
    });

    setReturnDefinitions(
      selectedReturnType.key === 0
        ? arr
        : arr.filter(
            (r: ReturnDefinitionType) =>
              r.returnType?.id === selectedReturnType.key
          )
    );
    setOriginalReturnDefinitions([...arr]);
    setLoading(false);

    setInheritedPermissions(
      arr.filter((item: ReturnDefinitionType) => item.userRoleReturnDefinition)
    );
  };

  const initReturnTypes = async () => {
    try {
      const res = await getReturnTypes();
      getType([
        { code: "All", id: 0, name: "All", count: null, key: 0 },
        ...res.data,
      ]);
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const setReturnIds = (perms: ReturnDefinitionType[]) => {
    returnIds.current = perms.map((p) => p.id);
  };

  const handleCheckChange = (row: ReturnDefinitionType, checked: boolean) => {
    if (checked) {
      returnIds.current.push(row.id);
      setCheckedReturnPermissions(returnIds.current);
      setCheckedReturns([...checkedReturns, row]);
    } else {
      returnIds.current = returnIds.current.filter((id) => id !== row.id);
      setCheckedReturnPermissions(returnIds.current);
      setCheckedReturns([...checkedReturns.filter((f) => f.id !== row.id)]);
    }
  };

  const handleAllCheckChange = (checked: boolean) => {
    if (!checked) {
      if (groupMode) {
        returnIds.current = [];
        setCheckedReturnPermissions([]);
        setCheckedReturns([]);
      } else {
        let arr = originalReturnDefinitions.filter(
          (item) => item.userRoleReturnDefinition
        );
        returnIds.current = arr.map((item) => item.id);
        setCheckedReturnPermissions(returnIds.current);
        setCheckedReturns(arr);
      }
    } else {
      returnIds.current = [
        ...returnIds.current,
        ...returnDefinitions.map((item) => item.id),
      ];
      setCheckedReturnPermissions(returnIds.current);
      setCheckedReturns(returnDefinitions);
    }
  };

  const setCheckedReturnPermissions = (returnIds: number[]) => {
    if (groupMode) {
      setData?.({
        returnDefintionIds: returnIds,
      });
    } else {
      const inheritedIds = inheritedPermissions.map((perm) => perm.id);
      const newArr = returnIds.filter((rId) => !inheritedIds.includes(rId));
      setData?.({
        returnIds: newArr,
      });
    }
  };

  const onFilterChange = (filterValue: string) => {
    let value = filterValue.toLowerCase();
    if (value && value.trim().length > 0) {
      if (selectedReturnType.key === 0) {
        filterReturnDefinitions(originalReturnDefinitions, value);
      } else {
        filterReturnDefinitions(
          originalReturnDefinitions.filter(
            (r) => r.returnType?.id === selectedReturnType.key
          ),
          value
        );
      }
      setFilter(value);
    } else {
      onFilterClear();
    }
  };

  const onFilterClear = () => {
    if (selectedReturnType.key === 0) {
      setReturnDefinitions(originalReturnDefinitions);
    } else {
      setReturnDefinitions(
        originalReturnDefinitions.filter(
          (r) => r.returnType?.id === selectedReturnType.key
        )
      );
    }
    setFilter("");
  };

  return (
    <UserReturns
      loading={loading}
      editMode={editMode}
      handleCheckChange={handleCheckChange}
      checkedReturns={[...inheritedPermissions, ...checkedReturns]}
      returnDefinitions={returnDefinitions}
      returnTypes={returnTypes}
      onReturnTypeSelectionChange={onReturnTypeSelectionChange}
      onFilterChange={onFilterChange}
      onFilterClear={onFilterClear}
      groupMode={groupMode}
      setLoading={setLoading}
      handleAllCheckChange={handleAllCheckChange}
      isSelectAllChecked={checkedReturns.length === returnDefinitions.length}
      isHalfChecked={
        checkedReturns.length < returnDefinitions.length &&
        checkedReturns.length > 0
      }
    />
  );
};

export default memo(UserManagerReturnsContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.RETURNS) {
    if (prevProps?.currData?.returnIds !== nextProps?.currData?.returnIds) {
      return false;
    }

    return (
      prevProps?.currData?.id === nextProps?.currData?.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
