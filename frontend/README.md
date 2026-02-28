# Smart Adaptive Parking Availability and Optimization System

A modern, responsive frontend for a smart parking management system built with React and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **AI-Powered Predictions**: Advanced machine learning algorithms for parking availability and demand patterns
- **Smart Recommendations**: Personalized parking suggestions based on preferences and real-time data
- **Real-Time Booking**: Instant parking spot booking and secure space reservation
- **Multi-Role Support**: Separate interfaces for Drivers and Parking Owners

### User Interface
- **Modern Design**: Clean, professional smart-city style UI with Tailwind CSS
- **Responsive Layout**: Fully responsive design for mobile, tablet, and desktop
- **Smooth Animations**: Subtle hover effects and transitions
- **Component-Based Architecture**: Reusable components for maintainability

### Pages & Features

#### 1. Landing Page
- Hero section with call-to-action buttons
- Feature highlights (AI prediction, smart recommendations, real-time booking)
- Statistics cards showing platform metrics
- User testimonials
- Footer with navigation links

#### 2. Authentication
- **Login Page**: Email/password authentication with social login options
- **Signup Page**: User registration with role selection (Driver/Owner)
- Form validation and error handling
- Password visibility toggle

#### 3. Dashboard (Driver)
- Real-time parking statistics
- Interactive charts (availability trends, demand predictions)
- Recent bookings overview
- AI insights and recommendations
- Quick access to search functionality

#### 4. Parking Search
- Advanced search with location-based filtering
- Filter options (price, distance, availability)
- Parking spot cards with detailed information
- Favorite parking spots
- Real-time availability status

#### 5. Booking System
- Date and time selection
- Duration picker
- Vehicle number input
- Payment method selection
- Price summary with service fees
- Free cancellation policy

#### 6. Owner Dashboard
- Parking slot management
- Revenue analytics and charts
- Booking management
- Occupancy statistics
- Earnings overview

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0**: Modern React with hooks and functional components
- **React Router 6.8.0**: Client-side routing
- **Tailwind CSS 3.2.7**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Recharts 2.5.0**: Chart library for data visualization
- **Axios 1.3.0**: HTTP client for API integration

### Development Tools
- **Vite 7.3.1**: Fast build tool and dev server
- **TypeScript 4.9.5**: Type safety and better developer experience
- **PostCSS & Autoprefixer**: CSS processing

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx     # Navigation bar
│   │   ├── Sidebar.jsx    # Dashboard sidebar
│   │   ├── Card.jsx       # Card component
│   │   └── Button.jsx     # Button component
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ParkingSearchPage.jsx
│   │   ├── BookingPage.jsx
│   │   └── OwnerDashboard.jsx
│   ├── services/          # API services
│   │   └── api.js         # Axios configuration and API endpoints
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component with routing
│   ├── index.css          # Tailwind CSS imports
│   └── main.jsx           # App entry point
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

### API Integration

The frontend is configured to work with a Spring Boot backend. Update the API endpoints in `src/services/api.js` to match your backend configuration.

### Tailwind CSS Customization

The Tailwind configuration includes:
- Custom color palette (primary, secondary)
- Extended animations
- Responsive breakpoints
- Custom component classes

## 🎨 Design System

### Colors
- **Primary Blue**: Used for main actions and navigation
- **Secondary Green**: Used for success states and secondary actions
- **Semantic Colors**: Red for errors, yellow for warnings, etc.

### Components
- **Cards**: Consistent shadow, border radius, and padding
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Consistent input styling with focus states
- **Navigation**: Responsive navbar with mobile menu

## 🔐 Authentication

The app includes:
- JWT token-based authentication
- Role-based access control (Driver/Owner)
- Protected routes
- Automatic token refresh
- Logout functionality

## 📱 Responsive Design

- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔄 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA capabilities
- [ ] Geolocation-based search
- [ ] Integration with payment gateways
- [ ] Advanced filtering options
- [ ] Parking spot images gallery
- [ ] Reviews and ratings system
