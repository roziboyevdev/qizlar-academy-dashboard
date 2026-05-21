import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Award, Clock, GraduationCap, MessageCircle, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Seo } from 'components/Seo';
import { getSiteUrl } from 'config/site';
import './landing.css';

import { useMotionProfile } from './components/useMotionProfile';
import { FadeUp, ScaleIn, RotateIn, StaggerGroup, motionVariants, ParallaxLayer } from './components/MotionPrimitives';
import { FloatingOrnamentLayer } from './components/FemmeOrnaments';
import { LANDING_ASSETS } from './landingAssets';
import { LANDING_TESTIMONIAL_VIDEOS } from './landingTestimonialVideos';
import { TestimonialYoutubeEmbed } from './components/TestimonialYoutubeEmbed';
import {
  LANDING_TEAM_MEMBERS,
  landingTeamMemberImageSrc,
  orderTeamAlternatingGender,
} from './landingTeamMembers';
import { formatLandingStatInt, useLandingStats } from './hooks/useLandingStats';

const APP_LINK = 'https://onelink.to/4h9hr9';
const CUSTOM_SCHEME = 'qizlaracademy';

const DEEP_LINK_PATTERNS = [
  /^\/courses\/[^/]+(\/player|\/review)?$/,
  /^\/lesson-quiz\/[^/]+$/,
  /^\/vacancies(\/[^/]+)?$/,
  /^\/register$/,
  /^\/sign-in$/,
  /^\/notification$/,
  /^\/my-courses$/,
  /^\/my-certificates$/,
];

function isDeepLinkablePath(path: string): boolean {
  return DEEP_LINK_PATTERNS.some((re) => re.test(path));
}

function buildCustomSchemeUri(): string | null {
  const { pathname, search } = window.location;
  if (!isDeepLinkablePath(pathname)) return null;
  return `${CUSTOM_SCHEME}:/${pathname}${search}`;
}

function getAppLink(): string {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (!ref) return APP_LINK;
  const separator = APP_LINK.includes('?') ? '&' : '?';
  return `${APP_LINK}${separator}ref=${encodeURIComponent(ref)}`;
}

const openApp = () => window.open(getAppLink(), '_blank');
const openStore = () => window.open(getAppLink(), '_blank');

const heroImages = LANDING_ASSETS.heroSlides;
const trustStudentAvatars = LANDING_ASSETS.trustStudents;

const LANDING_SEO_DESCRIPTION =
  "O'zbekistondagi yirik qizlar onlayn ta'lim platformasi: sifatli kurslar, professional mentorlar, hamjamiyat va rasmiy sertifikatlar. IT, dizayn, biznes va boshqa yo'nalishlar.";

const LANDING_SEO_KEYWORDS = [
  "Qizlar Akademiyasi",
  "qizlar uchun kurslar",
  "onlayn ta'lim O'zbekiston",
  "ayollar IT kursi",
  "onlayn platforma",
  "ta'lim sertifikati",
];

