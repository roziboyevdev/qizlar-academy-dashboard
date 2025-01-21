import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Quiz } from 'modules/quizzes/types';
import { useQuizzesList } from 'modules/quizzes/hooks/useQuizzesList';
import { useDeleteQuiz } from 'modules/quizzes/hooks/useDeleteQuiz';

import { Sheet } from 'components/Sheet';
import { AlertDialog } from 'components/AlertDialog';
import { DataTable } from 'components/DataTable';
import { TableActions } from 'components/TableActions';
import Loader from 'components/Loader';
import QuizForm from './QuizForm';
import { createQuizColumns } from './Columns';

const Quizzes = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [quiz, setQuiz] = useState<Quiz>();

  const { lessonId } = useParams();
  const { data: quizzesList, isLoading } = useQuizzesList(lessonId!);
  const { triggerQuizDelete } = useDeleteQuiz(quiz?.id!);

  const getRowData = (quiz: Quiz) => {
    setQuiz(quiz);
  };

  const columns = createQuizColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Quiz qo'shish"
        sheetTitle="Yangi quiz qo'shish."
        TableForm={QuizForm}
        isAddButtonHidden={quizzesList.length >= 5}
        // # limit for questions || quizs
      />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={quizzesList} />
      )}

      <Sheet
        sheetTitle="Yangi quiz yaratish"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <QuizForm quiz={quiz} setSheetOpen={setSheetOpen} />
      </Sheet>

      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerQuizDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default Quizzes;
