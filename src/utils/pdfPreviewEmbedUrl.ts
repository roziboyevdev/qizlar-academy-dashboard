/**
 * PDF ni iframe / yangi tabda ochishda yon panel (thumbnails, outline) va asboblar panelini
 * yashirishga urinadi. PDF Open Parameters (Adobe) — Chrome / Edge / Firefox da qisman ishlaydi,
 * ba’zi brauzer yoki server sozlamalarida panel yana ko‘rinishi mumkin.
 */
export function pdfPreviewEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;

  const isPdf =
    /\.pdf(\?|#|$)/i.test(rawUrl) ||
    rawUrl.toLowerCase().includes('application%2fpdf') ||
    rawUrl.toLowerCase().includes('application/pdf');

  if (!isPdf) return rawUrl;

  /** `pagemode=UseNone` — ochilganda bookmark/thumbnail rejimi yoqilmasin (Adobe PDF param). */
  const extra = 'toolbar=0&navpanes=0&pagemode=UseNone';
  const hashIdx = rawUrl.indexOf('#');
  if (hashIdx === -1) {
    return `${rawUrl}#${extra}`;
  }

  const base = rawUrl.slice(0, hashIdx);
  const hash = rawUrl.slice(hashIdx + 1);
  if (/navpanes\s*=|toolbar\s*=/i.test(hash)) {
    return rawUrl;
  }

  const join = hash.length > 0 ? `${hash}&` : '';
  return `${base}#${join}${extra}`;
}
