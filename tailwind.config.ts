import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        brand: {
          from: "hsl(var(--brand-from))",
          to: "hsl(var(--brand-to))",
        },
        status: {
          approved: "hsl(var(--status-approved))",
          "approved-bg": "hsl(var(--status-approved-bg))",
          pending: "hsl(var(--status-pending))",
          "pending-bg": "hsl(var(--status-pending-bg))",
          rejected: "hsl(var(--status-rejected))",
          "rejected-bg": "hsl(var(--status-rejected-bg))",
          draft: "hsl(var(--status-draft))",
          "draft-bg": "hsl(var(--status-draft-bg))",
        },
        type: {
          project: "hsl(var(--type-project))",
          "project-bg": "hsl(var(--type-project-bg))",
          vacation: "hsl(var(--type-vacation))",
          "vacation-bg": "hsl(var(--type-vacation-bg))",
          sick: "hsl(var(--type-sick))",
          "sick-bg": "hsl(var(--type-sick-bg))",
          holiday: "hsl(var(--type-holiday))",
          "holiday-bg": "hsl(var(--type-holiday-bg))",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(to right, hsl(var(--brand-from)), hsl(var(--brand-to)))",
      },
      boxShadow: {
        brand:
          "0 4px 14px -2px hsl(var(--primary) / 0.15), 0 2px 6px -2px hsl(var(--primary) / 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
