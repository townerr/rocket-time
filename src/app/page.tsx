"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Rocket,
  ArrowRight,
  Clock,
  BarChart3,
  Users,
  ClipboardCheck,
  Calendar,
  Layers,
  LayoutDashboard,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Check,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentClass: string;
  iconBgClass: string;
}

interface Testimonial {
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar: string;
  borderClass: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgClass: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  href: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const FEATURE_ACCENTS = [
  { accent: "border-l-chart-1", iconBg: "bg-brand-gradient" },
  { accent: "border-l-chart-2", iconBg: "bg-chart-2" },
  { accent: "border-l-chart-3", iconBg: "bg-chart-3" },
  { accent: "border-l-chart-4", iconBg: "bg-chart-4" },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => (
  <motion.div
    key={feature.title}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-100px" }}
    className={`rounded-xl border-l-4 bg-secondary p-6 shadow-brand ${feature.accentClass}`}
  >
    <div
      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white ${feature.iconBgClass}`}
    >
      {feature.icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
    <p className="text-muted-foreground">{feature.description}</p>
  </motion.div>
);

const STATS = [
  { value: "2M+", label: "Hours tracked" },
  { value: "1,000+", label: "Teams worldwide" },
  { value: "98%", label: "On-time submissions" },
  { value: "4.9/5", label: "Average rating" },
];

const StatsBar = () => (
  <section className="border-y border-border bg-muted py-12">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-brand-gradient md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const StepCard = ({ step, index }: { step: Step; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-80px" }}
    className="relative flex flex-col items-center text-center"
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white shadow-brand">
      {step.number}
    </div>
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
      {step.icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
    <p className="max-w-xs text-sm text-muted-foreground">{step.description}</p>
    {index < 2 && (
      <ArrowRight className="absolute -right-4 top-7 hidden h-5 w-5 text-primary/30 lg:block" />
    )}
  </motion.div>
);

const PricingCard = ({ tier }: { tier: PricingTier }) => (
  <div
    className={`flex flex-col rounded-xl border p-6 shadow-brand ${
      tier.highlighted
        ? "border-primary bg-card ring-2 ring-primary/20"
        : "border-border bg-card"
    }`}
  >
    {tier.highlighted && (
      <Badge className="mb-4 w-fit bg-brand-gradient text-white hover:opacity-90">
        Most Popular
      </Badge>
    )}
    <h3 className="text-xl font-semibold">{tier.name}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
    <div className="my-6">
      <span className="text-4xl font-bold">{tier.price}</span>
      <span className="text-muted-foreground">{tier.period}</span>
    </div>
    <ul className="mb-8 flex-1 space-y-3">
      {tier.features.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {feature}
        </li>
      ))}
    </ul>
    <Button
      variant={tier.highlighted ? "gradient" : "outline"}
      className="w-full"
      asChild
    >
      <Link href={tier.href}>{tier.cta}</Link>
    </Button>
  </div>
);

const SiteFooter = () => (
  <footer className="border-t border-border bg-muted py-12">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-bold">RocketTime</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Modern timesheet and leave management for teams that move fast.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#features" className="hover:text-primary">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-primary">
                How It Works
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-primary">
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-primary">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/api/auth/signin" className="hover:text-primary">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-primary">
                Register
              </Link>
            </li>
            <li>
              <Link href="/timesheet" className="hover:text-primary">
                Timesheet
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Get Started</h4>
          <p className="mb-4 text-sm text-muted-foreground">
            Free to try. No credit card required.
          </p>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/register">
              Start Free Trial
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} RocketTime. All rights reserved.
      </div>
    </div>
  </footer>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, margin: "-100px" }}
    className={`rounded-xl border-t-4 bg-card p-6 shadow-brand ${testimonial.borderClass}`}
  >
    <div className="mb-4 flex items-center">
      <div className="mr-4">
        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={48}
            height={48}
          />
        </div>
      </div>
      <div>
        <div className="font-semibold">{testimonial.name}</div>
        <div className="text-sm text-muted-foreground">
          {testimonial.position}, {testimonial.company}
        </div>
      </div>
    </div>
    <p className="italic text-muted-foreground">
      &quot;{testimonial.quote}&quot;
    </p>
  </motion.div>
);

const DashboardMockup = () => (
  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-brand">
    <div className="flex items-center justify-between bg-brand-gradient p-4">
      <div className="flex items-center">
        <LayoutDashboard className="mr-2 h-5 w-5 text-white" />
        <div className="font-medium text-white">RocketTime Dashboard</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-status-rejected"></div>
        <div className="h-2 w-2 rounded-full bg-status-pending"></div>
        <div className="h-2 w-2 rounded-full bg-status-approved"></div>
      </div>
    </div>

    <div className="p-4">
      <div className="mb-4 grid grid-cols-3 gap-4">
        {[
          {
            label: "Hours This Week",
            value: "38.5",
            icon: <Clock className="h-4 w-4 text-primary" />,
            bgClass: "bg-secondary",
          },
          {
            label: "Projects",
            value: "12",
            icon: <Layers className="h-4 w-4 text-chart-2" />,
            bgClass: "bg-accent",
          },
          {
            label: "Team Members",
            value: "8",
            icon: <Users className="h-4 w-4 text-chart-3" />,
            bgClass: "bg-type-holiday-bg",
          },
        ].map((stat: StatItem, i) => (
          <div key={i} className={`rounded-lg p-3 ${stat.bgClass}`}>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              {stat.icon}
            </div>
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-lg bg-secondary p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-medium">Weekly Hours</div>
          <div className="text-xs text-muted-foreground">This Month</div>
        </div>
        <div className="flex h-20 items-end justify-between">
          {[35, 42, 28, 45].map((height, i) => (
            <div key={i} className="mx-1 w-full">
              <div
                className="rounded-t-sm bg-brand-gradient"
                style={{ height: `${height}%` }}
              ></div>
              <div className="mt-1 text-center text-xs">W{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-muted">
        <div className="flex items-center border-b border-border p-3 font-medium">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          Recent Entries
        </div>
        <div className="divide-y divide-border">
          {[
            { project: "Website Redesign", hours: "4.5", date: "Today" },
            { project: "Mobile App", hours: "3.0", date: "Yesterday" },
            { project: "API Development", hours: "6.0", date: "May 15" },
          ].map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 text-sm"
            >
              <div>{entry.project}</div>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">{entry.date}</span>
                <span className="font-medium">{entry.hours}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HeroSection = () => (
  <section className="relative overflow-hidden bg-background px-4 py-20 md:py-32">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-brand-from opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-chart-2 opacity-20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-3 opacity-10 blur-3xl" />
    </div>

    <div className="container mx-auto max-w-7xl">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <Badge
            variant="outline"
            className="mb-6 self-start border-primary/20 bg-card/80 px-4 py-1.5 backdrop-blur-sm"
          >
            <Rocket className="mr-2 h-4 w-4 text-primary" />
            RocketTime Timesheets
          </Badge>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            <span className="text-brand-gradient">Track Time,</span>
            <br />
            <span>Boost Productivity</span>
          </h1>

          <p className="mb-8 max-w-lg text-lg text-muted-foreground">
            The complete timesheet solution for modern teams. Streamline your
            time tracking, project management, and team productivity in one
            simple platform.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="gradient" asChild>
                <Link href="/api/auth/signin" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-secondary"
              asChild
            >
              <a href="#how-it-works">View Demo</a>
            </Button>
          </div>

          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-card"
                >
                  <Image
                    src={`https://i.pravatar.cc/150?img=${60 + i}`}
                    alt={`User ${i}`}
                    width={32}
                    height={32}
                  />
                </div>
              ))}
            </div>
            <div className="ml-4 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">1,000+</span> teams
              already using RocketTime
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </div>
  </section>
);

