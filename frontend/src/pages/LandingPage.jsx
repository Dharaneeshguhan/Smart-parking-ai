import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Brain,
  Zap,
  DollarSign,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms predict parking availability and demand patterns.',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'Get personalized parking suggestions based on your preferences and real-time data.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Real-Time Booking',
      description: 'Book parking spots instantly and secure your space before you arrive.',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options.',
      color: 'text-red-600'
    }
  ];

  const stats = [
    {
      value: '10,000+',
      label: 'Available Slots',
      icon: MapPin,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      value: '50,000+',
      label: 'Monthly Bookings',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      value: '95%',
      label: 'User Satisfaction',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      value: '24/7',
      label: 'Support Available',
      icon: Shield,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      content: 'SmartPark has revolutionized my daily commute. No more circling blocks looking for parking!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Parking Owner',
      content: 'My parking occupancy increased by 40% after joining SmartPark. The AI predictions are incredibly accurate.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Weekend Shopper',
      content: 'Love the real-time availability and easy booking process. Makes weekend trips stress-free!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Smart Adaptive Parking
              <span className="block text-primary-200">Availability & Optimization</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Experience the future of parking with AI-powered predictions, smart recommendations, and seamless real-time booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="large" className="bg-white text-primary-600 hover:bg-gray-100">
                  Find Parking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="large" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Register Parking Space
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SmartPark?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-driven platform makes parking smarter, faster, and more efficient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:scale-105 transition-transform duration-300">
                <CardContent>
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600">Join our growing community of smart parkers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color} mb-4`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">Real experiences from real users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Parking Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already made parking smarter and more efficient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="large" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/search">
              <Button size="large" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Explore Parking Options
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">SmartPark</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making parking smarter with AI-powered predictions and real-time availability.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 SmartPark. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
