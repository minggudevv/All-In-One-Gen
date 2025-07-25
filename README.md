# AllInOneGen - The Ultimate Data Generator

AllInOneGen is a powerful and versatile web application built with Next.js and Firebase. It provides a suite of tools for instantly generating fake identities, disposable emails, and strong, secure passwords. The application is enhanced with AI features powered by Google's Gemini model via Genkit, and supports both English and Indonesian languages.

## ✨ Key Features

- **Fake Identity Generator**: Create complete, realistic identities with names, addresses, photos, and AI-generated backstories.
- **Disposable Email Generator**: Instantly generate random email addresses for temporary use.
- **Secure Password Generator**: Create strong, customizable, and secure passwords to protect your accounts.
- **AI-Powered Enhancements**:
  - **Backstory Generation**: Use AI to create plausible backstories for generated identities.
  - **Map Correction**: AI-powered feature to correct inaccurate map coordinates for a generated address.
- **User Dashboard**: Sign up and log in to save and manage your generated identities, emails, and passwords.
- **Interactive Map View**: Visualize the location of generated identities on an interactive map.
- **Multi-Language Support**: Fully localized in both English and Indonesian.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) for components.
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
- **Mapping**: [Leaflet](https://leafletjs.com/) for interactive maps.

## 🏁 Getting Started

This project is set up to run in the Firebase Studio environment.

### Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Lints the codebase for errors.

## 📂 Project Structure

- **`src/app`**: Contains all the pages and layouts, following the Next.js App Router structure.
- **`src/components`**: Reusable components, including UI components from ShadCN.
- **`src/ai`**: Contains all AI-related logic, including Genkit flows.
- **`src/context`**: React context providers for Authentication and Language.
- **`src/hooks`**: Custom React hooks.
- **`src/lib`**: Utility functions and Firebase configuration.
- **`src/locales`**: Translation files for multi-language support.
