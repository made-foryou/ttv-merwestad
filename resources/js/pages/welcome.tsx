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
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import ContactController from '@/actions/App/Http/Controllers/ContactController';

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

/* ─── Animated wrapper ─── */
function Reveal({
    children,
    className = '',
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
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
    const contactForm = useForm({ name: '', email: '', message: '' });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { label: 'Over ons', href: '#over-ons' },
        { label: 'Trainingstijden', href: '#trainingstijden' },
        { label: 'Onze teams', href: '#teams' },
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
        { day: 'Dinsdag', time: '19:30 – 23:00', group: ['Vrij spelen', 'reguliere competitie'], color: 'bg-[#3b82f6]' },
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
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-[#1a4fd4] ${
                                        scrolled
                                            ? 'text-[#0a1628]/60'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            ))}
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
                    {mobileMenuOpen && (
                        <div className="border-t border-[#0a1628]/5 bg-white px-6 py-4 shadow-lg lg:hidden">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 text-sm font-medium text-[#0a1628]/70 transition-colors hover:text-[#1a4fd4]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </nav>

                {/* ═══ HERO SECTION ═══ */}
                <section className="relative min-h-screen overflow-hidden bg-[#0a1628]">
                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(26,79,212,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(26,79,212,0.5) 1px, transparent 1px)
                            `,
                            backgroundSize: '80px 80px',
                        }}
                    />

                    {/* Diagonal accent */}
                    <div
                        className="absolute right-0 bottom-0 h-full w-3/5 bg-gradient-to-bl from-[#1a4fd4]/25 to-transparent"
                        style={{
                            clipPath:
                                'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Floating balls */}
                    <div
                        className="absolute top-[18%] right-[12%] hidden h-36 w-36 rounded-full bg-gradient-to-br from-white/15 to-white/5 lg:block"
                        style={{
                            animation: 'float-ball 6s ease-in-out infinite',
                        }}
                        aria-hidden="true"
                    >
                        <div className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 rotate-[30deg] bg-white/10" />
                    </div>
                    <div
                        className="absolute right-[25%] bottom-[25%] hidden h-12 w-12 rounded-full bg-gradient-to-br from-[#3b82f6]/40 to-[#3b82f6]/10 lg:block"
                        style={{
                            animation:
                                'float-ball 4.5s ease-in-out infinite 1.5s',
                        }}
                        aria-hidden="true"
                    />
                    <div
                        className="absolute bottom-[35%] left-[8%] hidden h-20 w-20 rounded-full bg-gradient-to-br from-[#60a5fa]/20 to-transparent lg:block"
                        style={{
                            animation:
                                'float-ball 5s ease-in-out infinite 0.8s',
                        }}
                        aria-hidden="true"
                    />

                    {/* Content */}
                    <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6">
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
                                <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
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
                    <div className="mx-auto max-w-5xl px-6 py-16">
                        <Reveal>
                            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                                {[
                                    { value: '60+', label: 'Jaar actief' },
                                    { value: '35+', label: 'Leden' },
                                    { value: '3', label: 'Competitieteams' },
                                    { value: '2×', label: 'Per week training' },
                                ].map((stat, i) => (
                                    <Reveal key={stat.label} delay={i * 80}>
                                        <div className="text-center">
                                            <div
                                                className="text-4xl font-bold text-[#1a4fd4] md:text-5xl"
                                                style={{
                                                    fontFamily:
                                                        "'Plus Jakarta Sans', sans-serif",
                                                }}
                                            >
                                                {stat.value}
                                            </div>
                                            <div className="mt-2 text-sm font-medium tracking-wide text-[#0a1628]/40 uppercase">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </Reveal>
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

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {values.map((item, i) => (
                                <Reveal key={item.title} delay={i * 100}>
                                    <div className="group rounded-2xl border border-[#0a1628]/[0.06] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]">
                                        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-colors group-hover:bg-[#1a4fd4] group-hover:text-white">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3
                                            className="mb-2 text-lg font-bold text-[#0a1628]"
                                            style={{
                                                fontFamily:
                                                    "'Plus Jakarta Sans', sans-serif",
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#0a1628]/50">
                                            {item.description}
                                        </p>
                                    </div>
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

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {schedule.map((slot, i) => (
                                <Reveal key={slot.day} delay={i * 80}>
                                    <div className="group relative overflow-hidden rounded-2xl border border-[#0a1628]/[0.06] bg-[#f8fafc] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]">
                                        {/* Top accent bar */}
                                        <div
                                            className={`absolute top-0 left-0 h-1 w-full ${slot.color} transition-all duration-300 group-hover:h-1.5`}
                                        />

                                        <div className="mt-2 mb-4">
                                            <h3
                                                className="text-xl font-bold text-[#0a1628]"
                                                style={{
                                                    fontFamily:
                                                        "'Plus Jakarta Sans', sans-serif",
                                                }}
                                            >
                                                {slot.day}
                                            </h3>
                                        </div>

                                        <div className="mb-3 flex items-center gap-2 text-[#0a1628]/50">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                {slot.time}
                                            </span>
                                        </div>

                                        <NetDivider />

                                        <div className="mt-3 flex gap-2">
                                            {slot.group.map((item: string) => (
                                                <span className="inline-flex items-center rounded-full bg-[#1a4fd4]/[0.08] px-3 py-1 text-xs font-semibold text-[#1a4fd4]">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
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
                                <Reveal key={`${team.name}-${team.competition}`} delay={i * 100}>
                                    <a
                                        href={team.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex h-full flex-col rounded-2xl border border-[#0a1628]/[0.06] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a4fd4]/20 hover:shadow-xl hover:shadow-[#1a4fd4]/[0.06]"
                                    >
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
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#1a4fd4]/[0.08] text-[#1a4fd4] transition-colors group-hover:bg-[#1a4fd4] group-hover:text-white">
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
                                                        className="inline-flex items-center rounded-lg bg-[#0a1628]/[0.04] px-2.5 py-1 text-xs font-medium text-[#0a1628]/70"
                                                    >
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
                                                            className="inline-flex items-center rounded-lg border border-dashed border-[#0a1628]/10 px-2.5 py-1 text-xs font-medium text-[#0a1628]/45"
                                                        >
                                                            {player}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Link hint */}
                                        <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-[#1a4fd4] opacity-0 transition-opacity group-hover:opacity-100">
                                            Bekijk uitslagen
                                            <ChevronRight className="h-3 w-3" />
                                        </div>
                                    </a>
                                </Reveal>
                            ))}
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
                                tafeltennisvereniging van de regio. De eerste
                                twee trainingen zijn gratis — kom gerust langs
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

                {/* ═══ FOOTER ═══ */}
                <footer className="bg-white py-20">
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
