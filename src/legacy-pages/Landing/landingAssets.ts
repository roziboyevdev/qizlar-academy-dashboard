/**
 * AeroTeach / landing rasmlari.
 * Hero va trust rasmlari: Figma Frame 1 (node 43:41) — @2x JPEG `/public/lending_images/`.
 * @see https://www.figma.com/design/xiSAea3yCaDNnwuS65G3k6/AeroTeach?node-id=43-41
 *
 * Qolgan ikonalar/sotsial SVG — `/public/assets/landing/`.
 */

const AEROTEACH_FRAME_IMAGE_COUNT = 37;

const aeroteachImagePath = (index1Based: number) =>
  `/lending_images/aeroteach-${String(index1Based).padStart(2, '0')}.jpg`;

const aeroteachHeroSlides = Array.from({ length: AEROTEACH_FRAME_IMAGE_COUNT }, (_, i) =>
  aeroteachImagePath(i + 1),
);

export const LANDING_ASSETS = {
  heroMain: aeroteachImagePath(1),
  heroSlides: aeroteachHeroSlides,
  trustStudents: [
    aeroteachImagePath(1),
    aeroteachImagePath(2),
    aeroteachImagePath(3),
    aeroteachImagePath(4),
    aeroteachImagePath(5),
  ],
  statsDivider: '/assets/landing/stats-divider.png',
  iconArrowRight: '/assets/landing/icon-arrow-right.svg',
  iconArrowSmall: '/assets/landing/icon-arrow-small.svg',
  iconCourseIt: '/assets/landing/icon-course-it.svg',
  iconCourseBusiness: '/assets/landing/icon-course-business.svg',
  iconCourseCraft: '/assets/landing/icon-course-craft.svg',
  iconCourseHealth: '/assets/landing/icon-course-health.svg',
  teamHeadingIcon: '/assets/landing/team-heading-icon.svg',
  socialYoutube: '/assets/landing/social-youtube.png',
  socialInstagram: '/assets/landing/social-instagram.png',
  socialTelegram: '/assets/landing/social-telegram.png',
  socialLinkedin: '/assets/landing/social-linkedin.png',
  ctaArrow: '/assets/landing/cta-arrow.svg',
} as const;
