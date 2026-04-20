import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  MapPin,
  Clock,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Brain,
  Zap,
  Star,
  Sparkles,
  TrendingUp,
  Navigation,
  Search
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';

const LandingPage = () => {

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description:
        'Advanced machine learning predicts parking availability and demand patterns with 95% accuracy.',
      color: 'from-indigo-500 to-purple-600',
      gradient: true
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description:
        'Get personalized parking suggestions using real-time intelligence and traffic analysis.',
      color: 'from-emerald-500 to-teal-600',
      gradient: true
    },
    {
      icon: Clock,
      title: 'Real-Time Booking',
      description:
        'Book instantly and secure your parking spot before you arrive with one-click confirmation.',
      color: 'from-amber-500 to-orange-600',
      gradient: true
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description:
        'Enterprise-grade payment security with multiple payment options and instant refunds.',
      color: 'from-rose-500 to-pink-600',
      gradient: true
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Available Slots', icon: MapPin, color: 'bg-blue-100 text-blue-600' },
    { value: '50,000+', label: 'Monthly Bookings', icon: Users, color: 'bg-green-100 text-green-600' },
    { value: '95%', label: 'User Satisfaction', icon: CheckCircle, color: 'bg-purple-100 text-purple-600' },
    { value: '24/7', label: 'Support Available', icon: Shield, color: 'bg-red-100 text-red-600' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      content: 'SmartPark changed my daily commute. No more searching endlessly.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Parking Owner',
      content: 'Occupancy increased by 40%. The AI prediction is surprisingly accurate.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Weekend Shopper',
      content: 'Real-time availability makes trips stress-free.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <div className="mb-8 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full border border-white/30">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
            <span className="text-white font-semibold">✨ Premium Parking Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-white">Smart Adaptive</span>
            <span className="block text-yellow-300 mt-2">Parking Solutions</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 font-medium">
            AI-powered predictions, real-time availability, and intelligent parking recommendations that transform your parking experience.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link to="/user/search">
              <Button
                size="large"
                className="!bg-white !text-indigo-600 hover:!bg-gray-100 shadow-2xl font-bold px-12 py-5 text-lg rounded-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Car className="w-6 h-6 mr-3" />
                Find Parking Now
              </Button>
            </Link>

            <Link to="/owner/dashboard">
              <Button
                size="large"
                className="!bg-transparent !text-white border-2 border-white hover:!bg-white hover:!text-indigo-600 shadow-2xl font-bold px-12 py-5 text-lg rounded-2xl transform hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                List Your Space
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="glass-container p-6 text-center transform hover:scale-105 transition-all duration-300">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white font-semibold mb-6">
              <Brain className="w-5 h-5 mr-2" />
              Premium Features
            </div>
            <h2 className="text-5xl font-black mb-6 gradient-text">Why Choose SmartPark?</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto font-medium">
              Built with cutting-edge AI to make parking smarter, faster, and effortlessly simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group">
                <div className="glass-container p-8 h-full hover:scale-105 transition-all duration-500 border-0 hover:shadow-3xl">
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-container p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Search</h3>
              <p className="text-white/80">Find available parking spots near your destination with real-time availability.</p>
            </div>
            <div className="glass-container p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2. Book</h3>
              <p className="text-white/80">Reserve your spot instantly with secure payment processing.</p>
            </div>
            <div className="glass-container p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Navigation className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3. Navigate</h3>
              <p className="text-white/80">Get turn-by-turn directions to your reserved parking spot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="rounded-2xl shadow-sm hover:shadow-xl transition">
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="italic text-slate-700 mb-4">"{t.content}"</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-4">
            Ready to Upgrade Your Parking Experience?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

            {/* FIXED BUTTON */}
            <Link to="/signup">
              <Button className="!bg-white !text-primary-700 hover:!bg-gray-100 font-bold">
                Get Started Free
              </Button>
            </Link>

            {/* FIXED BUTTON */}
            <Link to="/search">
              <Button className="!border-2 !border-white !text-white hover:!bg-white hover:!text-primary-700 font-bold">
                Explore Parking
              </Button>
            </Link>

          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12 text-center">
        <Car className="h-7 w-7 text-primary-400 mx-auto mb-3" />
        <p>© 2026 SmartPark. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;