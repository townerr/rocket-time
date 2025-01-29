"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  Smartphone, 
  Users, 
  Rocket,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Primary gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-500 opacity-25 dark:opacity-20" />
          </div>
          
          {/* Accent gradients */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500 to-indigo-400 blur-3xl opacity-20 dark:opacity-30 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-indigo-500 to-blue-500 blur-3xl opacity-20 dark:opacity-30 animate-pulse delay-300" />
        </div>
        
        <div className="container px-4 mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-8 text-sm font-medium px-6 py-2 bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90">
              <Rocket className="w-4 h-4 mr-2" />
              Welcome to RocketTime
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
              Time Management Made Simple
            </h1>
            
            <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-12 max-w-2xl mx-auto">
              Streamline your workforce management with our intuitive timesheet solution. Track time, manage leave, and boost productivity all in one place.
            </p>

            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400">
                <Link href="/api/auth/signin" className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-zinc-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Powerful features designed to make time tracking and management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-2xl transform transition-transform group-hover:scale-105" />
                <div className="relative p-8 space-y-4">
                  <feature.icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-zinc-900">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Workforce?</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12">
              Join thousands of companies already using RocketTime to streamline their time management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400">
                <Link href="/api/auth/signin" className="flex items-center">
                  Get Started
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    title: "Smart Time Tracking",
    description: "Effortlessly track time with our intuitive interface and automated suggestions.",
    icon: Clock,
  },
  {
    title: "Leave Management",
    description: "Streamline vacation and sick leave requests with automated approval workflows.",
    icon: Calendar,
  },
  {
    title: "Real-time Analytics",
    description: "Get instant insights into workforce productivity and project time allocation.",
    icon: BarChart3,
  },
  {
    title: "Mobile Access",
    description: "Track time and manage requests on the go with our mobile app.",
    icon: Smartphone,
  },
  {
    title: "Team Management",
    description: "Easily manage teams, departments, and approval hierarchies.",
    icon: Users,
  },
  {
    title: "Automated Reports",
    description: "Generate detailed reports for payroll, billing, and compliance.",
    icon: Rocket,
  },
];

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "5M+", label: "Hours Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];
