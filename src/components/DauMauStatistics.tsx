import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Calendar, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import http from 'services/api';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const months = [
  { value: '1', label: 'Yanvar' },
  { value: '2', label: 'Fevral' },
  { value: '3', label: 'Mart' },
  { value: '4', label: 'Aprel' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Iyun' },
  { value: '7', label: 'Iyul' },
  { value: '8', label: 'Avgust' },
  { value: '9', label: 'Sentabr' },
  { value: '10', label: 'Oktabr' },
  { value: '11', label: 'Noyabr' },
  { value: '12', label: 'Dekabr' },
];

const MonthlyStatsDownloader = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Hozirgi oyni default qilib qo'yish
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() 0-11 qaytaradi, shuning uchun +1
    setSelectedMonth(currentMonth.toString());
  }, []);

  const handleDownload = async () => {
    if (!selectedMonth) {
      alert('Iltimos, oyni tanlang!');
      return;
    }

    setIsDownloading(true);

    try {
      const response = await http.get(`/statistics/dau/mau/${selectedMonth}`, {
        responseType: 'blob', // Excel fayl uchun blob response type
        headers: {
          'Content-Type': 'application/json',
          // Agar autentifikatsiya kerak bo'lsa, bu yerda token qo'shing
          // 'Authorization': `Bearer ${your_token}`
        },
      });

      // Excel fayl uchun blob yaratish
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistika-${selectedMonth}-oy.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Fayl muvaffaqiyatli yuklab olindi!');
    } catch (error: unknown) {
      console.error('Download error:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          toast.error("Ruxsat yo'q! Iltimos, tizimga kiring.");
        } else if (error.response?.status === 404) {
          toast.error("Ma'lumot topilmadi. Iltimos, boshqa oy tanlang.");
        } else if (error.response?.status) {
          toast.error(`Xatolik yuz berdi (${error.response.status}). Iltimos, qayta urinib ko'ring.`);
        } else if (error.request) {
          toast.error("Server bilan bog'lanishda muammo. Iltimos, internet ulanishingizni tekshiring.");
        } else {
          toast.error("So'rov yuborishda xatolik. Iltimos, qayta urinib ko'ring.");
        }
      } else {
        toast.error("Kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className='flex gap-1'>
          <Calendar className="size-5" />
          <CardTitle className="text-sm font-medium">Dau / Mau (oy bo'yicha yuklab olish)</CardTitle>
        </div>
        <div className="space-y-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month-select">
              <SelectValue placeholder="Oyni tanlang..." />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleDownload} disabled={!selectedMonth || isDownloading} className="w-full">
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Yuklab olinmoqda...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Yuklab olish
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MonthlyStatsDownloader;