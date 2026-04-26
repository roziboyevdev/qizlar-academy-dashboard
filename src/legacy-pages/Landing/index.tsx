import React, { useMemo, useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import http from 'services/api';
import { Award, ArrowRight, BriefcaseBusiness, Clock, Code2, MessageCircle, Palette, Sparkles, GraduationCap, Star, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Seo } from 'components/Seo';
import { getSiteUrl } from 'config/site';
import './landing.css';

import { useMotionProfile } from './components/useMotionProfile';
import { FadeUp, ScaleIn, RotateIn, StaggerGroup, motionVariants, ParallaxLayer } from './components/MotionPrimitives';
import { FloatingOrnamentLayer } from './components/FemmeOrnaments';
import { AmbientCanvas } from './components/AmbientCanvas';

const Hero3DScene = lazy(() =>
  import('./components/Hero3DScene').then((m) => ({ default: m.Hero3DScene })),
);

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
  return `https://www.qizlarakademiyasi.uz/register?ref=${encodeURIComponent(ref)}`;
}

const openApp = () => window.open(getAppLink(), '_blank');
const openStore = () => window.open(getAppLink(), '_blank');

// lending_images papkasidagi barcha rasmlar
const heroImages = [
  '/lending_images/teacher_2.jpg',
  '/lending_images/teacher_3.jpg',
  '/lending_images/teacher_4.jpg',
  '/lending_images/teacher_5.jpg',
  '/lending_images/teacher_6.jpg',
  '/lending_images/teacher_8.jpg',
];

