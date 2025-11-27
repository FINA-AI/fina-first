import FITreeGrid from "../../components/FI/FITreeGrid";
import React, { FC, useEffect, useState } from "react";
import { loadFiTree } from "../../api/services/fi/fiService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import PropTypes from "prop-types";
import { FiType } from "../../types/fi.type";

interface ScheduleFiContainerProps {
  onNewScheduleChange: (key: string, value: any) => void;
  data?: FiType[];
}

const ScheduleFiContainer: FC<ScheduleFiContainerProps> = ({
  onNewScheduleChange,
  data,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [checkedFis, setCheckedFis] = useState<FiType[]>([]);
  const [fis, setFis] = useState<FiType[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setFis([...data]);
    } else {
      loadFiTypesFunction();
    }
  }, [data]);

  const loadFiTypesFunction = () => {
    loadFiTree()
      .then((res) => {
        setFis(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onCheck = (val: FiType[] | null) => {
    if (val) {
      setCheckedFis(val);
      onNewScheduleChange(
        "fis",
        val.map((fi) => fi.id)
      );
    }
  };

  return (
    <FITreeGrid
      onChange={onCheck}
      checkedRows={checkedFis}
      backgroundColor={"#F9F9F9"}
      data={fis}
      size={"small"}
    />
  );
};

ScheduleFiContainer.propTypes = {
  data: PropTypes.any,
  onNewScheduleChange: PropTypes.func.isRequired,
};

export default ScheduleFiContainer;
