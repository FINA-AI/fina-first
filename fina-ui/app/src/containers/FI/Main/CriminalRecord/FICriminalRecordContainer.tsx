import FICriminalRecordMainPage from "../../../../components/FI/Main/Detail/CriminalRecord/FICriminalRecordMainPage";
import React, { useEffect, useState } from "react";
import {
  addCriminalRecord,
  deleteCriminalRecord,
  editCriminalRecord,
  loadCriminalRecords,
} from "../../../../api/services/fi/fiCriminalRecordService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { CriminalRecordDataType, FiDataType } from "../../../../types/fi.type";

interface FICriminalRecordContainerProps {
  fi: FiDataType;
  fiId: number;
  tabName: string;
}

const FICriminalRecordContainer: React.FC<FICriminalRecordContainerProps> = ({
  fi,
  fiId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [criminalRecords, setCriminalRecords] = useState<
    CriminalRecordDataType[]
  >([]);
  const [editMode, setEditMode] = useState<{ editable: number | null }>({
    editable: null,
  });

  const getCriminalRecords = (id: number) => {
    setLoading(true);
    loadCriminalRecords(id)
      .then((res) => {
        const data = res.data as CriminalRecordDataType[];
        if (data) {
          setCriminalRecords(data.sort((x, y) => y.id - x.id));
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!!fi) getCriminalRecords(fi?.id);
  }, [fi]);

  const addNewCriminalRecord = async (
    criminalRecord: CriminalRecordDataType
  ) => {
    setLoading(true);
    await addCriminalRecord(fi?.id, criminalRecord)
      .then((resp) => {
        setCriminalRecords([resp.data, ...criminalRecords]);
        enqueueSnackbar(t("recordCreated"), { variant: "success" });
      })
      .catch((err) => openErrorWindow(err, t("error"), true))
      .finally(() => setLoading(false));
  };

  const onEdit = async (criminalRecord: CriminalRecordDataType) => {
    setEditMode({ editable: null });

    await editCriminalRecord(fi?.id, criminalRecord)
      .then((resp) => {
        setCriminalRecords(
          criminalRecords.map((item) =>
            item.id === resp.data.id ? resp.data : item
          )
        );
        enqueueSnackbar(t("recordEdited"), { variant: "success" });
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  const onDelete = async (recordId: number) => {
    await deleteCriminalRecord(fi?.id, recordId)
      .then(() => {
        setCriminalRecords(
          criminalRecords.filter((row) => row.id !== recordId)
        );
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <FICriminalRecordMainPage
      loading={loading}
      criminalRecords={criminalRecords}
      editMode={editMode}
      setEditMode={setEditMode}
      onAdd={addNewCriminalRecord}
      onEdit={onEdit}
      onDelete={onDelete}
      fiId={fiId}
    />
  );
};

const reducer = "fi";
const mapStateToProps = (state: any) => ({
  fi: state.getIn([reducer, "fi"]),
});

export default connect(mapStateToProps)(FICriminalRecordContainer);
