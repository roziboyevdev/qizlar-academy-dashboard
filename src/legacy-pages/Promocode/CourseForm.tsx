'use client';

import { useState } from 'react';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Button } from 'components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCreatePromocode } from 'modules/promocode/hooks/useCreate';

interface IProps {
  setSheetOpen: (state: boolean) => void;
}

export default function CourseForm({ setSheetOpen }: IProps) {
  const [productId, setProductId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { triggerVacancyCreate, isPending } = useCreatePromocode({ setSheetOpen });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId.trim() || !file) return;
    triggerVacancyCreate({ productId: productId.trim(), file });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="pid">Mahsulot ID (UUID)</Label>
        <Input
          id="pid"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Masalan: clx..."
          required
        />
      </div>
      <div>
        <Label htmlFor="excel">Excel fayl</Label>
        <Input id="excel" type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <Button type="submit" disabled={isPending || !file || !productId.trim()}>
        {isPending ? <Loader2 className="animate-spin size-4" /> : 'Yuklash'}
      </Button>
    </form>
  );
}
