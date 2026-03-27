import { Head, useForm } from '@inertiajs/react';
import {
    Users,
    Trophy,
    Heart,
    Clock,
    MapPin,
    Mail,
    ChevronRight,
    Menu,
    X,
    Send,
    User,
    ExternalLink,
    FileText,
    Car,
    Building2,
    ArrowUp,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import ContactController from '@/actions/App/Http/Controllers/ContactController';

/* ─── Reduced motion preference ─── */
function useReducedMotion() {
    const [reduced, setReduced] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return reduced;
}

/* ─── Scroll-triggered animation hook ─── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

/* ─── Active nav section tracker ─── */
function useActiveSection(sectionIds: string[]) {
    const [active, setActive] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((e) => e.isIntersecting);
                if (visible) setActive(visible.target.id);
            },
            { rootMargin: '-30% 0px -60% 0px' },
        );
        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sectionIds]);

    return active;
}

/* ─── Animated wrapper with direction variants ─── */
type RevealDirection = 'up' | 'left' | 'right' | 'scale';

function Reveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: RevealDirection;
}) {
    const { ref, inView } = useInView();

    const hiddenClass: Record<RevealDirection, string> = {
        up: 'translate-y-8 opacity-0',
        left: '-translate-x-10 opacity-0',
        right: 'translate-x-10 opacity-0',
        scale: 'scale-95 opacity-0',
    };

    return (
        <div
            ref={ref}
            className={`transition-all ease-out ${inView ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hiddenClass[direction]} ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: 'var(--duration-reveal, 800ms)',
                transitionTimingFunction: 'var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1))',
            }}
        >
            {children}
        </div>
    );
}

/* ─── Count-up animation for stats ─── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
    const { ref, inView } = useInView(0.5);
    const [count, setCount] = useState(0);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!inView) return;
        if (reducedMotion) {
            requestAnimationFrame(() => setCount(target));
            return;
        }
        const duration = 1500;
        const startTime = performance.now();

        function step(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }, [inView, target, reducedMotion]);

    return (
        <span ref={ref as React.RefObject<HTMLSpanElement>}>
            {count}{suffix}
        </span>
    );
}

/* ─── Interactive card with cursor glow ─── */
function GlowCard({ children, className = '' }: { children: ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={`group relative overflow-hidden ${className}`}
            style={{
                background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(26, 79, 212, 0.06), transparent 60%)',
            }}
        >
            {children}
        </div>
    );
}

/* ─── Section heading ─── */
function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
    return (
        <div className="mb-16 max-w-2xl">
            <span className="mb-3 inline-block font-semibold tracking-widest text-[#1a4fd4] uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.8rem' }}>
                {eyebrow}
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#0a1628] md:text-4xl lg:text-5xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {title}
            </h2>
            {description && <p className="text-lg leading-relaxed text-[#0a1628]/60">{description}</p>}
        </div>
    );
}

/* ─── Net divider ─── */
function NetDivider() {
    return (
        <div className="flex items-center gap-1 py-2">
            <div className="h-px flex-1 bg-[#1a4fd4]/10" />
            {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="h-3 w-px bg-[#1a4fd4]/20" />
            ))}
            <div className="h-px flex-1 bg-[#1a4fd4]/10" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Welcome() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [heroOffset, setHeroOffset] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const contactForm = useForm({ name: '', email: '', message: '' });
    const reducedMotion = useReducedMotion();
    const activeSection = useActiveSection(['over-ons', 'trainingstijden', 'teams', 'locatie', 'lid-worden', 'contact']);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
            setShowBackToTop(window.scrollY > 600);
            if (!reducedMotion) {
                setHeroOffset(window.scrollY * 0.3);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [reducedMotion]);

    const navLinks = [
        { label: 'Over ons', href: '#over-ons' },
        { label: 'Trainingstijden', href: '#trainingstijden' },
        { label: 'Onze teams', href: '#teams' },
        { label: 'Locatie', href: '#locatie' },
        { label: 'Lid worden', href: '#lid-worden' },
        { label: 'Contact', href: '#contact' },
    ];

    const values = [
        {
            icon: Users,
            title: 'Alle niveaus',
            description: 'Of je nu voor het eerst een batje vasthoudt of al jaren competitie speelt — bij ons vind je altijd een passende tafel.',
        },
        {
            icon: Heart,
            title: 'Gezelligheid',
            description: 'Meer dan alleen sport. Na de training schuiven we aan de bar aan voor een drankje en een goed gesprek.',
        },
        {
            icon: Trophy,
            title: 'Competitie',
            description: 'Met 3 teams strijden we in de regionale competities.',
        },
    ];

    const teams = [
        {
            name: 'Merwestad 1',
            competition: 'West - Senioren DUO',
            division: '4e klasse',
            poule: 'Poule F',
            players: ['Gert-Jan', 'Stefan'],
            reserves: [],
            href: 'https://ttapp.nl/#/poule/5021159',
        },
        {
            name: 'Merwestad 2',
            competition: 'West - Senioren DUO',
            division: '5e klasse',
            poule: 'Poule E',
            players: ['Jaap', 'Gerrit', 'Arjan'],
            reserves: ['Stefan', 'Ruud'],
            href: 'https://ttapp.nl/#/poule/5021172',
        },
        {
            name: 'Merwestad 1',
            competition: 'West - Senioren regulier',
            division: '5e klasse',
            poule: 'Poule A',
            players: ['Lenny', 'Stefan', 'Rob', 'Ruud'],
            reserves: [],
            href: 'https://ttapp.nl/#/poule/5021124',
        },
    ];

    const schedule = [
        { day: 'Dinsdag', time: '19:30 – 22:00', group: ['Vrij spelen', 'reguliere competitie'], color: 'bg-[#3b82f6]' },
        { day: 'Donderdag', time: '19:30 – 22:00', group: ['Vrij spelen', 'duo competitie'], color: 'bg-[#93c5fd]' },
    ];

    return (
        <>
            <Head title="Welkom">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800&family=outfit:300,400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="min-h-screen bg-white antialiased"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* ═══ NAVIGATION ═══ */}
                <nav
                    className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                        scrolled
                            ? 'bg-white/95 shadow-lg shadow-[#0a1628]/5 backdrop-blur-md'
                            : 'bg-transparent'
                    }`}
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <a
                            href="#"
                            className="flex items-center gap-3"
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1a4fd4]">
                                <div className="h-5 w-5 rounded-full border-2 border-white/90" />
                                <div className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 rotate-[25deg] bg-white/30" />
                            </div>
                            <span
                                className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-[#0a1628]' : 'text-white'}`}
                            >
                                TTV Merwestad
                            </span>
                        </a>

                        {/* Desktop nav links */}
                        <div className="hidden items-center gap-8 lg:flex">
                            {navLinks.map((link) => {
                                const sectionId = link.href.replace('#', '');
                                const isActive = activeSection === sectionId;
                                return (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className={`relative text-[0.938rem] font-medium transition-colors hover:text-[#1a4fd4] ${
                                            isActive
                                                ? scrolled ? 'text-[#1a4fd4]' : 'text-white'
                                                : scrolled ? 'text-[#0a1628]/60' : 'text-white/70'
                                        }`}
                                    >
                                        {link.label}
                                        <span
                                            className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
                                                isActive
                                                    ? 'w-full bg-[#1a4fd4]'
                                                    : 'w-0 bg-[#1a4fd4] group-hover:w-full'
                                            }`}
                                            style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                                        />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Mobile toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className={`rounded-lg p-2 transition-colors lg:hidden ${scrolled ? 'text-[#0a1628] hover:bg-[#0a1628]/5' : 'text-white hover:bg-white/10'}`}
                                aria-label="Menu openen"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <div
                        className={`overflow-hidden border-t border-[#0a1628]/5 bg-white shadow-lg transition-all duration-300 lg:hidden ${
                            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
                        }`}
                        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                    >
                        <div className="px-6 py-4">
                            {navLinks.map((link, i) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-3 text-sm font-medium text-[#0a1628]/70 transition-all hover:text-[#1a4fd4] ${
                                        mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                                    }`}
                                    style={{
                                        transitionDelay: mobileMenuOpen ? `${i * 50}ms` : '0ms',
                                        transitionDuration: '300ms',
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* ═══ HERO SECTION ═══ */}
                <section className="relative h-[80vh] overflow-hidden bg-[#0a1628]">
                    {/* Background photo with parallax */}
                    <img
                        src="/photos/PHOTO-2024-12-22-10-48-11.jpg"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-[120%] w-full object-cover object-[center_20%]"
                        style={{ transform: `translateY(${heroOffset}px)` }}
                    />

                    {/* Dark overlay — strong left-to-right gradient for text readability */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/75 to-[#0a1628]/40"
                        aria-hidden="true"
                    />

                    {/* Bottom fade for smooth transition to next section */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a1628]/90 to-transparent"
                        aria-hidden="true"
                    />

                    {/* Subtle grid pattern over photo */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(26,79,212,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(26,79,212,0.5) 1px, transparent 1px)
                            `,
                            backgroundSize: '80px 80px',
                        }}
                        aria-hidden="true"
                    />

                    {/* Floating balls */}
                    <div
                        className="absolute top-[18%] right-[12%] hidden h-28 w-28 rounded-full bg-gradient-to-br from-white/10 to-white/[0.03] lg:block"
                        style={{ animation: 'float-ball 6s ease-in-out infinite' }}
                        aria-hidden="true"
                    />
                    <div
                        className="absolute right-[28%] bottom-[22%] hidden h-10 w-10 rounded-full bg-gradient-to-br from-[#3b82f6]/30 to-[#3b82f6]/5 lg:block"
                        style={{ animation: 'float-ball 4.5s ease-in-out infinite 1.5s' }}
                        aria-hidden="true"
                    />
                    <div
                        className="absolute bottom-[38%] left-[6%] hidden h-16 w-16 rounded-full bg-gradient-to-br from-[#60a5fa]/15 to-transparent lg:block"
                        style={{ animation: 'float-ball 5s ease-in-out infinite 0.8s' }}
                        aria-hidden="true"
                    />

                    {/* Content */}
                    <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
                        <div className="max-w-3xl pt-24 pb-32 lg:pt-20">
                            {/* Badge */}
                            <div
                                className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#1a4fd4]/30 bg-[#1a4fd4]/10 px-4 py-2 text-sm text-[#7db3ff]"
                                style={{
                                    animation: 'slide-in-up 0.6s ease-out both',
                                }}
                            >
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#3b82f6]" />
                                Tafeltennisvereniging in Dordrecht
                            </div>

                            {/* Main heading */}
                            <h1
                                className="mb-8 text-5xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                                style={{
                                    fontFamily:
                                        "'Plus Jakarta Sans', sans-serif",
                                    animation:
                                        'slide-in-up 0.6s ease-out 0.12s both',
                                }}
                            >
                                TTV{' '}
                                <span
                                    className="bg-gradient-to-r from-[#60a5fa] via-[#93c5fd] to-white bg-clip-text text-transparent"
                                    style={{ filter: 'drop-shadow(0 0 60px rgba(96, 165, 250, 0.3))' }}
                                >
                                    Merwestad
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p
                                className="mb-10 max-w-xl text-lg leading-relaxed text-white/50 md:text-xl"
                                style={{
                                    animation:
                                        'slide-in-up 0.6s ease-out 0.24s both',
                                }}
                            >
                                Sinds 1962 dé plek voor tafeltennissers
                                van alle niveaus. Van recreant tot
                                competitiespeler — iedereen is welkom aan onze
                                tafels.
                            </p>

                            {/* CTAs */}
                            <div
                                className="flex flex-wrap gap-4"
                                style={{
                                    animation:
                                        'slide-in-up 0.6s ease-out 0.36s both',
                                }}
                            >
                                <a
                                    href="#lid-worden"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#1a4fd4] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1539a3] hover:shadow-[0_0_30px_rgba(26,79,212,0.35)]"
                                >
                                    Lid worden
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </a>
                                <a
                                    href="#over-ons"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/70 transition-all hover:border-white/30 hover:text-white"
                                >
                                    Meer ontdekken
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider */}
                    <div className="absolute right-0 bottom-0 left-0">
                        <svg
                            viewBox="0 0 1440 100"
                            preserveAspectRatio="none"
                            className="block h-16 w-full md:h-24"
                        >
                            <path
                                d="M0,100 L0,60 Q360,100 720,50 Q1080,0 1440,60 L1440,100 Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </section>

                {/* ═══ STATS BAR ═══ */}
                <section className="relative z-10 bg-white">
                    <div className="mx-auto max-w-5xl px-6">
                        <div className="-mt-12 rounded-2xl border border-[#0a1628]/[0.06] bg-white p-10 shadow-xl shadow-[#1a4fd4]/[0.06] md:p-12">
                            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                                {([
                                    { value: 60, suffix: '+', label: 'Jaar actief' },
                                    { value: 35, suffix: '+', label: 'Leden' },
                                    { value: 3, suffix: '', label: 'Competitieteams' },
                                    { value: 2, suffix: '×', label: 'Per week training' },
                                ] as const).map((stat, i) => (
                                    <Reveal key={stat.label} delay={i * 80} direction="scale">
                                        <div className="text-center">
                                            <div
                                                className="text-4xl font-bold text-[#1a4fd4] md:text-5xl"
                                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            >
                                                <CountUp target={stat.value} suffix={stat.suffix} />
                                            </div>
                                            <div className="mt-2 text-sm font-medium tracking-wide text-[#0a1628]/40 uppercase">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ ABOUT / OVER ONS ═══ */}
                <section
                    id="over-ons"
                    className="bg-gradient-to-b from-white to-[#f0f5ff] py-24 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6">
                        <Reveal>
                            <SectionHeading
                                eyebrow="Over ons"
                                title="Meer dan alleen tafeltennis"
                                description="Bij TTV Merwestad draait het om sport, plezier en verbinding. Of je nu jong of oud bent, beginner of gevorderd — je bent welkom."
                            />
                        </Reveal>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {values.map((item, i) => (
                                <Reveal key={item.title} delay={i * 120} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                                    <GlowCard className="rounded-2xl border border-[#0a1628]/[0.06] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]">
                                        <div
                                            className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-all group-hover:bg-[#1a4fd4] group-hover:text-white group-hover:rotate-6 group-hover:scale-110"
                                            style={{ transitionDuration: 'var(--duration-hover)', transitionTimingFunction: 'var(--ease-out-back)' }}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3
                                            className="mb-2 text-lg font-bold text-[#0a1628]"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#0a1628]/50">
                                            {item.description}
                                        </p>
                                    </GlowCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ TRAINING SCHEDULE ═══ */}
                <section
                    id="trainingstijden"
                    className="bg-white py-24 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6">
                        <Reveal>
                            <SectionHeading
                                eyebrow="Trainingstijden"
                                title="Wanneer kun je spelen?"
                                description="We trainen meerdere keren per week in de sporthal. Kies de avond die bij jou past en kom gerust een keer vrijblijvend meespelen."
                            />
                        </Reveal>

                        <div className="grid gap-6 sm:grid-cols-2">
                            {schedule.map((slot, i) => {
                                const dayMap: Record<string, number> = { Dinsdag: 2, Donderdag: 4 };
                                const isToday = new Date().getDay() === dayMap[slot.day];
                                return (
                                    <Reveal key={slot.day} delay={i * 120} direction={i === 0 ? 'left' : 'right'}>
                                        <GlowCard className={`relative overflow-hidden rounded-2xl border bg-[#f8fafc] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06] ${isToday ? 'border-[#1a4fd4]/25 ring-2 ring-[#1a4fd4]/10' : 'border-[#0a1628]/[0.06]'}`}>
                                            {/* Left accent bar */}
                                            <div
                                                className={`absolute top-0 left-0 h-full w-1.5 ${slot.color}`}
                                            />

                                            <div className="ml-4">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <h3
                                                        className="text-xl font-bold text-[#0a1628]"
                                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                                    >
                                                        {slot.day}
                                                    </h3>
                                                    {isToday && (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a4fd4]/10 px-3 py-1 text-xs font-semibold text-[#1a4fd4]">
                                                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#1a4fd4]" />
                                                            Vanavond!
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mb-3 flex items-center gap-2 text-[#0a1628]/50">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm font-medium">
                                                        {slot.time}
                                                    </span>
                                                </div>

                                                <NetDivider />

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {slot.group.map((item: string) => (
                                                        <span key={item} className="inline-flex items-center rounded-full bg-[#1a4fd4]/[0.08] px-3 py-1 text-xs font-semibold text-[#1a4fd4]">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </GlowCard>
                                    </Reveal>
                                );
                            })}
                        </div>

                        <Reveal delay={400}>
                            <p className="mt-8 text-sm text-[#0a1628]/40">
                                <MapPin className="mr-1 inline h-3.5 w-3.5" />
                                Maria Montessorilaan 3 – Zaal 1, 3312 KJ
                                Dordrecht
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* ═══ TEAMS / COMPETITIE ═══ */}
                <section id="teams" className="bg-[#f0f5ff] py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <Reveal>
                            <SectionHeading
                                eyebrow="Competitie"
                                title="Onze teams"
                                description="Met drie teams zijn we actief in de regionale competities van de NTTB. Bekijk de uitslagen en standen via de links bij elk team."
                            />
                        </Reveal>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {teams.map((team, i) => (
                                <Reveal key={`${team.name}-${team.competition}`} delay={i * 120} direction={i === 1 ? 'up' : i === 0 ? 'left' : 'right'}>
                                    <a
                                        href={team.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0a1628]/[0.06] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]"
                                    >
                                        {/* Watermark team number */}
                                        <span
                                            className="pointer-events-none absolute -right-3 -bottom-5 text-[120px] font-black leading-none text-[#1a4fd4]/[0.04] transition-all duration-500 select-none group-hover:text-[#1a4fd4]/[0.08] group-hover:-translate-y-1"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            aria-hidden="true"
                                        >
                                            {i + 1}
                                        </span>

                                        {/* Header */}
                                        <div className="mb-5 flex items-start justify-between">
                                            <div>
                                                <h3
                                                    className="text-xl font-bold text-[#0a1628]"
                                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                                >
                                                    {team.name}
                                                </h3>
                                                <p className="mt-1 text-sm font-medium text-[#1a4fd4]">
                                                    {team.competition}
                                                </p>
                                            </div>
                                            <div
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-all group-hover:bg-[#1a4fd4] group-hover:text-white group-hover:rotate-6 group-hover:scale-110"
                                                style={{ transitionDuration: 'var(--duration-hover)', transitionTimingFunction: 'var(--ease-out-back)' }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </div>
                                        </div>

                                        {/* Division & Poule */}
                                        <div className="mb-5 flex gap-2">
                                            <span className="inline-flex items-center rounded-full bg-[#1a4fd4]/[0.08] px-3 py-1 text-xs font-semibold text-[#1a4fd4]">
                                                {team.division}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-[#0a1628]/[0.05] px-3 py-1 text-xs font-semibold text-[#0a1628]/50">
                                                {team.poule}
                                            </span>
                                        </div>

                                        <NetDivider />

                                        {/* Players */}
                                        <div className="mt-4 flex-1">
                                            <p className="mb-2 text-xs font-semibold tracking-wide text-[#0a1628]/30 uppercase">Spelers</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {team.players.map((player) => (
                                                    <span
                                                        key={player}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a1628]/[0.04] px-2.5 py-1 text-xs font-medium text-[#0a1628]/70"
                                                    >
                                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1a4fd4]/10 text-[8px] font-bold text-[#1a4fd4]">
                                                            {player[0]}
                                                        </span>
                                                        {player}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Reserves */}
                                        {team.reserves.length > 0 && (
                                            <div className="mt-3">
                                                <p className="mb-2 text-xs font-semibold tracking-wide text-[#0a1628]/30 uppercase">Reserve</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {team.reserves.map((player) => (
                                                        <span
                                                            key={player}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#0a1628]/10 px-2.5 py-1 text-xs font-medium text-[#0a1628]/45"
                                                        >
                                                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0a1628]/[0.04] text-[8px] font-bold text-[#0a1628]/40">
                                                                {player[0]}
                                                            </span>
                                                            {player}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Link hint */}
                                        <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-[#1a4fd4] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                            Bekijk uitslagen
                                            <ChevronRight className="h-3 w-3" />
                                        </div>
                                    </a>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ LOCATIE / BEREIKBAARHEID ═══ */}
                <section id="locatie" className="bg-white py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <Reveal>
                            <SectionHeading
                                eyebrow="Locatie"
                                title="Zo vind je ons"
                                description="We spelen in het gebouw van Mountain Network op het Leerpark in Dordrecht. Hieronder zie je precies waar je kunt parkeren en hoe je bij de ingang komt."
                            />
                        </Reveal>

                        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                            {/* Satellite image */}
                            <Reveal direction="left">
                                <div className="group relative overflow-hidden rounded-2xl border border-[#0a1628]/[0.06] shadow-xl shadow-[#1a4fd4]/[0.04]">
                                    <img
                                        src="/map.png"
                                        alt="Satellietbeeld van de locatie van TTV Merwestad bij Mountain Network op het Leerpark in Dordrecht"
                                        className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                                        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                                    />
                                    <a
                                        href="https://maps.google.com/?q=Maria+Montessorilaan+3+Dordrecht"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-xs font-semibold text-[#1a4fd4] shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                                    >
                                        <MapPin className="h-3.5 w-3.5" />
                                        Open in Google Maps
                                    </a>
                                </div>
                            </Reveal>

                            {/* Info */}
                            <div className="space-y-6">
                                <Reveal delay={100} direction="right">
                                    <GlowCard className="rounded-2xl border border-[#0a1628]/[0.06] bg-[#f8fafc] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]">
                                        <div
                                            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-all group-hover:bg-[#1a4fd4] group-hover:text-white group-hover:rotate-6 group-hover:scale-110"
                                            style={{ transitionDuration: 'var(--duration-hover)', transitionTimingFunction: 'var(--ease-out-back)' }}
                                        >
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <h3
                                            className="mb-2 text-lg font-bold text-[#0a1628]"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            Mountain Network
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#0a1628]/50">
                                            Ons gebouw heet Mountain Network en bevindt zich op het Leerpark in Dordrecht. We zitten in Zaal 1 op de begane grond.
                                        </p>
                                    </GlowCard>
                                </Reveal>

                                <Reveal delay={200} direction="right">
                                    <GlowCard className="rounded-2xl border border-[#0a1628]/[0.06] bg-[#f8fafc] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]">
                                        <div
                                            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-all group-hover:bg-[#1a4fd4] group-hover:text-white group-hover:rotate-6 group-hover:scale-110"
                                            style={{ transitionDuration: 'var(--duration-hover)', transitionTimingFunction: 'var(--ease-out-back)' }}
                                        >
                                            <Car className="h-5 w-5" />
                                        </div>
                                        <h3
                                            className="mb-2 text-lg font-bold text-[#0a1628]"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            Parkeren
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#0a1628]/50">
                                            Je kunt gratis parkeren aan de achterkant van het gebouw. Let op: de ingang van het gebouw bevindt zich aan de voorkant, aan de kant van het Leerpark.
                                        </p>
                                    </GlowCard>
                                </Reveal>

                                <Reveal delay={300} direction="right">
                                    <GlowCard className="rounded-2xl border border-[#0a1628]/[0.06] bg-[#f8fafc] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]">
                                        <div
                                            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-all group-hover:bg-[#1a4fd4] group-hover:text-white group-hover:rotate-6 group-hover:scale-110"
                                            style={{ transitionDuration: 'var(--duration-hover)', transitionTimingFunction: 'var(--ease-out-back)' }}
                                        >
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <h3
                                            className="mb-2 text-lg font-bold text-[#0a1628]"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            Ingang
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#0a1628]/50">
                                            Loop vanaf de parkeerplaats om het gebouw heen naar de voorzijde (kant Leerpark). Daar vind je de hoofdingang van Mountain Network.
                                        </p>
                                    </GlowCard>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ MEMBERSHIP CTA ═══ */}
                <section
                    id="lid-worden"
                    className="relative overflow-hidden bg-[#0a1628] py-24 lg:py-32"
                >
                    {/* Background decoration */}
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                            backgroundSize: '32px 32px',
                        }}
                        aria-hidden="true"
                    />
                    <div
                        className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#1a4fd4]/20 blur-[120px]"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#3b82f6]/15 blur-[100px]"
                        aria-hidden="true"
                    />

                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <Reveal>
                            <span
                                className="mb-4 inline-block font-semibold tracking-widest text-[#3b82f6] uppercase"
                                style={{
                                    fontFamily:
                                        "'Plus Jakarta Sans', sans-serif",
                                    fontSize: '0.8rem',
                                }}
                            >
                                Lid worden
                            </span>
                        </Reveal>
                        <Reveal delay={80}>
                            <h2
                                className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                                style={{
                                    fontFamily:
                                        "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                Klaar om mee te spelen?
                            </h2>
                        </Reveal>
                        <Reveal delay={160}>
                            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/50">
                                Word lid van TTV Merwestad en ontdek de leukste
                                tafeltennisvereniging van de regio. Je mag als
                                nieuwkomer 3 keer langs komen om te kijken
                                of het iets voor je is — kom gerust langs
                                om kennis te maken.
                            </p>
                        </Reveal>

                        <Reveal delay={240}>
                            <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="mailto:info@ttvmerwestad.nl"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#1a4fd4] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#1539a3] hover:shadow-[0_0_40px_rgba(26,79,212,0.35)]"
                                    style={{
                                        animation:
                                            'pulse-glow 3s ease-in-out infinite',
                                    }}
                                >
                                    Neem contact op
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </a>
                                <a
                                    href="#trainingstijden"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:border-white/30 hover:text-white"
                                >
                                    Bekijk trainingstijden
                                </a>
                            </div>
                        </Reveal>

                    </div>
                </section>

                {/* ═══ CONTACT FORM ═══ */}
                <section
                    id="contact"
                    className="bg-gradient-to-b from-[#f0f5ff] to-white py-24 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid items-start gap-16 lg:grid-cols-2">
                            {/* Left: heading + info */}
                            <Reveal>
                                <div>
                                    <SectionHeading
                                        eyebrow="Contact"
                                        title="Stuur ons een bericht"
                                        description="Heb je een vraag, wil je je aanmelden of gewoon even kennismaken? Vul het formulier in en we nemen zo snel mogelijk contact met je op."
                                    />

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-[#0a1628]/60">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08]">
                                                <MapPin className="h-4 w-4 text-[#1a4fd4]" />
                                            </div>
                                            Maria Montessorilaan 3 – Zaal 1,
                                            3312 KJ Dordrecht
                                        </div>
                                        <a
                                            href="mailto:info@ttvmerwestad.nl"
                                            className="flex items-center gap-3 text-sm text-[#0a1628]/60 transition-colors hover:text-[#1a4fd4]"
                                        >
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08]">
                                                <Mail className="h-4 w-4 text-[#1a4fd4]" />
                                            </div>
                                            info@ttvmerwestad.nl
                                        </a>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Right: form */}
                            <Reveal delay={150}>
                                {contactForm.recentlySuccessful ? (
                                    <div className="rounded-2xl border border-[#1a4fd4]/10 bg-white p-10 text-center shadow-xl shadow-[#1a4fd4]/[0.04]">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a4fd4]/10">
                                            <Mail className="h-6 w-6 text-[#1a4fd4]" />
                                        </div>
                                        <h3
                                            className="mb-2 text-xl font-bold text-[#0a1628]"
                                            style={{
                                                fontFamily:
                                                    "'Plus Jakarta Sans', sans-serif",
                                            }}
                                        >
                                            Bericht verstuurd!
                                        </h3>
                                        <p className="mb-6 text-sm text-[#0a1628]/50">
                                            Bedankt voor je bericht. We nemen zo
                                            snel mogelijk contact met je op.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => contactForm.reset()}
                                            className="text-sm font-medium text-[#1a4fd4] transition-colors hover:text-[#1539a3]"
                                        >
                                            Nieuw bericht sturen
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            contactForm.post(
                                                ContactController.url(),
                                                { preserveScroll: true },
                                            );
                                        }}
                                        className="rounded-2xl border border-[#0a1628]/[0.06] bg-white p-8 shadow-xl shadow-[#1a4fd4]/[0.04] md:p-10"
                                    >
                                        <div className="mb-6 grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="contact-name"
                                                    className="mb-2 block text-sm font-medium text-[#0a1628]/70"
                                                >
                                                    Naam
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0a1628]/25" />
                                                    <input
                                                        id="contact-name"
                                                        type="text"
                                                        value={
                                                            contactForm.data
                                                                .name
                                                        }
                                                        onChange={(e) =>
                                                            contactForm.setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Je volledige naam"
                                                        className={`w-full rounded-xl border bg-[#f8fafc] py-3 pr-4 pl-10 text-sm text-[#0a1628] placeholder-[#0a1628]/30 transition-all outline-none focus:border-[#1a4fd4]/40 focus:ring-2 focus:ring-[#1a4fd4]/10 ${contactForm.errors.name ? 'border-red-400' : 'border-[#0a1628]/10'}`}
                                                    />
                                                </div>
                                                {contactForm.errors.name && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            contactForm.errors
                                                                .name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="contact-email"
                                                    className="mb-2 block text-sm font-medium text-[#0a1628]/70"
                                                >
                                                    E-mailadres
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0a1628]/25" />
                                                    <input
                                                        id="contact-email"
                                                        type="email"
                                                        value={
                                                            contactForm.data
                                                                .email
                                                        }
                                                        onChange={(e) =>
                                                            contactForm.setData(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="naam@voorbeeld.nl"
                                                        className={`w-full rounded-xl border bg-[#f8fafc] py-3 pr-4 pl-10 text-sm text-[#0a1628] placeholder-[#0a1628]/30 transition-all outline-none focus:border-[#1a4fd4]/40 focus:ring-2 focus:ring-[#1a4fd4]/10 ${contactForm.errors.email ? 'border-red-400' : 'border-[#0a1628]/10'}`}
                                                    />
                                                </div>
                                                {contactForm.errors.email && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            contactForm.errors
                                                                .email
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label
                                                htmlFor="contact-message"
                                                className="mb-2 block text-sm font-medium text-[#0a1628]/70"
                                            >
                                                Bericht
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                rows={5}
                                                value={
                                                    contactForm.data.message
                                                }
                                                onChange={(e) =>
                                                    contactForm.setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Schrijf hier je bericht..."
                                                className={`w-full resize-none rounded-xl border bg-[#f8fafc] px-4 py-3 text-sm text-[#0a1628] placeholder-[#0a1628]/30 transition-all outline-none focus:border-[#1a4fd4]/40 focus:ring-2 focus:ring-[#1a4fd4]/10 ${contactForm.errors.message ? 'border-red-400' : 'border-[#0a1628]/10'}`}
                                            />
                                            {contactForm.errors.message && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {
                                                        contactForm.errors
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={
                                                contactForm.processing
                                            }
                                            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a4fd4] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1539a3] hover:shadow-lg hover:shadow-[#1a4fd4]/20 disabled:opacity-50 sm:w-auto"
                                        >
                                            {contactForm.processing
                                                ? 'Versturen...'
                                                : 'Verstuur bericht'}
                                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                    </form>
                                )}
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ═══ BACK TO TOP ═══ */}
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`fixed right-6 bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a4fd4] text-white shadow-lg shadow-[#1a4fd4]/25 transition-all duration-300 hover:bg-[#1539a3] hover:shadow-xl ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                    aria-label="Terug naar boven"
                >
                    <ArrowUp className="h-4 w-4" />
                </button>

                {/* ═══ FOOTER ═══ */}
                <footer className="border-t border-[#0a1628]/[0.06] bg-[#f8fafc] py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Brand column */}
                            <div>
                                <div
                                    className="mb-4 flex items-center gap-3"
                                    style={{
                                        fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                    }}
                                >
                                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1a4fd4]">
                                        <div className="h-4.5 w-4.5 rounded-full border-2 border-white/90" />
                                        <div className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 rotate-[25deg] bg-white/30" />
                                    </div>
                                    <span className="text-lg font-bold tracking-tight text-[#0a1628]">
                                        TTV Merwestad
                                    </span>
                                </div>
                                <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#0a1628]/45">
                                    Sinds 1962 de gezelligste
                                    tafeltennisvereniging van Dordrecht en
                                    omstreken.
                                </p>
                            </div>

                            {/* Contact column */}
                            <div>
                                <h3
                                    className="mb-4 text-sm font-bold tracking-wide text-[#0a1628]/30 uppercase"
                                    style={{
                                        fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                    }}
                                >
                                    Contact
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-[#0a1628]/60">
                                        <MapPin className="h-4 w-4 flex-shrink-0 text-[#1a4fd4]" />
                                        Maria Montessorilaan 3 – Zaal 1, 3312 KJ
                                        Dordrecht
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:info@ttvmerwestad.nl"
                                            className="flex items-center gap-3 text-sm text-[#0a1628]/60 transition-colors hover:text-[#1a4fd4]"
                                        >
                                            <Mail className="h-4 w-4 flex-shrink-0 text-[#1a4fd4]" />
                                            info@ttvmerwestad.nl
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick links column */}
                            <div>
                                <h3
                                    className="mb-4 text-sm font-bold tracking-wide text-[#0a1628]/30 uppercase"
                                    style={{
                                        fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                    }}
                                >
                                    Snel naar
                                </h3>
                                <ul className="space-y-2.5">
                                    {navLinks.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-sm text-[#0a1628]/50 transition-colors hover:text-[#1a4fd4]"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Documents column */}
                            <div>
                                <h3
                                    className="mb-4 text-sm font-bold tracking-wide text-[#0a1628]/30 uppercase"
                                    style={{
                                        fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                    }}
                                >
                                    Documenten
                                </h3>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: 'Privacyverklaring', href: '/documenten/privacyverklaring.pdf' },
                                        { label: 'Huishoudelijk reglement', href: '/documenten/huishoudelijk-reglement.pdf' },
                                        { label: 'Gedragscode', href: '/documenten/gedragscode.pdf' },
                                    ].map((doc) => (
                                        <li key={doc.label}>
                                            <a
                                                href={doc.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-[#0a1628]/50 transition-colors hover:text-[#1a4fd4]"
                                            >
                                                <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                                                {doc.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#0a1628]/[0.06] pt-8 sm:flex-row">
                            <p className="text-xs text-[#0a1628]/30">
                                &copy; {new Date().getFullYear()} TTV Merwestad.
                                Alle rechten voorbehouden.
                            </p>
                            <div className="text-xs text-[#0a1628]/20">
                                Gemaakt door{' '}
                                <a
                                    href="https://made-foryou.nl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-[#0a1628]/30 transition-colors hover:text-[#1a4fd4]"
                                >
                                    Made
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
