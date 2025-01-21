import { useState } from 'react';
import { Course } from 'modules/courses/types';
import { useCoursesList } from 'modules/courses/hooks/useCoursesList';
import { useDeleteCourse } from 'modules/courses/hooks/useDeleteCourse';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { TableActions } from 'components/TableActions';
import { AlertDialog } from 'components/AlertDialog';
import { Sheet } from 'components/Sheet';
import CourseForm from './CourseForm';
import { createCourseColumns } from './Columns';

const Courses = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [course, setCourse] = useState<Course>();

  const { data: coursesList, isLoading } = useCoursesList();
  const { triggerCourseDelete } = useDeleteCourse(course?.id!);

  const getRowData = (course: Course) => {
    setCourse(course);
  };

  
  const columns = createCourseColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Kurs qo'shish"
        sheetTitle="Yangi kurs qo'shish."
        TableForm={CourseForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={coursesList} navigateTable />
      )}

      <Sheet
        sheetTitle="Kursni tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <CourseForm course={course} setSheetOpen={setSheetOpen} />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerCourseDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default Courses;
