import AboutPage from "../../components/About/AboutPage";
import React, { memo, useEffect, useState } from "react";
import { loadAboutData } from "../../api/services/AboutService";
import { useTranslation } from "react-i18next";
import { GridColumnType } from "../../types/common.type";

export interface VersionDataProps {
  id: number;
  key: string;
  value: string;
}

const AboutContainer = () => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [data, setData] = useState<VersionDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
    setColumns(columnHeader);
  }, []);

  const columnHeader: GridColumnType[] = [
    {
      field: "key",
      headerName: t("software"),
      hideCopy: true,
      renderCell: (value: any) => {
        let tmp = value.split(/(?=[A-Z])/).join(" ");
        return <p style={{ textTransform: "capitalize", margin: 0 }}> {tmp}</p>;
      },
    },
    {
      field: "value",
      headerName: t("version"),
      renderCell: (value: string, row: VersionDataProps) => {
        if (
          (row.key === "configVersion" || row.key === "aooVersion") &&
          value?.length > 10
        ) {
          return (
            <span
              style={{
                color: "#eb6464",
              }}
            >
              {value}
            </span>
          );
        }
        return value;
      },
    },
  ];
  const init = () => {
    setLoading(true);
    loadAboutData().then((res) => {
      setData(
        Object.entries<string>(res.data).map(([key, value], index) => ({
          id: index + 1,
          key,
          value,
        }))
      );
      setLoading(false);
    });
  };

  return (
    <AboutPage
      columns={columns}
      data={data}
      loading={loading}
      setData={setData}
    />
  );
};

export default memo(AboutContainer);
