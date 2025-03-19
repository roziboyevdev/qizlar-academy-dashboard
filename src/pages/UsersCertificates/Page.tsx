import { useState } from 'react';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import { Pagination } from 'components/Pagination';
import { useUserCertificateList } from 'modules/user-certificate/hooks/useList';
import { IUserCertificate } from 'modules/user-certificate/types';
import { useCoursesList } from 'modules/courses/hooks/useCoursesList';

const UsersCertificatesPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<IUserCertificate>();
  const [currentPage, setCurrentPage] = useState(1);
  const [course, setCourse] = useState('');

  const { data: categories, isLoading, pagenationInfo } = useUserCertificateList(currentPage);
  const { data: coursesList } = useCoursesList({ isEnabled: !!categories,});

  const getRowData = (info: IUserCertificate) => {
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
          <Pagination className="justify-end mt-3" currentPage={currentPage} setCurrentPage={setCurrentPage} paginationInfo={pagenationInfo} />
        </>
      )}
    </div>
  );
};

export default UsersCertificatesPage;
