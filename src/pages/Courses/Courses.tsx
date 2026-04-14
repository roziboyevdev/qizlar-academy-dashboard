'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Course } from 'modules/courses/types';
import { useCoursesList } from 'modules/courses/hooks/useCoursesList';
import { useDeleteCourse } from 'modules/courses/hooks/useDeleteCourse';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { TableActions } from 'components/TableActions';
import { AlertDialog } from 'components/AlertDialog';
import { Sheet } from 'components/Sheet';
import CourseForm from './CourseForm';
import { createCourseColumns } from './Columns';
import { Pagination } from 'components/Pagination';
import { useEditCourse } from 'modules/courses/hooks/useEditCourse';
import { courseToEditPayload } from 'modules/courses/adapters';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import SelectWithoutForm, { type SelectOption } from 'components/fields/SelectWithoutForm';
import { useTeachersList } from 'modules/teachers/hooks/useList';

const Courses = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [course, setCourse] = useState<Course>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveFilter, setIsActiveFilter] = useState<'__all__' | 'true' | 'false'>('__all__');
  const [teacherFilter, setTeacherFilter] = useState<'__all__' | string>('__all__');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setSearch(searchInput.trim()), 450);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [isActiveFilter, teacherFilter, search]);

  const { data: coursesList, isLoading, paginationInfo } = useCoursesList({
    currentPage,
    isActive: isActiveFilter === '__all__' ? undefined : isActiveFilter === 'true',
    teacherId: teacherFilter === '__all__' ? undefined : teacherFilter,
    search,
  });



  const { triggerCourseEdit } = useEditCourse({
    setSheetOpen,
  });

  const toggleActive = (row: Course, isActive: boolean) => {
    triggerCourseEdit({ id: row.id, values: courseToEditPayload(row, { isActive }) });
  };

  const { triggerCourseDelete } = useDeleteCourse(course?.id!);

  const getRowData = (course: Course) => {
    setCourse(course);
  };




  const columns = createCourseColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
    currentPage,
    pageSize: paginationInfo?.pageSize ?? 10,
    toggleActive,
  });

  const { data: teachersList } = useTeachersList(1, 200);
  const teacherOptions = useMemo<SelectOption[]>(() => {
    return [
      { id: '__all__', name: 'Barcha ustozlar' },
      ...(teachersList ?? []).map((t) => ({ id: String(t.id), name: t.fullname })),
    ];
  }, [teachersList]);

  const activeOptions: SelectOption[] = useMemo(
    () => [
      { id: '__all__', name: 'Barchasi' },
      { id: 'true', name: 'Faol (true)' },
      { id: 'false', name: 'Faol emas (false)' },
    ],
    []
  );

  const clearAllFilters = () => {
    setIsActiveFilter('__all__');
    setTeacherFilter('__all__');
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <div>
      <TableActions hideSearch sheetTriggerTitle="Kurs qo'shish" sheetTitle="Yangi kurs qo'shish." TableForm={CourseForm} />
      <div className="rounded-xl border border-border/60 bg-card/40 p-3 shadow-sm mb-4">
        <p className="text-muted-foreground mb-2 text-sm font-medium">Filtrlar</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2 md:gap-3">
            <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
              <span className="text-muted-foreground mb-1 block text-xs">isActive</span>
              <SelectWithoutForm
                data={activeOptions}
                placeholder="Holat..."
                value={isActiveFilter}
                onChange={(v) => setIsActiveFilter(v as any)}
              />
            </div>
            <div className="min-w-[220px] flex-1 sm:max-w-[320px]">
              <span className="text-muted-foreground mb-1 block text-xs">teacherId</span>
              <SelectWithoutForm
                data={teacherOptions}
                placeholder="Ustoz..."
                value={teacherFilter}
                onChange={(v) => setTeacherFilter(v)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2 md:gap-3">
            <div className="flex min-w-[240px] max-w-xl flex-1 flex-col gap-1">
              <span className="text-muted-foreground text-xs">search (kurs nomi bo‘yicha)</span>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="min-w-[180px] flex-1"
                  placeholder="Qidirish..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearch(searchInput.trim());
                      setCurrentPage(1);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch(searchInput.trim());
                    setCurrentPage(1);
                  }}
                >
                  Qidirish
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-border/50 pt-2">
            <Button type="button" variant="outline" onClick={clearAllFilters}>
              Barcha filtrlarni tozalash
            </Button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={coursesList}
            navigateTable
            customNavigationUrl={(row) => {
              const baseUrl = `/courses/${row.id}`;
              const params = new URLSearchParams();
              params.append('type', row.pricingType);
              return `${baseUrl}?${params.toString()}`;
            }}
          />
          {paginationInfo && (
            <Pagination
              className="justify-end mt-3"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              paginationInfo={paginationInfo}
            />
          )}
        </>
      )}

      <Sheet sheetTitle="Kursni tahrirlash" isOpen={isSheetOpen} setSheetOpen={setSheetOpen}>
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
