/**
 * Bitiruvchilar fikr va natijalari — YouTube pleylistidagi barcha videolar.
 * Playlist: https://www.youtube.com/playlist?list=PL50GpPWEeykMiTFRdidGSf_y-RjudkDX1
 *
 * Pleylistga yangi video qo‘shilsa: `yt-dlp --flat-playlist --print "%(id)s\t%(title)s" "<playlist-url>"`
 */
export const LANDING_TESTIMONIAL_VIDEOS = [
  {
    youtubeId: 'uetmqdpZoxE',
    title: 'Muvaffaqiyatli qizlarimizdan eng chiroyli fikrlar',
  },
  {
    youtubeId: 'l8ipYXyLKQ8',
    title: "Ilovamiz orqali oddiy uy bekalikdan tadbirkorlikkacha yetgan bitiruvchimiz",
  },
  {
    youtubeId: 't2rDozqZEzM',
    title: 'Kurslarimizni bitirib, shaxsiy brendiga asos solgan foydalanuvchimiz',
  },
  {
    youtubeId: 'e-Fyv4na8JA',
    title: 'Kurslarimiz orqali shaxsiy rivojlanishga erishgan bitiruvchimiz',
  },
  {
    youtubeId: 'djpiz9M8Awg',
    title: '15 tadan ortiq kurslar bitiruvchisi',
  },
] as const;
