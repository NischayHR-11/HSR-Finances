# LendTracker Pro - React Frontend

A modern React application for managing lending portfolios with a professional dark theme interface.

## Features

- **Login Page**: Secure authentication with email/password
- **Dashboard**: Comprehensive lending portfolio overview with key metrics
- **Borrowers Management**: Track loans, payments, and borrower information
- **Notifications**: Payment reminders and overdue alerts
- **Settings**: User profile and application preferences

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **CSS3** - Custom styling with CSS Grid and Flexbox
- **Responsive Design** - Mobile-first approach

## Design Features

- **Dark Theme**: Professional dark interface with green accents
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Components**: Smooth animations and hover effects
- **Status Indicators**: Color-coded status badges and progress bars
- **Modern UI**: Clean, minimal design with excellent UX

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Login.jsx          # Authentication page
│   ├── Dashboard.jsx      # Main dashboard
│   ├── Borrowers.jsx      # Borrowers management
│   ├── Notifications.jsx  # Notifications center
│   ├── Settings.jsx       # User settings
│   ├── Layout.jsx         # Main layout wrapper
│   └── Sidebar.jsx        # Navigation sidebar
├── App.jsx                # Main app component
├── App.css               # App-specific styles
└── index.css             # Global styles and theme
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard
- Portfolio statistics (Total Money Lent, Monthly Interest, Active Loans, On-Time Rate)
- Recent borrowers with payment status
- Achievement badges
- Performance indicators

### Borrowers
- Searchable borrower list
- Filter by status (Current, Due, Overdue)
- Individual borrower cards with loan details
- Progress tracking and payment status

### Notifications
- Payment due alerts
- Overdue payment warnings
- Notification categories and priority levels
- Mark as read/unread functionality

### Settings
- Personal and business information
- Notification preferences
- Security settings
- Application preferences

## Theme Colors

- **Primary Background**: `#0f1419`
- **Secondary Background**: `#1a1f2e`
- **Card Background**: `#232937`
- **Green Accent**: `#22c55e`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#8a9ba8`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
