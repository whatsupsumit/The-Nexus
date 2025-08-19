/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['JetBrains Mono', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
        'serif': ['JetBrains Mono', 'monospace'],
        'arvo': ['JetBrains Mono', 'monospace'],
        'inter': ['JetBrains Mono', 'monospace'],
        'instrument': ['JetBrains Mono', 'monospace'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Greyish Black Theme
        'nexus-black': '#0a0a0a',
        'nexus-dark': '#1a1a1a',
        'nexus-grey': '#2a2a2a',
        'nexus-light-grey': '#3a3a3a',
        
        // Neon Red Accents
        'nexus-red': '#ff1423',
        'nexus-red-light': '#ff2a35',
        'nexus-red-dark': '#cc0f1c',
        'nexus-red-glow': 'rgba(255, 20, 35, 0.3)',
        
        // Text Colors
        'nexus-text': '#e5e5e5',
        'nexus-text-dark': '#b5b5b5',
        'nexus-text-light': '#ffffff',
      },
      backgroundImage: {
        'nexus-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        'nexus-red-gradient': 'linear-gradient(135deg, #ff1423 0%, #cc0f1c 100%)',
      },
      boxShadow: {
        'nexus-glow': '0 0 20px rgba(255, 20, 35, 0.3)',
        'nexus-glow-lg': '0 0 30px rgba(255, 20, 35, 0.5)',
      },
    },
  },
  plugins: [],
}