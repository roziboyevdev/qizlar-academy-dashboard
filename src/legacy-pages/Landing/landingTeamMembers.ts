/**
 * Landring «Jamoa» bo‘limi ma’lumotlari.
 * Rasmlar: `public/assets/landing/staff/`
 * Navbat: qiz, bola — `orderTeamAlternatingGender` (rasmdagi tartib bilan mos).
 */

export type TeamGender = 'male' | 'female';

export type LandingTeamMember = {
  id: string;
  name: string;
  role: string;
  gender: TeamGender;
  /** `public/assets/landing/staff/` ichidagi fayl nomi. */
  imageFile: string;
};

export const LANDING_TEAM_STAFF_DIR = '/assets/landing/staff' as const;

export function landingTeamMemberImageSrc(member: LandingTeamMember): string {
  return `${LANDING_TEAM_STAFF_DIR}/${encodeURIComponent(member.imageFile)}`;
}

/**
 * Tartib: rasmdagi chapdan o‘ngga (1→10). `orderTeamAlternatingGender` lentada f,m,f,m… qiladi.
 */
export const LANDING_TEAM_MEMBERS: LandingTeamMember[] = [
  {
    id: 'marjona-joraqulova',
    gender: 'female',
    name: 'Marjona Jo‘raqulova',
    role: 'Loyiha koordinatori',
    imageFile: 'Marjona Jo\u2018raqulova.png',
  },
  {
    id: 'raximjon-toshpolatov',
    gender: 'male',
    name: 'Raximjon Toshpo‘latov',
    role: 'Loyihaning moliyaviy tahlili va HR menejeri',
    imageFile: 'Rahimjon Tohirovich.png',
  },
  {
    id: 'madinabonu-abbosova',
    gender: 'female',
    name: 'Madinabonu Abbosova',
    role: 'Loyiha tadbirlarini tashkil etish menejeri',
    imageFile: 'Madinabonu Abbosova.png',
  },
  {
    id: 'islom-kamolov',
    gender: 'male',
    name: 'Islom Kamolov',
    role: 'Loyihaning mobil ilova bosh dasturchisi',
    imageFile: 'Islom Kamolov.png',
  },
  {
    id: 'behruza-solijonova',
    gender: 'female',
    name: 'Behruza Solijonova',
    role:
      "O‘quvchilar dasturlari va tadbirlarini boshqarish bo‘yicha mas'ul kotibi",
    imageFile: 'Behruza Solijonova.png',
  },
  {
    id: 'nursultan-suleymanov',
    gender: 'male',
    name: 'Nursultan Suleymanov',
    role: 'Loyihaning mobil ilova dizayneri',
    imageFile: 'Nursultan Suleymanov.png',
  },
  {
    id: 'yulduz-ergasheva',
    gender: 'female',
    name: 'Yulduz Ergasheva',
    role: 'Bitiruvchilar bilan ishlash menejeri',
    imageFile: 'Yulduz Ergasheva.png',
  },
  {
    id: 'abubakr-roziboyev',
    gender: 'male',
    name: 'Abubakr Ro‘ziboyev',
    role: 'Loyihaning Flutter Developer mutaxassisi',
    imageFile: 'Abubakr Ro\u2018ziboyev.png',
  },
  {
    id: 'gulgina-raxmatullayeva',
    gender: 'female',
    name: 'Gulgina Raxmatullayeva',
    role: 'Loyihaning videodarsliklar montaji',
    imageFile: 'Gulgina Raxmatullayeva.png',
  },
  {
    id: 'abdulaziz-akbarov',
    gender: 'male',
    name: 'Abdulaziz Akbarov',
    role: 'Loyihaning mobil ilova backend',
    imageFile: 'Abdulaziz Akbarov.png',
  },
];

/** Ayol va erkak almashinib: f₀, m₀, f₁, m₁, … (rasmdagi horizontal tartib). */
export function orderTeamAlternatingGender(members: LandingTeamMember[]): LandingTeamMember[] {
  const males = members.filter((m) => m.gender === 'male');
  const females = members.filter((m) => m.gender === 'female');
  const out: LandingTeamMember[] = [];
  const n = Math.max(males.length, females.length);
  for (let i = 0; i < n; i += 1) {
    if (females[i]) out.push(females[i]);
    if (males[i]) out.push(males[i]);
  }
  return out;
}
