"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Rocket,
  ArrowRight,
  Clock,
  BarChart3,
  Users,
  ClipboardCheck,
  CheckCircle,
  Star,
  Calendar,
  Layers,
  LayoutDashboard,
  PieChart,
} from "lucide-react";

// Types
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

// Component for features
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => (
  <motion.div
    key={feature.title}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-indigo-50 dark:bg-indigo-950/50 rounded-xl p-6 shadow-sm"
  >
    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg flex items-center justify-center mb-4">
      {feature.icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
  </motion.div>
);

// Component for testimonials
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6"
  >
    <div className="flex items-center mb-4">
      <div className="mr-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} />
        </div>
      </div>
      <div>
        <div className="font-semibold">{testimonial.name}</div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {testimonial.position}, {testimonial.company}
        </div>
      </div>
    </div>
    <p className="text-zinc-600 dark:text-zinc-300 italic">"{testimonial.quote}"</p>
  </motion.div>
);

// Component for dashboard UI mockup
const DashboardMockup = () => (
  <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
    {/* Header */}
    <div className="bg-indigo-600 dark:bg-indigo-700 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <LayoutDashboard className="text-white mr-2 h-5 w-5" />
        <div className="text-white font-medium">RocketTime Dashboard</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-400"></div>
        <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
        <div className="h-2 w-2 rounded-full bg-green-400"></div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Hours This Week", value: "38.5", icon: <Clock className="w-4 h-4 text-indigo-500" /> },
          { label: "Projects", value: "12", icon: <Layers className="w-4 h-4 text-blue-500" /> },
          { label: "Team Members", value: "8", icon: <Users className="w-4 h-4 text-green-500" /> }
        ].map((stat: StatItem, i) => (
          <div key={i} className="bg-gray-50 dark:bg-zinc-700 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              {stat.icon}
            </div>
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium">Weekly Hours</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">This Month</div>
        </div>
        <div className="flex items-end justify-between h-20">
          {[35, 42, 28, 45].map((height, i) => (
            <div key={i} className="w-full mx-1">
              <div 
                className="bg-indigo-500 rounded-t-sm" 
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-center mt-1">W{i+1}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-gray-200 dark:border-gray-600 font-medium flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
          Recent Entries
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {[
            { project: "Website Redesign", hours: "4.5", date: "Today" },
            { project: "Mobile App", hours: "3.0", date: "Yesterday" },
            { project: "API Development", hours: "6.0", date: "May 15" }
          ].map((entry, i) => (
            <div key={i} className="p-3 flex justify-between items-center text-sm">
              <div>{entry.project}</div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500 dark:text-gray-400">{entry.date}</span>
                <span className="font-medium">{entry.hours}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Component for hero section
const HeroSection = ({ features }: { features: Feature[] }) => (
  <section className="relative px-4 py-20 md:py-32 overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />
      <div className="absolute top-1/4 right-0 h-96 w-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-0 h-96 w-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>
    
    <div className="container mx-auto max-w-7xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <Badge variant="outline" className="self-start mb-6 px-4 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <Rocket className="w-4 h-4 mr-2 text-indigo-600" />
            RocketTime Timesheets
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
              Track Time,
            </span>
            <br/>
            <span>Boost Productivity</span>
          </h1>
          
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-lg">
            The complete timesheet solution for modern teams. Streamline your time tracking, 
            project management, and team productivity in one simple platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md">
                <Link href="/api/auth/signin" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <Button size="lg" variant="outline" className="border-indigo-200 dark:border-indigo-800">
              View Demo
            </Button>
          </div>
          
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 overflow-hidden">
                  <Image src={`https://i.pravatar.cc/150?img=${60+i}`} alt={`User ${i}`} width={32} height={32} />
                </div>
              ))}
            </div>
            <div className="ml-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">1,000+</span> teams already using RocketTime
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

// Main component
export default function Home() {
  const features: Feature[] = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Tracking",
      description: "Easily track work hours across projects with a simple interface"
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Leave Management",
      description: "Request and approve time off with automated balance tracking"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Reporting & Analytics",
      description: "Gain insights into time allocation, costs, and productivity"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Management",
      description: "Manage your team's schedules, approvals, and workloads"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Thompson",
      position: "HR Director",
      company: "Acme Inc.",
      quote: "RocketTime has completely transformed our time tracking process. What used to take days now takes minutes.",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      name: "Michael Chen",
      position: "CTO",
      company: "TechFlow",
      quote: "The integration capabilities and developer API have made RocketTime essential to our workflow.",
      avatar: "https://i.pravatar.cc/150?img=59"
    },
    {
      name: "Alex Rivera",
      position: "Project Manager",
      company: "BuildRight Construction",
      quote: "Managing job site hours across multiple projects has never been easier. Our team loves the mobile app.",
      avatar: "https://i.pravatar.cc/150?img=68"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-zinc-950 dark:to-indigo-950">
      {/* Hero Section */}
      <HeroSection features={features} />

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Powerful features to streamline your time tracking and team management
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-indigo-50/50 dark:bg-indigo-950/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Join thousands of teams already using RocketTime to improve productivity
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your team's productivity?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams worldwide that are using RocketTime to streamline their time tracking and project management.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                <Link href="/register" className="flex items-center">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
