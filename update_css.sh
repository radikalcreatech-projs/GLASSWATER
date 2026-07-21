#!/bin/bash
cat << 'CSS' > src/index.css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

:root {
  --color-navy-base: #162744;
  --color-steel-blue-base: #2F4F6B;
  --color-concrete-gray-base: #8B939D;
  --color-light-gray-base: #F5F6F8;
  --color-gold-base: #C89B3C;
  --color-charcoal-base: #2E3135;
  --color-bg-body-base: #FFFFFF;
  --color-bg-card-base: #FFFFFF;
  --color-bg-section-base: #F5F6F8;
  --color-text-primary-base: #162744;
  --color-text-secondary-base: #2F4F6B;
}

.dark {
  --color-navy-base: #FFFFFF;
  --color-steel-blue-base: #E2E8F0;
  --color-concrete-gray-base: #8B939D;
  --color-light-gray-base: #1E293B; /* inverted light gray for borders */
  --color-gold-base: #C89B3C;
  --color-charcoal-base: #F8FAFC;
  --color-bg-body-base: #020617; /* Slate 950 */
  --color-bg-card-base: #0F172A; /* Slate 900 */
  --color-bg-section-base: #0F172A; 
  --color-text-primary-base: #F8FAFC;
  --color-text-secondary-base: #CBD5E1;
}

@theme {
  --color-navy: var(--color-navy-base);
  --color-steel-blue: var(--color-steel-blue-base);
  --color-concrete-gray: var(--color-concrete-gray-base);
  --color-light-gray: var(--color-light-gray-base);
  --color-gold: var(--color-gold-base);
  --color-charcoal: var(--color-charcoal-base);
  
  --color-bg-body: var(--color-bg-body-base);
  --color-bg-card: var(--color-bg-card-base);
  --color-bg-section: var(--color-bg-section-base);
  --color-text-primary: var(--color-text-primary-base);
  --color-text-secondary: var(--color-text-secondary-base);
  
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background-color: var(--color-bg-body);
}

.shadow-custom {
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}
.dark .shadow-custom {
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-in {
  animation: fadeInSlideUp 0.5s ease-out forwards;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
CSS