// Women-only avatars for "trust" row (avoid random male avatars)
const trustWomenAvatars = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/women/31.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
];

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
  const { pathname } = useLocation();
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
    }, 300);
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

  // ── API: statistika ──
  const { data: overview } = useQuery({
    queryKey: ['landing-overview'],
    queryFn: () => http.get('/statistics/main'),
    select: (res) => get(res, 'data.data') as { users: number; completedStudents: number; videos: number },
    staleTime: 5 * 60 * 1000,
  });

  const { data: coursesData } = useQuery({
    queryKey: ['landing-courses-count'],
    queryFn: () => http.get('/course', { params: { pageSize: 1, pageNumber: 1 } }),
    select: (res) =>
      (get(res, 'data.data.meta.pagination.count') ??
        get(res, 'data.meta.pagination.count') ??
        get(res, 'data.data.pagination.count') ??
        0) as number,
    staleTime: 5 * 60 * 1000,
  });

  const { data: teachersData } = useQuery({
    queryKey: ['landing-teachers-count'],
    queryFn: () => http.get('/teacher', { params: { pageSize: 1, pageNumber: 1 } }),
    select: (res) =>
      (get(res, 'data.data.meta.pagination.count') ??
        get(res, 'data.meta.pagination.count') ??
        get(res, 'data.data.pagination.count') ??
        0) as number,
    staleTime: 5 * 60 * 1000,
  });

  const formatNum = (n?: number) => {
    if (n === undefined || n === null || Number.isNaN(n)) return '...';
    if (n <= 0) return '...';
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K+`;
    return `${n}+`;
  };

  const formatCountPlus = (n?: number, fallback = '20+') => {
    if (n === undefined || n === null || Number.isNaN(n) || n <= 0) return fallback;
    return `${n}+`;
  };

  const stats = [
    { value: formatNum(overview?.users), label: "O'quvchilar" },
    { value: formatCountPlus(coursesData, '20+'), label: "Kurslar soni" },
    { value: formatCountPlus(teachersData, '20+'), label: "Mutaxassislar" },
  ];

  const courses = [
    {
      id: 1,
      icon: Code2,
      title: 'IT va Dasturlash',
      description:
        "Dasturlash asoslaridan tortib, professional darajagacha: Python, JavaScript, React va boshqa texnologiyalarni o'rganing.",
      cta: "YO'NALISHNI KO'RISH",
      showArrow: true,
      isFeatured: false,
    },
    {
      id: 2,
      icon: Palette,
      title: 'UI/UX Design',
      description:
        "Figma va Adobe XD orqali zamonaviy interfeys dizaynini o'rganing. Real loyihalarda amaliyot.",
      cta: "BATAFSIL MA'LUMOT",
      showArrow: false,
      isFeatured: true,
    },
    {
      id: 3,
      icon: BriefcaseBusiness,
      title: 'Biznes',
      description:
        "Biznesni boshlash, rivojlantirish va marketing strategiyalarini professional o'qituvchilardan o'rganing.",
      cta: "O'QUV REJASINI KO'RISH",
      showArrow: false,
      isFeatured: false,
    },
    {
      id: 4,
      icon: Sparkles,
      title: "Shaxsiy rivojlanish",
      description:
        "O'z-o'zini boshqarish, liderlik ko'nikmalari va emotional intellekt orqali muvaffaqiyatga erishing.",
      cta: "O'SISHNI BOSHLASH",
      showArrow: true,
      isFeatured: false,
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

  const testimonials = [
    {
      avatar: 'https://i.pravatar.cc/100?img=47',
      name: 'Nilufar S.',
      role: 'Frontend Developer',
      text: "Qizlar Akademiyasi mening hayotimni o'zgartirdi. 6 oy ichida IT sohasida ishga kirishga muvaffaq bo'ldim.",
    },
    {
      avatar: 'https://i.pravatar.cc/100?img=48',
      name: 'Malika T.',
      role: 'UI/UX Designer',
      text: "Kurslar juda sifatli va amaliy. Endi o'z dizayn studiyamni ochish rejam bor.",
    },
    {
      avatar: 'https://i.pravatar.cc/100?img=49',
      name: 'Zulfiya A.',
      role: 'Business Owner',
      text: "Biznes kursidan so'ng o'z onlayn do'konimni ochtim. Daromadim 3 baravarga oshdi!",
    },
  ];

  const partners = [
    { name: 'Yoshlar agentligi', src: '/sponsers/yoshlar_agantligi.svg' },
    { name: 'Ijtimoiy himoya', src: '/sponsers/ijtimoiy_himoya.svg' },
    { name: 'Qizlar ovozi', src: '/sponsers/qizlar_ovozi.svg' },
  ];
  const partnersMarquee = [...partners, ...partners, ...partners, ...partners];

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
        ogImage={isIndexableLanding ? '/lending_images/teacher_2.jpg' : undefined}
        keywords={isIndexableLanding ? LANDING_SEO_KEYWORDS : undefined}
        noindex={!isIndexableLanding}
        jsonLd={structuredData}
      />

      {profile.enableParticles && (
        <AmbientCanvas density={profile.particleDensity} className="ambient-canvas-wrap" />
      )}

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
        <ParallaxLayer offset={60} className="parallax-fill">
          <div className="hero-bg-blob blob-1" />
        </ParallaxLayer>
        <ParallaxLayer offset={-40} className="parallax-fill">
          <div className="hero-bg-blob blob-2" />
        </ParallaxLayer>

        {profile.enable3D && (
          <div className="hero-3d-layer">
            <Suspense fallback={null}>
              <Hero3DScene
                butterflyCount={profile.butterflyCount}
                crystalCount={profile.crystalCount}
                petalCount={profile.petalCount}
              />
            </Suspense>
          </div>
        )}

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
              Kelajak <span className="highlight">ayol</span><br />
              yetakchilarini<br />
              tayyorlaymiz.
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
                {trustWomenAvatars.map((src, idx) => (
                  <img key={src} src={src} alt={`student ${idx + 1}`} loading="lazy" />
                ))}
              </div>
              <span className="trust-text">
                <strong>{overview?.users ? `${overview.users.toLocaleString()}+` : '10,000+'}</strong> muvaffaqiyatli bitiruvchi
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
              {/* Slideshow: lending_images papkasidagi rasmlar */}
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
              </div>

              {/* Dot indikatorlari */}
              <div className="slideshow-dots">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    className={`slide-dot ${i === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(i)}
                    aria-label={`Rasm ${i + 1}`}
                  />
                ))}
              </div>

              <motion.div
                className="floating-badge badge-top-right"
                initial={reduceMotion ? false : { opacity: 0, x: 30, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: 2 }}
              >
                <Star className="fb-icon" size={22} aria-hidden="true" />
                <div>
                  <strong>94%</strong>
                  <span>Muvaffaqiyat darajasi</span>
                </div>
              </motion.div>
              <motion.div
                className="floating-badge badge-bottom-left"
                initial={reduceMotion ? false : { opacity: 0, x: -30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
              >
                <GraduationCap className="fb-icon" size={22} aria-hidden="true" />
                <div>
                  <strong>Sertifikat</strong>
                  <span>Har bir kursda</span>
                </div>
              </motion.div>
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
          {stats.map((stat, i) => (
            <motion.div
              key={i}
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
                className={[
                  'course-card',
                  course.isFeatured ? 'featured' : '',
                  i === 0 ? 'bento bento-it' : '',
                  i === 1 ? 'bento bento-design' : '',
                  i === 2 ? 'bento bento-business' : '',
                  i === 3 ? 'bento bento-growth' : '',
                ].join(' ')}
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
                    {React.createElement(course.icon as LucideIcon, {
                      className: 'course-icon-svg',
                      size: 28,
                      strokeWidth: 2,
                    })}
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
                    <svg className="course-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
          <FadeUp className="section-header">
            <p className="section-eyebrow">Nima uchun biz?</p>
            <h2 className="section-title">Akademiya afzalliklari</h2>
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
            <h2 className="section-title">Kelajak ovozi</h2>
          </FadeUp>

          <StaggerGroup className="testimonials-grid" margin="-50px" staggerChildren={0.14}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                variants={motionVariants.fadeUp}
                whileHover={
                  reduceMotion ? undefined : { y: -10, scale: 1.015 }
                }
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className="testimonial-stars">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Star key={j} size={15} fill="#f59e0b" color="#f59e0b" aria-hidden="true" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <strong className="author-name">{t.name}</strong>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
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
            10,000+ ayollar allaqachon o'z kelajagini qurishmoqda. Siz ham ularga qo'shiling.
          </p>
          <button
            id="cta-bottom-btn"
            className="btn-primary btn-large btn-white-outline"
            onClick={openApp}
          >
            <span>Bepul ro'yxatdan o'tish</span>
            <ArrowRight size={18} aria-hidden="true" />
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
            <a href="#" className="landing-logo">
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
              <a href="#">IT va Dasturlash</a>
              <a href="#">UI/UX Design</a>
              <a href="#">Biznes</a>
              <a href="#">Shaxsiy rivojlanish</a>
            </div>
            <div className="footer-col">
              <h4>Kompaniya</h4>
              <a href="#">Biz haqimizda</a>
              <a href="#">Mentorlar</a>
              <a href="#">Sertifikatlar</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-col">
              <h4>Aloqa</h4>
              <a href="#">Telegram</a>
              <a href="#">Instagram</a>
              <a href="#">info@qizlarakademiyasi.uz</a>
            </div>
          </FadeUp>
        </div>

        <div className="footer-bottom">
          <div className="landing-container footer-bottom-inner">
            <span>© 2024 Qizlar Akademiyasi. Barcha huquqlar himoyalangan.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
