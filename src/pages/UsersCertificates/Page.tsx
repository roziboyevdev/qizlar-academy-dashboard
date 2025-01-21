import { useState } from "react";
import { DataTable } from "components/DataTable";
import Loader from "components/Loader";
import { createDataColumns } from "./Columns";
import { Donation } from "modules/donation/types";
import { Pagination } from "components/Pagination";
import { useUserCertificateList } from "modules/user-certificate/hooks/useList";
import { UserCertificate } from "modules/user-certificate/types";

const UsersCertificatesPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<UserCertificate>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categories,
    isLoading,
    pagenationInfo,
  } = useUserCertificateList(currentPage);

  const getRowData = (info: UserCertificate) => {
    setData(info);
  };

  // demo
  const columns = createDataColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
    currentPage,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Jami {pagenationInfo?.total_records || 0} ta </h2>
        <h1 className="text-2xl font-bold">Sertifikat olgan talabalar</h1>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={categories} />
          <Pagination
            className="justify-end mt-3"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationInfo={pagenationInfo}
          />
        </>
      )}
    </div>
  );
};

export default UsersCertificatesPage;
