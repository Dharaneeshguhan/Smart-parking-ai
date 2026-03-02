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
  Star
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
        'Advanced machine learning predicts parking availability and demand patterns.',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description:
        'Get personalized parking suggestions using real-time intelligence.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Real-Time Booking',
      description:
        'Book instantly and secure your parking before you arrive.',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description:
        'Enterprise-grade payment security with multiple payment options.',
      color: 'text-red-600'
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#ffffff55,transparent)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Smart Adaptive Parking
            <span className="block text-primary-200 mt-2">
              Availability & Optimization
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            AI-powered predictions, real-time availability and intelligent parking recommendations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            {/* FIXED BUTTON */}
            <Link to="/search">
              <Button
                size="large"
                className="!bg-white !text-primary-700 hover:!bg-gray-100 shadow-xl font-bold"
              >
                Find Parking
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* FIXED BUTTON */}
            <Link to="/signup">
              <Button
                size="large"
                className="!border-2 !border-white !text-white hover:!bg-white hover:!text-primary-700 font-bold"
              >
                Register Parking Space
              </Button>
            </Link>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4">Why Choose SmartPark?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Built with AI to make parking smarter, faster and easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="hover:-translate-y-2 transition shadow-sm hover:shadow-2xl rounded-2xl">
                <CardContent>
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="text-center rounded-2xl shadow-sm hover:shadow-xl transition">
              <CardContent>
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-black">{stat.value}</h3>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
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