/** Faqat autentifikatsiya kalitlari — boshqa localStorage ma’lumotlariga tegmaslik. */
export function clearAuthStorage(): void {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('userData');
  localStorage.removeItem('role');
}