const LandingPage: React.FC = () => {
  const { pathname, search } = useLocation();
  const isCanonicalLanding = pathname === '/' || pathname === '';
  const sectionLandingMap: Record<string, string> = {
    '/about': 'about',
    '/kurslar': 'courses',
    '/advantages': 'advantages',
    '/testimonials': 'testimonials',
  };
  const isIndexableLanding =
    isCanonicalLanding || Object.prototype.hasOwnProperty.call(sectionLandingMap, pathname);
  const siteUrl = getSiteUrl();

  const reduceMotion = useReducedMotion();
  const profile = useMotionProfile();

  const {
    studentsCount,
    coursesCount,
    specialistsCount,
    studentsPending,
    coursesPending,
    specialistsPending,
  } = useLandingStats();

  const statRows = useMemo(() => {
    const cell = (n: number | null, pending: boolean): string => {
      if (pending && n == null) return '…';
      if (n != null) return formatLandingStatInt(n);
      return '—';
    };
    return [
      { key: 'students', value: cell(studentsCount, studentsPending), label: "O'quvchilar" },
      { key: 'courses', value: cell(coursesCount, coursesPending), label: 'Kurslar soni' },
      { key: 'specialists', value: cell(specialistsCount, specialistsPending), label: 'Mutaxassislar' },
    ];
  }, [
    studentsCount,
    coursesCount,
    specialistsCount,
    studentsPending,
    coursesPending,
    specialistsPending,
  ]);

  const structuredData = useMemo(() => {
    if (!isIndexableLanding || !siteUrl) return undefined;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: siteUrl,
          name: 'Qizlar Akademiyasi',
          inLanguage: 'uz-UZ',
          publisher: { '@id': `${siteUrl}/#organization` },
        },
        {
          '@type': 'EducationalOrganization',
          '@id': `${siteUrl}/#organization`,
          name: 'Qizlar Akademiyasi',
          url: siteUrl,
          logo: `${siteUrl}/logo_only.svg`,
          description: LANDING_SEO_DESCRIPTION,
        },
      ],
    };
  }, [isIndexableLanding, siteUrl]);

  const appHref = useMemo(() => {
    if (typeof window === 'undefined') return APP_LINK;
    return getAppLink();
  }, [pathname, search]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  // Two-phase transition: first render next slide "offscreen",
  // then in next frame enable CSS transition to slide it in.
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const transitionRafRef = useRef<number | null>(null);
  const heroDotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = heroDotsRef.current;
    if (!root) return;
    const active = root.querySelector<HTMLElement>('.slide-dot.active');
    if (!active) return;

    // scrollIntoView sahifa scrollini ham o‘zgartiradi — pastga tushib videolar bo‘limida
    // turgan foydalanuvchini tepaga “uchirish” mumkin. Faqat dots lentasini siljitamiz.
    const rootRect = root.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const delta =
      activeRect.left + activeRect.width / 2 - (rootRect.left + rootRect.width / 2);
    const targetLeft = Math.max(
      0,
      Math.min(root.scrollLeft + delta, Math.max(0, root.scrollWidth - root.clientWidth)),
    );
    root.scrollTo({
      left: targetLeft,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [currentSlide, reduceMotion]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // SEO uchun bo‘limlarni alohida URL qilish: /about, /kurslar, ...
  // Kirilganda mos section’ga skroll qiladi.
  useEffect(() => {
    const sectionId = sectionLandingMap[pathname];
    if (!sectionId) return;
    const t = window.setTimeout(() => scrollToSection(sectionId), 50);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const schemeUri = buildCustomSchemeUri();
    if (!schemeUri) return;
    const timeout = setTimeout(() => {
      window.location.href = schemeUri;
    }, 1);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-slideshow: har 3.5 soniyada rasm almashadi
  useEffect(() => {
    const clearTransitionTimeout = () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };

    const clearTransitionRaf = () => {
      if (transitionRafRef.current) {
        window.cancelAnimationFrame(transitionRafRef.current);
        transitionRafRef.current = null;
      }
    };

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => {
        const nextIndex = (prev + 1) % heroImages.length;
        setPrevSlide(prev);
        // Pre-state for CSS
        setIsTransitioning(false);
        if (transitionRafRef.current) window.cancelAnimationFrame(transitionRafRef.current);
        transitionRafRef.current = window.requestAnimationFrame(() => {
          setIsTransitioning(true);
          clearTransitionTimeout();
          transitionTimeoutRef.current = window.setTimeout(() => {
            setIsTransitioning(false);
            setPrevSlide(null);
            transitionTimeoutRef.current = null;
          }, 700);
          transitionRafRef.current = null;
        });
        return nextIndex;
      });
    }, 3500);

    return () => {
      window.clearInterval(timer);
      clearTransitionTimeout();
      clearTransitionRaf();
    };
  }, []);

  const goToSlide = (index: number) => {
    if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = null;
    if (transitionRafRef.current) window.cancelAnimationFrame(transitionRafRef.current);
    transitionRafRef.current = null;

    setCurrentSlide((prev) => {
      if (prev === index) return prev;
      setPrevSlide(prev);
      return index;
    });

    setIsTransitioning(false);
    transitionRafRef.current = window.requestAnimationFrame(() => {
      setIsTransitioning(true);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        setPrevSlide(null);
        transitionTimeoutRef.current = null;
      }, 700);
      transitionRafRef.current = null;
    });
  };

  const courses = [
    {
      id: 1,
      iconSrc: LANDING_ASSETS.iconCourseIt,
      title: 'IT va Media',
      description:
        "Zamonaviy texnologiyalar, grafik dizayn va raqamli marketing olamiga qadam qo'ying. Kelajak kasblarini mutaxassislardan o'rganing.",
      cta: "YO'NALISHNI KO'RISH",
      showArrow: true,
      isFeatured: false,
      bentoClass: 'bento-it',
    },
    {
      id: 2,
      iconSrc: LANDING_ASSETS.iconCourseBusiness,
      title: 'Tadbirkorlik',
      description:
        "O'z biznesingizni noldan boshlash, strategik rejalashtirish va moliyaviy erkinlikka erishish sirlarini egallang.",
      cta: "YO'NALISHNI KO'RISH",
      showArrow: true,
      isFeatured: true,
      bentoClass: 'bento-design',
    },
    {
      id: 3,
      iconSrc: LANDING_ASSETS.iconCourseCraft,
      title: 'Hunarmandchilik',
      description:
        "Milliy va zamonaviy hunarmandchilik san'ati orqali o'z ijodingizni daromadga aylantiring va mahoratingizni oshiring.",
      cta: "YO'NALISHNI KO'RISH",
      showArrow: true,
      isFeatured: false,
      bentoClass: 'bento-business',
    },
    {
      id: 4,
      iconSrc: LANDING_ASSETS.iconCourseHealth,
      title: 'Salomatlik',
      description:
        "Sog'lom turmush tarzi, psixologiya va ayollar salomatligi bo'yicha bilimga ega bo'lib, hayot sifatini yaxshilang.",
      cta: "YO'NALISHNI KO'RISH",
      showArrow: true,
      isFeatured: false,
      bentoClass: 'bento-growth',
    },
  ];

  const advantages = [
    {
      icon: GraduationCap,
      title: "Professional o'qituvchilar",
      desc: "Soha ekspertlaridan to'g'ridan-to'g'ri o'rganing",
    },
    {
      icon: Award,
      title: 'Sertifikatlar',
      desc: "Kursni tugatgandan so'ng rasmiy sertifikat oling",
    },
    {
      icon: MessageCircle,
      title: "Hamjamiyat bilan ishlash",
      desc: "Tengdoshlar va mentorlar bilan bog'laning",
    },
    {
      icon: Clock,
      title: 'Qulay jadval',
      desc: "O'z vaqtingizda, o'z sur'atingizda o'rganing",
    },
  ];

  const testimonials = useMemo(
    () =>
      LANDING_TESTIMONIAL_VIDEOS.map((v) => ({
        youtubeId: v.youtubeId,
        title: v.title,
        role: 'Bitiruvchi',
      })),
    [],
  );

  const landingTestimonialsMarquee = useMemo(
    () => (reduceMotion ? testimonials : [...testimonials, ...testimonials]),
    [reduceMotion, testimonials],
  );

  const partners = [
    { name: 'Yoshlar agentligi', src: '/sponsers/yoshlar_agantligi.svg' },
    { name: 'Ijtimoiy himoya', src: '/sponsers/ijtimoiy_himoya.svg' },
    { name: 'Qizlar ovozi', src: '/sponsers/qizlar_ovozi.svg' },
  ];
  const partnersMarquee = [...partners, ...partners, ...partners, ...partners];

  const landingTeamOrdered = useMemo(
    () => orderTeamAlternatingGender(LANDING_TEAM_MEMBERS),
    [],
  );
  const landingTeamMarquee = useMemo(
    () =>
      reduceMotion ? landingTeamOrdered : [...landingTeamOrdered, ...landingTeamOrdered],
    [reduceMotion, landingTeamOrdered],
  );

  return (
    <div className="landing-page">
      <Seo
        title={
          isCanonicalLanding
            ? "Qizlar Akademiyasi — qizlar uchun onlayn ta'lim, kurslar va sertifikatlar"
            : pathname === '/kurslar'
              ? "Kurslar — Qizlar Akademiyasi"
              : pathname === '/about'
                ? "Biz haqimizda — Qizlar Akademiyasi"
                : pathname === '/advantages'
                  ? "Afzalliklar — Qizlar Akademiyasi"
                  : pathname === '/testimonials'
                    ? "Bitiruvchilar fikri — Qizlar Akademiyasi"
                    : 'Qizlar Akademiyasi'
        }
        description={LANDING_SEO_DESCRIPTION}
        canonicalPath={isIndexableLanding ? (isCanonicalLanding ? '/' : pathname) : undefined}
        ogImage={isIndexableLanding ? LANDING_ASSETS.heroMain : undefined}
        keywords={isIndexableLanding ? LANDING_SEO_KEYWORDS : undefined}
        noindex={!isIndexableLanding}
        jsonLd={structuredData}
      />

      {/* HEADER */}
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-container header-inner">
          <a href="#" className="landing-logo">
            <img className="logo-icon-img" src="/logo_only.svg" alt="Qizlar Akademiyasi" />
            <span className="logo-text">
              Qizlar<span className="logo-accent">Akademiyasi</span>
            </span>
          </a>

          <nav className={`landing-nav ${isMenuOpen ? 'open' : ''}`}>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                window.history.pushState({}, '', '/about');
                scrollToSection('about');
              }}
            >
              Biz haqimizda
            </a>
            <a
              href="/kurslar"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                window.history.pushState({}, '', '/kurslar');
                scrollToSection('courses');
              }}
            >
              Kurslar
            </a>
            <a
              href="/advantages"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                window.history.pushState({}, '', '/advantages');
                scrollToSection('advantages');
              }}
            >
              Afzalliklar
            </a>
            <a
              href="/testimonials"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                window.history.pushState({}, '', '/testimonials');
                scrollToSection('testimonials');
              }}
            >
              Fikrlar
            </a>
          </nav>

          <div className="header-actions">
            <button
              id="cta-header-btn"
              className="btn-primary"
              onClick={openApp}
            >
              Boshlash
            </button>
            <button
              className={`burger-btn ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <div className="landing-container hero-inner">
          <motion.div
            className="hero-content"
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
            }}
          >
            <motion.div className="hero-badge" variants={motionVariants.fadeUp}>
              <span className="badge-dot" />
              Kelajak sizning qo'lingizda
            </motion.div>
            <motion.h1 className="hero-title" variants={motionVariants.fadeUp}>
              Kelajak <span className="highlight">ayol</span> yetakchilarini tayyorlaymiz.
            </motion.h1>
            <motion.p className="hero-desc" variants={motionVariants.fadeUp}>
              O'zbekistondagi eng yirik qizlar ta'lim platformasi. Sifatli kurslar,
              professional mentorlar va kuchli hamjamiyat bilan maqsadingizga erishing.
            </motion.p>
            <motion.div className="hero-buttons" variants={motionVariants.fadeUp}>
              <button
                id="hero-cta-btn"
                className="btn-primary btn-large"
                onClick={openApp}
              >
                <span>Kurslarni ko'rish</span>
                <img src={LANDING_ASSETS.iconArrowRight} alt="" className="hero-cta-icon" width={20} height={20} />
              </button>
              <button
                id="hero-more-btn"
                className="btn-outline"
                onClick={openApp}
              >
                Batafsil ma'lumot
              </button>
            </motion.div>
            <motion.div className="hero-trust" variants={motionVariants.fadeUp}>
              <div className="trust-avatars">
                {trustStudentAvatars.map((src, idx) => (
                  <img key={src} src={src} alt={`student ${idx + 1}`} loading="lazy" />
                ))}
              </div>
              <span className="trust-text">
                <span className="trust-stat-gradient">943,719+</span>
                <span className="trust-stat-muted"> muvaffaqiyatli bitiruvchi</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image-wrapper"
            initial={reduceMotion ? false : { opacity: 0, x: 60, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
          >
            <div className="hero-image-card">
              {/* Slideshow: /public/lending_images/aeroteach-*.jpg (Figma AeroTeach 43:41 @2x) */}
              <div className={`hero-slideshow ${isTransitioning ? 'is-transitioning' : ''}`}>
                {/* Eski rasm (chiqib ketayotgan) */}
                {prevSlide !== null && (
                  <div
                    className="hero-slide slide-prev"
                    style={{ backgroundImage: `url(${heroImages[prevSlide]})` }}
                  />
                )}
                {/* Yangi rasm (kirmoqda) */}
                <div
                  className={`hero-slide slide-next ${(prevSlide === null || isTransitioning) ? 'slide-active' : ''}`}
                  style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
                />

                <div ref={heroDotsRef} className="slideshow-dots--hero-inner">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`slide-dot ${i === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(i)}
                      aria-label={`Rasm ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-glow" />
          </motion.div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" id="about">
        <StaggerGroup className="landing-container stats-grid" margin="-40px" staggerChildren={0.14}>
          {statRows.map((stat) => (
            <motion.div
              key={stat.key}
              className="stat-card"
              variants={motionVariants.scaleIn}
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-line" />
            </motion.div>
          ))}
        </StaggerGroup>
      </section>

      {/* COURSES */}
      <section className="courses-section" id="courses">
        <FloatingOrnamentLayer variant="rich" />
        <div className="landing-container">
          <FadeUp className="section-header">
            <p className="section-eyebrow">Nima o'rganmoqchisiz?</p>
            <h2 className="section-title">Saralangan yo'nalishlar</h2>
            <p className="section-desc">
              Sizning qiziqishlaringiz va maqsadlaringizga mos keladigan professional
              yo'nalishlardan birini tanlang.
            </p>
          </FadeUp>

          <StaggerGroup className="courses-grid" margin="-60px" staggerChildren={0.13}>
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                className={['course-card', course.isFeatured ? 'featured' : '', 'bento', course.bentoClass].join(' ')}
                onClick={openApp}
                variants={motionVariants.rotateIn}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -10, rotate: i % 2 === 0 ? 0.4 : -0.4 }
                }
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <div className="course-content">
                  <div className="course-icon" aria-hidden="true">
                    <img src={course.iconSrc} alt="" className="course-icon-img" width={28} height={28} />
                  </div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                </div>

                <button
                  type="button"
                  className={`course-cta ${course.isFeatured ? 'course-cta-white' : ''}`}
                  onClick={openApp}
                >
                  <span>{course.cta}</span>
                  {course.showArrow ? (
                    <img
                      className={`course-cta-arrow-img ${course.isFeatured ? 'course-cta-arrow-img-light' : ''}`}
                      src={LANDING_ASSETS.iconArrowSmall}
                      width={16}
                      height={16}
                      alt=""
                    />
                  ) : null}
                </button>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="advantages-section" id="advantages">
        <FloatingOrnamentLayer variant="lavender" />
        <div className="landing-container">
          <FadeUp className="section-header section-header-advantages-figma">
            <div className="section-heading-logo">
              <img src="/logo_only.svg" alt="" width={47} height={55} />
            </div>
            <h2 className="section-title">Afzalliklari</h2>
            <div className="section-underline" />
          </FadeUp>

          <StaggerGroup className="advantages-grid" margin="-50px" staggerChildren={0.1}>
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                className="adv-card"
                variants={motionVariants.scaleIn}
                whileHover={
                  reduceMotion ? undefined : { y: -10, rotate: i % 2 === 0 ? -0.5 : 0.5 }
                }
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <div className="adv-icon-wrap">
                  <span className="adv-icon" aria-hidden="true">
                    {React.createElement(adv.icon as LucideIcon, {
                      className: 'adv-icon-svg',
                      size: 28,
                      strokeWidth: 2,
                    })}
                  </span>
                </div>
                <h3 className="adv-title">{adv.title}</h3>
                <p className="adv-desc">{adv.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <FloatingOrnamentLayer variant="mint" />
        <div className="landing-container">
          <FadeUp className="section-header">
            <p className="section-eyebrow">Bitiruvchilar fikri</p>
            <h2 className="section-title">0 dan 1 ga natijalar gapirsin</h2>
          </FadeUp>

          <FadeUp className="testimonials-marquee-fade" margin="-40px">
            <div
              className={
                reduceMotion
                  ? 'testimonials-track-wrapper testimonials-track-wrapper--scrollable'
                  : 'testimonials-track-wrapper'
              }
            >
              <div
                className={
                  reduceMotion
                    ? 'testimonials-track testimonials-track--static'
                    : 'testimonials-track testimonials-track--marquee'
                }
              >
                {landingTestimonialsMarquee.map((t, i) => (
                  <div
                    key={`${t.youtubeId}-${i}`}
                    className="testimonial-card testimonial-card-figma testimonial-card--marquee"
                  >
                    <TestimonialYoutubeEmbed youtubeId={t.youtubeId} title={t.title} />
                    <div className="testimonial-author testimonial-author-figma">
                      <div className="testimonial-author-copy">
                        <strong className="author-name author-name--video-title">{t.title}</strong>
                        <span className="author-role">{t.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section" id="team">
        <FloatingOrnamentLayer variant="mint" />
        <div className="landing-container">
          <FadeUp className="section-header team-section-header">
            <p className="section-eyebrow">Bizning Jamoa</p>
            <div className="team-title-row">
              <img src={LANDING_ASSETS.teamHeadingIcon} alt="" className="team-title-icon" width={46} height={55} />
              <h2 className="section-title">Jamoasi</h2>
            </div>
          </FadeUp>

          <FadeUp className="team-marquee-fade" margin="-40px">
            <div
              className={
                reduceMotion
                  ? 'team-track-wrapper team-track-wrapper--scrollable'
                  : 'team-track-wrapper'
              }
            >
              <div
                className={
                  reduceMotion ? 'team-track team-track--static' : 'team-track team-track--marquee'
                }
              >
                {landingTeamMarquee.map((m, i) => (
                  <article key={`${m.id}-${i}`} className="team-card team-card--strip">
                    <div className="team-photo-wrap">
                      <img
                        src={landingTeamMemberImageSrc(m)}
                        alt={m.name}
                        className="team-photo"
                        loading="lazy"
                      />
                    </div>
                    <div className="team-meta">
                      <strong className="team-name">{m.name}</strong>
                      <span className="team-role">{m.role}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners-section">
        <div className="landing-container">
          <FadeUp>
            <p className="partners-label">Hamkor kompaniyalar</p>
          </FadeUp>
          <div className="partners-track-wrapper">
            <div className="partners-track">
              {partnersMarquee.map((p, i) => (
                <div key={`${p.name}-${i}`} className="partner-logo">
                  <img src={p.src} alt={p.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <ParallaxLayer offset={50} className="parallax-fill">
          <div className="cta-bg-blob" />
        </ParallaxLayer>
        <FloatingOrnamentLayer variant="lavender" />
        <ScaleIn className="landing-container cta-inner" margin="-50px">
          <h2 className="cta-title">Bugun boshlang!</h2>
          <p className="cta-desc">
            945 000 ayollar allaqachon o'z kelajagini qurishmoqda. Siz ham ularga qo'shiling.
          </p>
          <button
            id="cta-bottom-btn"
            className="btn-primary btn-large btn-white-outline"
            onClick={openApp}
          >
            <span>Bepul ro'yxatdan o'tish</span>
            <img src={LANDING_ASSETS.ctaArrow} alt="" width={18} height={18} />
          </button>

          <div className="store-badges store-badges-on-dark">
            <button type="button" className="store-badge store-badge-light" onClick={openStore} aria-label="Get it on Google Play">
              <img className="store-badge-img" src="/store-badges/google-play-light.svg" alt="" />
            </button>
            <button type="button" className="store-badge store-badge-light" onClick={openStore} aria-label="Download on the App Store">
              <img className="store-badge-img" src="/store-badges/app-store-light.svg" alt="" />
            </button>
          </div>
        </ScaleIn>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <RotateIn className="footer-brand" margin="-30px">
            <a href={appHref} target="_blank" rel="noopener noreferrer" className="landing-logo">
              <img className="logo-icon-img" src="/logo_only.svg" alt="Qizlar Akademiyasi" />
              <span className="logo-text">
                Qizlar<span className="logo-accent">Akademiyasi</span>
              </span>
            </a>
            <p className="footer-tagline">Kelajak ayol yetakchilarini tayyorlaymiz.</p>
          </RotateIn>

          <FadeUp className="footer-links" margin="-40px">
            <div className="footer-col">
              <h4>Kurslar</h4>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                IT va Media
              </a>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Tadbirkorlik
              </a>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Hunarmandchilik
              </a>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Salomatlik
              </a>
            </div>
            <div className="footer-col">
              <h4>Kompaniya</h4>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Biz haqimizda
              </a>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Mentorlar
              </a>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Sertifikatlar
              </a>
              <a href={appHref} target="_blank" rel="noopener noreferrer">
                Blog
              </a>
            </div>
            <div className="footer-col footer-col-social">
              <h4>Aloqa</h4>
              <a className="footer-social-link" href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                <img src={LANDING_ASSETS.socialYoutube} alt="" width={18} height={18} /> Youtube
              </a>
              <a className="footer-social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                <img src={LANDING_ASSETS.socialInstagram} alt="" width={18} height={18} /> Instagram
              </a>
              <a className="footer-social-link" href="https://t.me/" target="_blank" rel="noreferrer">
                <img src={LANDING_ASSETS.socialTelegram} alt="" width={18} height={18} /> Telegram
              </a>
              <a className="footer-social-link" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                <img src={LANDING_ASSETS.socialLinkedin} alt="" width={18} height={18} /> Linked In
              </a>
            </div>
          </FadeUp>
        </div>

        <div className="footer-bottom">
          <div className="landing-container footer-bottom-inner">
            <span>© 2026 Qizlar Akademiyasi. Barcha huquqlar himoyalangan.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
