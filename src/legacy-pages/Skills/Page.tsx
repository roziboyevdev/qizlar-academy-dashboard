import { useState } from 'react';
import { DataTable } from 'components/DataTable';
import { TableActions } from 'components/TableActions';
import { Sheet } from 'components/Sheet';
import { AlertDialog } from 'components/AlertDialog';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import SkillForm from './SkillForm';
import { Skill } from 'modules/skills/types';
import { useSkillsList } from 'modules/skills/hooks/useSkillsList';
import { useDeleteSkill } from 'modules/skills/hooks/useDeleteSkill';
import { Pagination } from 'components/Pagination';
import { Badge } from 'components/ui/badge';
import { X, Sparkles } from 'lucide-react';

const SkillsPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill>();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: skillsData, isLoading } = useSkillsList(currentPage, 40);
  const { triggerSkillDelete, isPending: isDeletePending } = useDeleteSkill(selectedSkill?.id!);

  const handleDeleteClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  return (
    <div>
      <TableActions 
        sheetTriggerTitle="Skill qo'shish" 
        sheetTitle="Yangi Skill qo'shish" 
        TableForm={SkillForm} 
      />
      
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Mavjud Skillar
          </h2>
          <span className="text-sm text-muted-foreground">
            Jami: {skillsData?.paginationInfo?.count || 0} ta
          </span>
        </div>

        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-[2rem] p-8 transition-all duration-500 hover:border-border shadow-lg shadow-black/5 dark:shadow-black/20">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap gap-4 min-h-[100px] content-start">
                {skillsData?.data?.length ? (
                  skillsData.data.map((skill, index) => (
                    <div 
                      key={skill.id} 
                      className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Badge 
                        variant="secondary"
                        className="group pl-5 pr-2 py-2.5 text-sm bg-muted/50 hover:bg-muted dark:bg-white/[0.03] dark:hover:bg-white/[0.08] border-border hover:border-primary/40 rounded-2xl transition-all duration-300 gap-3 shadow-sm hover:shadow-md active:scale-95 select-none"
                      >
                        <span className="font-medium tracking-wide text-foreground/90 group-hover:text-foreground italic-none">
                          {skill.name}
                        </span>
                        <button 
                          onClick={() => handleDeleteClick(skill)}
                          className="p-1.5 rounded-xl bg-muted/80 group-hover:bg-destructive/10 text-muted-foreground group-hover:text-destructive transition-all duration-300 dark:bg-white/5"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full py-12 gap-3 text-muted-foreground/60 border-2 border-dashed border-border rounded-[1.5rem]">
                    <Sparkles className="size-8 opacity-20" />
                    <p className="text-sm font-medium">Hali hech qanday skill qo'shilmagan</p>
                  </div>
                )}
              </div>

              {skillsData?.paginationInfo && skillsData.paginationInfo.pageCount > 1 && (
                <div className="pt-6 border-t border-border">
                  <Pagination 
                    className="justify-end" 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    paginationInfo={skillsData?.paginationInfo} 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Sheet 
        sheetTitle="Skill tahrirlash" 
        isOpen={isSheetOpen} 
        setSheetOpen={setSheetOpen}
      >
        <SkillForm certificate={selectedSkill} setSheetOpen={setSheetOpen} />
      </Sheet>

      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Ushbu skillni butunlay o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerSkillDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default SkillsPage;
