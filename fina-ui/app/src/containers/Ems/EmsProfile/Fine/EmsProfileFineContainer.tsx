import { EmsFiProfileSanctionType } from "../../../../types/emsFiProfile.type";
import { EmsFineDataType } from "../../../../types/emsFineDataType";
import React, { useEffect, useState } from "react";
import EmsProfileFinePage from "../../../../components/EMS/EmsFiProfile/Fine/EmsProfileFinePage";
import {
  deleteSanctionFine,
  loadData as loadSanctionFines,
  saveSanctionFine,
  updateSanctionFine,
} from "../../../../api/services/ems/emsProfileSanctionFineService";
import { SanctionFineType } from "../../../../types/sanction.type";
import { loadSanctionFineType } from "../../../../api/services/ems/emsSanctionService";

interface EmsProfileFineContainerProps {
  selectedSanction?: EmsFiProfileSanctionType;
  fiCode: string;
  handleSanctionTotalSizeUpdate(sanctionId: number, totalPrice: number): void;
}

const EmsProfileFineContainer: React.FC<EmsProfileFineContainerProps> = ({
  selectedSanction,
  fiCode,
  handleSanctionTotalSizeUpdate,
}) => {
  const [data, setData] = useState<EmsFineDataType[]>([]);
  const [sanctionFineTypeData, setSanctionFineTypeData] = useState<
    SanctionFineType[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedSanction) {
      loadData();
      loadSanctionFineTypes();
    } else {
      setData([]);
    }
  }, [selectedSanction]);

  const loadData = () => {
    if (selectedSanction) {
      setLoading(true);
      loadSanctionFines(selectedSanction.id, 1, 0, 1000)
        .then((resp) => {
          setData([...resp.data.list]);
          const fineTypes = new Set();
          resp.data.list.forEach((item) => fineTypes.add(item.fineType.id));
        })
        .finally(() => setLoading(false));
    }
  };

  const loadSanctionFineTypes = () => {
    loadSanctionFineType(1, 1000, undefined, fiCode).then((resp) => {
      setSanctionFineTypeData([...resp.data.list]);
    });
  };

  const onDeleteClick = async (fine: EmsFineDataType) => {
    await deleteSanctionFine(fine.id);
    setData(data.filter((d) => d.id !== fine.id));
    if (selectedSanction && selectedSanction.totalPrice) {
      selectedSanction.totalPrice -=
        Number(fine.finePrice) * Number(fine.amount);
      handleSanctionTotalSizeUpdate(
        selectedSanction?.id,
        selectedSanction?.totalPrice
      );
    }
  };

  const onSaveClick = async (fine: EmsFineDataType) => {
    if (selectedSanction) {
      fine.sanctionId = selectedSanction.id;
    }
    if (fine.id && fine.id > 0) {
      await updateSanctionFine(fine, fine.id);

      const index = data.findIndex((d) => d.id === fine.id);
      data[index] = fine;
    } else {
      fine.id = 0;
      const result = (await saveSanctionFine(fine)).data;

      data.unshift(result.list[0]);
    }
    setData([...data]);
    if (selectedSanction) {
      selectedSanction.totalPrice +=
        Number(fine.finePrice) * Number(fine.amount);
      handleSanctionTotalSizeUpdate(
        selectedSanction.id,
        selectedSanction.totalPrice
      );
    }
  };

  return (
    <EmsProfileFinePage
      selectedSanction={selectedSanction}
      onDeleteClick={onDeleteClick}
      onSaveClick={onSaveClick}
      data={data}
      sanctionFineTypeData={sanctionFineTypeData}
      onRefreshClick={() => {
        loadData();
      }}
      loading={loading}
    />
  );
};

export default EmsProfileFineContainer;
