# 🧠 Matteo Tanzi — Personal Portfolio

A developer-focused personal website showcasing my resume, research, and projects. Built with ❤️ using **Next.js**, **Tailwind CSS**, and **Framer Motion**.

Live Site: [matteotanzi.dev](https://yourdomain.com) ← *(update once deployed)*

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Hosting**: [Vercel](https://vercel.com/) *(free hosting + CI/CD)*

---

## 📁 Project Structure

    my-portfolio/
    ├── public/
    │   ├── Matteo_Tanzi_Resume_2025.pdf
    │   └── assets/                     # Images, icons, screenshots
    │
    ├── src/
    │   ├── app/                        # App Router entry point
    │   │   ├── layout.tsx              # Global layout (with Navbar/Footer)
    │   │   ├── page.tsx                # Landing (home) page
    │   │   ├── globals.css             # Tailwind base styles
    │   │   ├── resume/
    │   │   │   └── page.tsx
    │   │   ├── projects/
    │   │   │   └── page.tsx
    │   │   ├── research/
    │   │   │   └── page.tsx
    │   │   ├── contact/
    │   │   │   └── page.tsx
    │
    │   ├── components/                 # Reusable UI components
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── SectionHeader.tsx
    │   │   ├── ResumeCard.tsx
    │   │   ├── ProjectCard.tsx
    │   │   └── AnimatedWrapper.tsx
    │
    │   ├── lib/                        # Utilities, animation variants, etc.
    │   │   └── framer.ts
    │
    │   ├── styles/                     # Optional for custom styles
    │       └── (custom CSS if needed)
    │
    ├── tailwind.config.js             # Tailwind configuration
    ├── postcss.config.js              # PostCSS plugins
    ├── next.config.ts                 # Next.js config with import aliases
    ├── tsconfig.json                  # TypeScript config (with paths)
    ├── package.json
    └── README.md

---

## 🧩 Features

- ⚡ Fully responsive design
- 🧱 Reusable components: `ResumeTimeline`, `ProjectCard`, `ResearchCard`
- 🎞️ Smooth animations with Framer Motion
- 📄 Downloadable resume
- ✨ Creative sections for BMO work, research, and personal projects

---

## 📬 Contact

Built by **Matteo Tanzi**  
📧 [matteotanzibusiness@gmail.com](mailto:matteotanzibusiness@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/matteospencertanzi/)

---

## 🛠 Development

```bash
# Clone the repo
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start the dev server
npm run dev

```
## 📝 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share it.

```text
MIT License

Copyright (c) 2025 Matteo Tanzi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...