export default function Home() {
  const features: Feature[] = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Tracking",
      description:
        "Easily track work hours across projects with a simple interface",
      accentClass: FEATURE_ACCENTS[0]!.accent,
      iconBgClass: FEATURE_ACCENTS[0]!.iconBg,
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Leave Management",
      description:
        "Request and approve time off with automated balance tracking",
      accentClass: FEATURE_ACCENTS[1]!.accent,
      iconBgClass: FEATURE_ACCENTS[1]!.iconBg,
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Reporting & Analytics",
      description:
        "Gain insights into time allocation, costs, and productivity",
      accentClass: FEATURE_ACCENTS[2]!.accent,
      iconBgClass: FEATURE_ACCENTS[2]!.iconBg,
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Management",
      description: "Manage your team's schedules, approvals, and workloads",
      accentClass: FEATURE_ACCENTS[3]!.accent,
      iconBgClass: FEATURE_ACCENTS[3]!.iconBg,
    },
  ];

  const steps: Step[] = [
    {
      number: "1",
      title: "Log your hours",
      description:
        "Fill in your weekly timesheet by project, work type, and day — it takes minutes, not hours.",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      number: "2",
      title: "Submit for approval",
      description:
        "Review your week and submit with one click. Track sick leave and vacation balances automatically.",
      icon: <Send className="h-5 w-5" />,
    },
    {
      number: "3",
      title: "Managers approve",
      description:
        "Managers review, approve, or reject timesheets from a central dashboard with full team analytics.",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "Free",
      period: " forever",
      description: "For individual employees getting started",
      features: [
        "Weekly timesheet entry",
        "Leave balance tracking",
        "Submission history",
        "Profile management",
      ],
      cta: "Get Started Free",
      href: "/register",
    },
    {
      name: "Team",
      price: "$8",
      period: " / user / mo",
      description: "For managers and growing teams",
      features: [
        "Everything in Starter",
        "Manager approvals workflow",
        "Employee management",
        "Analytics & reporting",
        "Custom work types",
      ],
      highlighted: true,
      cta: "Start Free Trial",
      href: "/register",
    },
  ];

  const faqs: FaqItem[] = [
    {
      question: "How do I submit my timesheet?",
      answer:
        "Log your hours for each day of the week, then click Submit Timesheet on the weekly view. Once submitted, your timesheet goes to your manager for approval.",
    },
    {
      question: "Can managers approve or reject submissions?",
      answer:
        "Yes. Managers have a dedicated Approvals page where they can review pending timesheets, approve them, or reject them with a single action.",
    },
    {
      question: "How does leave tracking work?",
      answer:
        "RocketTime tracks sick and vacation balances automatically. When you log leave hours on your timesheet, your remaining balance updates in your profile.",
    },
    {
      question: "Is RocketTime free to try?",
      answer:
        "Yes. You can create an account and start tracking time at no cost. Team features for managers are available on the Team plan with a free trial.",
    },
    {
      question: "What analytics are available for managers?",
      answer:
        "Managers can view hours by employee, project distribution, and timesheet status breakdowns over weekly, monthly, or quarterly periods.",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Thompson",
      position: "HR Director",
      company: "Acme Inc.",
      quote:
        "RocketTime has completely transformed our time tracking process. What used to take days now takes minutes.",
      avatar: "https://i.pravatar.cc/150?img=32",
      borderClass: "border-t-primary",
    },
    {
      name: "Michael Chen",
      position: "CTO",
      company: "TechFlow",
      quote:
        "The integration capabilities and developer API have made RocketTime essential to our workflow.",
      avatar: "https://i.pravatar.cc/150?img=59",
      borderClass: "border-t-chart-2",
    },
    {
      name: "Alex Rivera",
      position: "Project Manager",
      company: "BuildRight Construction",
      quote:
        "Managing job site hours across multiple projects has never been easier. Our team loves the mobile app.",
      avatar: "https://i.pravatar.cc/150?img=68",
      borderClass: "border-t-chart-3",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />

      <StatsBar />

      <section id="features" className="border-y border-border bg-card py-20 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need in One Place
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features to streamline your time tracking and team
              management
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-border bg-background py-20"
      >
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <Badge variant="outline" className="mb-4 border-primary/20">
              <Sparkles className="mr-1 h-3 w-3 text-primary" />
              Simple workflow
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How RocketTime Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From logging hours to manager approval — three steps, zero
              hassle
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join thousands of teams already using RocketTime to improve
              productivity
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-y border-border bg-card py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start free and upgrade when your team needs manager tools
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-y border-border bg-background py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center"
          >
            <Badge variant="outline" className="mb-4 border-primary/20">
              <HelpCircle className="mr-1 h-3 w-3 text-primary" />
              FAQ
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know before getting started
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="rounded-xl border bg-card px-4 shadow-brand">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-border bg-accent/40 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-2xl bg-brand-gradient p-8 text-center text-white shadow-brand md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to boost your team&apos;s productivity?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              Join thousands of teams worldwide that are using RocketTime to
              streamline their time tracking and project management.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/register" className="flex items-center">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
