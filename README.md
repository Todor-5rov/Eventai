# eventaii - AI-Powered Event Planning Marketplace
A modern landing page for **eventaii**, an automated event planning marketplace that uses **AI** to instantly match event organizers with the best venues, caterers, and tech providers.

## 🚀 Features
* **Beautiful, Modern Design:** Gradient-based UI with smooth animations
* **Fully Responsive:** Mobile-first design that looks great on all devices
* **TypeScript:** Type-safe code throughout
* **Tailwind CSS:** Utility-first styling for rapid development
* **Next.js 14:** Latest React framework with App Router

## 📋 Prerequisites
* **Node.js** 18.x or higher
* **npm** or **yarn** package manager

## 🛠️ Installation
Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open your browser:
Navigate to `http://localhost:3000`

## 📦 Build for Production
```bash
npm run build
npm start
```

## 🎨 Project Structure
```
eventaii/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main landing page
│   │   └── globals.css          # Global styles and Tailwind imports
│   └── components/
│       ├── Navigation.tsx       # Header with navigation
│       ├── Hero.tsx             # Hero section with CTA
│       ├── HowItWorks.tsx       # 4-step process explanation
│       ├── Features.tsx         # Feature showcase grid
│       ├── ForOrganizers.tsx    # Benefits for event organizers
│       ├── ForVendors.tsx       # Benefits for service vendors
│       ├── CTA.tsx              # Call-to-action section
│       └── Footer.tsx           # Footer with links
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🎯 Landing Page Sections
* **Navigation:** Sticky header with mobile menu
* **Hero:** Eye-catching headline with stats and CTA buttons
* **How It Works:** 4-step process visualization
* **Features:** Grid of key platform capabilities
* **For Organizers:** Benefits for event planners
* **For Vendors:** Benefits for service providers
* **CTA:** Final call-to-action with gradient background
* **Footer:** Links and social media

## 🎨 Design System
### Colors
* **Primary:** Blue gradient (`from-primary-600` to `to-secondary-600`)
* **Secondary:** Purple/Pink gradient
* **Background:** White with subtle gray gradients

### Typography
* **Font:** Inter (Google Fonts)
* **Headings:** Bold, large scale
* **Body:** Regular weight, comfortable line height

## 🔧 Customization
### Update Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      secondary: { /* your colors */ },
    },
  },
}
```

## 📱 Responsive Breakpoints
* **Mobile:** < 640px
* **Tablet:** 640px - 1024px
* **Desktop:** > 1024px

### Other Platforms
1. `npm run build`
2. Deploy the `.next` folder to your hosting platform.

## 📄 License
Private project. All rights reserved.

## 🤝 Contributing
This is a private project. Contact the team for contribution guidelines.

---
Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
