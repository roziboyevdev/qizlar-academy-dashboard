import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import { Pagination } from 'components/Pagination';
import { useUserCertificateList } from 'modules/user-certificate/hooks/useList';
import type {
  CertificateMedalType,
  CertificateUserListFilters,
  UserCallStatus,
} from 'modules/user-certificate/types';
import { useCoursesList } from 'modules/courses/hooks/useCoursesList';
import regions from '../../db/regions.json';
import districtData from '../../db/districts.json';
import SelectWithoutForm, { type SelectOption } from 'components/fields/SelectWithoutForm';
import http from 'services/api';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { pdfPreviewEmbedUrl } from 'utils/pdfPreviewEmbedUrl';
import { DateRangePicker } from 'components/DataRangePicker';

export type CustomSelectType = SelectOption;

/** Hech qanday qator filtri — API ga yuborilmaydi */
const FILTER_ALL = '__all__';

const CERT_TYPE_OPTIONS: SelectOption[] = [
  { id: FILTER_ALL, name: 'Barcha turlar' },
  { id: 'GOLD', name: 'Oltin' },
  { id: 'SILVER', name: 'Kumush' },
  { id: 'BRONZE', name: 'Bronza' },
];

const USER_STATUS_OPTIONS: SelectOption[] = [
  { id: FILTER_ALL, name: 'Barcha holatlar' },
  { id: 'NOT_CALLED', name: 'Qo‘ng‘iroq qilinmagan' },
  { id: 'CALLED_NO_ANSWER', name: 'Javobsiz' },
  { id: 'TALKED', name: 'Suhbatlashilgan' },
];

const UsersCertificatesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [course, setCourse] = useState(FILTER_ALL);
  const [region, setRegion] = useState(FILTER_ALL);
  const [district, setDistrict] = useState(FILTER_ALL);
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [certType, setCertType] = useState(FILTER_ALL);
  const [userStatus, setUserStatus] = useState(FILTER_ALL);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [neighborhoodInput, setNeighborhoodInput] = useState('');

  const neighborhoodIdNum = useMemo(() => {
    const t = neighborhoodInput.trim();
    if (!t) return undefined;
    const n = Number(t);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [neighborhoodInput]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 450);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const listFilters = useMemo((): CertificateUserListFilters => {
    const f: CertificateUserListFilters = {};
    if (search) f.search = search;
    if (certType === 'GOLD' || certType === 'SILVER' || certType === 'BRONZE') {
      f.type = certType as CertificateMedalType;
    }
    if (userStatus === 'NOT_CALLED' || userStatus === 'CALLED_NO_ANSWER' || userStatus === 'TALKED') {
      f.status = userStatus as UserCallStatus;
    }
    if (dateRange?.from) {
      f.startDate = format(dateRange.from, 'yyyy-MM-dd');
      f.endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(dateRange.from, 'yyyy-MM-dd');
    }
    if (neighborhoodIdNum !== undefined) f.neighborhoodId = neighborhoodIdNum;
    return f;
  }, [search, certType, userStatus, dateRange, neighborhoodIdNum]);

  const { data: categories, isLoading, pagenationInfo, totalCountKnown } = useUserCertificateList(
    currentPage,
    course === FILTER_ALL ? undefined : course,
    region === FILTER_ALL ? undefined : region,
    district === FILTER_ALL ? undefined : district,
    listFilters
  );

  const { data: coursesList } = useCoursesList({ isEnabled: true });

  const courseOptions = useMemo<SelectOption[]>(() => {
    return [
      { id: FILTER_ALL, name: 'Barcha kurslar' },
      ...(coursesList ?? []).map((el) => ({
        name: el.title,
        id: String(el.id),
      })),
    ];
  }, [coursesList]);

  const regionOptions = useMemo<SelectOption[]>(() => {
    return [
      { id: FILTER_ALL, name: 'Barcha viloyatlar' },
      ...regions.map((r) => ({ id: String(r.id), name: r.name })),
    ];
  }, []);

  const districtOptions = useMemo<SelectOption[]>(() => {
    const allRow = { id: FILTER_ALL, name: 'Barcha tuman/shahar' };
    if (!region || region === FILTER_ALL) return [allRow];
    const reg = regions.find((r) => String(r.id) === region);
    const name = reg?.name;
    const filtered = name ? districtData.filter((c) => c.region_name === name) : [];
    return [allRow, ...filtered.map((c) => ({ id: String(c.id), name: c.name }))];
  }, [region]);

  useEffect(() => {
    setDistrict(FILTER_ALL);
  }, [region]);

  useEffect(() => {
    setCurrentPage(1);
  }, [course, region, district, certType, userStatus, listFilters]);

  const columns = createDataColumns({
    currentPage,
    onPreviewCertificate: (url) => setCertificatePreviewUrl(url || null),
  });

  const flushSearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setCourse(FILTER_ALL);
    setRegion(FILTER_ALL);
    setDistrict(FILTER_ALL);
    setCertType(FILTER_ALL);
    setUserStatus(FILTER_ALL);
    setDateRange(undefined);
    setNeighborhoodInput('');
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  async function handleDownload(apiUrl: string) {
    try {
      const response = await http.get(`/statistics/certificate/by/${apiUrl}`, { responseType: 'blob' });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const date = new Date().toISOString().split('T')[0];

      link.setAttribute('download', `users-data-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Aniqlanmagan xatolik yuz berdi!');
    }
  }

  const previewIsImage = certificatePreviewUrl
    ? /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(certificatePreviewUrl)
    : false;

  const pdfEmbedSrc =
    certificatePreviewUrl && !previewIsImage ? pdfPreviewEmbedUrl(certificatePreviewUrl) : certificatePreviewUrl;

  const countLabel =
    totalCountKnown && pagenationInfo?.count != null ? (
      <>Jami {pagenationInfo.count} ta</>
    ) : (
      <>
        Ko‘rsatilmoqda: {categories?.length ?? 0} ta
        {pagenationInfo?.pageCount != null && currentPage < pagenationInfo.pageCount ? ' (yana mavjud bo‘lishi mumkin)' : null}
      </>
    );

  return (
    <div>
      <Dialog open={Boolean(certificatePreviewUrl)} onOpenChange={(open) => !open && setCertificatePreviewUrl(null)}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="border-b px-4 py-3 text-left">
            <DialogTitle>Sertifikat</DialogTitle>
            <DialogDescription className="sr-only">Sertifikat faylini oldindan ko‘rish</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 p-4">
            {certificatePreviewUrl && previewIsImage ? (
              <div className="flex max-h-[75vh] justify-center overflow-auto rounded-md border bg-muted/30 p-2">
                <img
                  src={certificatePreviewUrl}
                  alt="Sertifikat"
                  className="max-h-[72vh] w-auto max-w-full object-contain"
                />
              </div>
            ) : certificatePreviewUrl ? (
              <div className="h-[min(75vh,720px)] w-full overflow-hidden rounded-md border bg-muted/20">
                <iframe
                  title="Sertifikat preview"
                  src={pdfEmbedSrc || certificatePreviewUrl}
                  className="h-full min-h-[480px] w-full border-0"
                />
              </div>
            ) : null}
            {certificatePreviewUrl ? (
              <div className="flex flex-wrap gap-2 border-t pt-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={pdfEmbedSrc || certificatePreviewUrl} target="_blank" rel="noopener noreferrer">
                    Yangi tabda ochish
                  </a>
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="text-2xl font-bold text-center mb-2">Sertifikat olgan talabalar</h1>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <h2 className="text-base font-medium w-full md:w-auto">{countLabel}</h2>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-3 shadow-sm">
          <p className="text-muted-foreground mb-2 text-sm font-medium">Filtrlar (Swagger parametrlari)</p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-2 md:gap-3">
              <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
                <span className="text-muted-foreground mb-1 block text-xs">Kurs</span>
                <SelectWithoutForm
                  data={courseOptions}
                  placeholder="Kurs..."
                  value={course}
                  onChange={(v) => setCourse(v)}
                />
              </div>
              <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
                <span className="text-muted-foreground mb-1 block text-xs">Viloyat</span>
                <SelectWithoutForm
                  data={regionOptions}
                  placeholder="Viloyat..."
                  value={region}
                  onChange={(v) => setRegion(v)}
                />
              </div>
              <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
                <span className="text-muted-foreground mb-1 block text-xs">Tuman / shahar</span>
                <SelectWithoutForm
                  data={districtOptions}
                  placeholder="Tuman..."
                  value={district}
                  onChange={(v) => setDistrict(v)}
                />
              </div>
              <div className="min-w-[160px] flex-1 sm:max-w-[200px]">
                <span className="text-muted-foreground mb-1 block text-xs">Sertifikat turi</span>
                <SelectWithoutForm
                  data={CERT_TYPE_OPTIONS}
                  placeholder="Tur..."
                  value={certType}
                  onChange={(v) => setCertType(v)}
                />
              </div>
              <div className="min-w-[180px] flex-1 sm:max-w-[240px]">
                <span className="text-muted-foreground mb-1 block text-xs">Talaba holati (status)</span>
                <SelectWithoutForm
                  data={USER_STATUS_OPTIONS}
                  placeholder="Holat..."
                  value={userStatus}
                  onChange={(v) => setUserStatus(v)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-2 md:gap-3">
              <div>
                <span className="text-muted-foreground mb-1 block text-xs">Berilgan sana oralig‘i</span>
                <DateRangePicker date={dateRange} setDate={setDateRange} />
              </div>
              <Button type="button" variant="outline" size="sm" className="h-10 shrink-0" onClick={() => setDateRange(undefined)}>
                Barcha sanalar
              </Button>
              <div className="min-w-[140px] max-w-[200px]">
                <span className="text-muted-foreground mb-1 block text-xs">Mahalla ID</span>
                <Input
                  inputMode="numeric"
                  placeholder="ixtiyoriy"
                  value={neighborhoodInput}
                  onChange={(e) => setNeighborhoodInput(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div className="flex min-w-[220px] max-w-xl flex-1 flex-col gap-1">
                <span className="text-muted-foreground text-xs">Qidiruv (ism, telefon yoki email)</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    className="min-w-[180px] flex-1"
                    placeholder="Yozing… (450 ms dan keyin avtomatik)"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') flushSearch();
                    }}
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={flushSearch}>
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

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button onClick={() => handleDownload('users')}>Yuklab olish (userlar)</Button>
          <Button onClick={() => handleDownload('region')}>Yuklab olish (viloyatlar)</Button>
        </div>
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
