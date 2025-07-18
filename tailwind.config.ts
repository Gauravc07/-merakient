import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        orange: {
          DEFAULT: "#FF6F00", // Solar Orange
          light: "#FFA726", // Tangerine
          dark: "#FF8C00", // Sunset Orange
        },
        black: {
          DEFAULT: "#0A0A0A", // Rich Jet Black
          charcoal: "#1E1E1E", // Charcoal Gray
          graphite: "#121212", // Dark Graphite
        },
        white: {
          DEFAULT: "#F5F5F5", // Soft White
          ash: "#AAAAAA", // Ash Gray
        },
        platinum: "#E5E4E2", // Platinum color
        "navbar-bg": "hsl(var(--navbar-bg))",
        "royal-red": "#8B0000", // Royal Red color
        "button-red": "#DC143C", // Crimson Red for button
        silver: "#C0C0C0", // Silver color
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif", "var(--font-oswald)"], // Added Oswald
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        orange: "0 4px 15px rgba(255, 111, 0, 0.3)",
        silver: "0 4px 15px rgba(192, 192, 192, 0.3)", // Silver shadow
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
