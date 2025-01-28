import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { RocketHomeIcon } from "~/components/icon";

// TODO: Fix responsiveness of nav and hero section
// TODO: Change features to be more relevant to RocketTime

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <Badge variant="outline" className="text-sm font-semibold px-4 py-1">
                🚀 Next-gen Time Tracking
              </Badge>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[#2e026d] to-[#15162c] bg-clip-text text-transparent">
                Transform Your Workforce Management
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                RocketTime streamlines employee time tracking, payroll management, and workforce analytics in one powerful platform.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/api/auth/signin">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-r from-[#2e026d] to-[#15162c] rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2e026d] to-[#15162c] rounded-full animate-pulse"></div>
                <div className="relative z-10">
                  <RocketHomeIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Launch Your Productivity?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already revolutionizing their workforce management with RocketTime.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/api/auth/signin">Start Your Free Trial Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    title: "Real-time Tracking",
    description: "Monitor employee hours with GPS verification and live updates",
    icon: ClockIcon,
  },
  {
    title: "Smart Scheduling",
    description: "Automated shift planning with conflict detection and notifications",
    icon: CalendarIcon,
  },
  {
    title: "Payroll Integration",
    description: "Seamless integration with popular payroll systems",
    icon: WalletIcon,
  },
  {
    title: "Advanced Analytics",
    description: "Detailed reports and workforce insights",
    icon: ChartIcon,
  },
  {
    title: "Mobile App",
    description: "Full functionality on iOS and Android devices",
    icon: MobileIcon,
  },
  {
    title: "24/7 Support",
    description: "Dedicated support team always ready to help",
    icon: SupportIcon,
  },
];

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function MobileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function SupportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9c0 .6-.4 1-1 1H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9c.6 0 1 .4 1 1Z" />
      <path d="M18 6h4" />
      <path d="M18 10h4" />
      <path d="M6 18a2 2 0 0 1-2-2v-1c0-.6.4-1 1-1h9c.6 0 1 .4 1 1v3c0 .6-.4 1-1 1Z" />
      <path d="M22 16h-4" />
      <path d="M22 20h-4" />
    </svg>
  );
}
