import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Calendar,
  Download,
  Search,
  Filter,
  CreditCard,
  Receipt,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await parkingAPI.getPaymentHistory();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockPayments = [
    {
      id: 1,
      transactionId: 'TXN001',
      bookingId: 'BK001',
      parkingName: 'Downtown Plaza Parking',
      date: '2024-01-20',
      time: '14:30:00',
      amount: 24.00,
      paymentMethod: 'credit_card',
      status: 'completed',
      type: 'booking',
      cardType: 'Visa',
      cardLast4: '4242',
      description: '3 hours parking',
      createdAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      transactionId: 'TXN002',
      bookingId: 'BK002',
      parkingName: 'City Center Garage',
      date: '2024-01-18',
      time: '09:00:00',
      amount: 96.00,
      paymentMethod: 'wallet',
      status: 'completed',
      type: 'booking',
      description: '8 hours parking',
      createdAt: '2024-01-18T09:00:00Z'
    },
    {
      id: 3,
      transactionId: 'TXN003',
      bookingId: 'BK003',
      parkingName: 'Airport Parking Lot',
      date: '2024-01-25',
      time: '16:00:00',
      amount: 360.00,
      paymentMethod: 'credit_card',
      status: 'pending',
      type: 'booking',
      cardType: 'Mastercard',
      cardLast4: '8888',
      description: '24 hours parking',
      createdAt: '2024-01-25T16:00:00Z'
    },
    {
      id: 4,
      transactionId: 'TXN004',
      bookingId: 'BK004',
      parkingName: 'Shopping Mall Parking',
      date: '2024-01-15',
      time: '10:00:00',
      amount: 10.00,
      paymentMethod: 'credit_card',
      status: 'refunded',
      type: 'refund',
      cardType: 'Visa',
      cardLast4: '4242',
      description: 'Refund for cancelled booking',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 5,
      transactionId: 'TXN005',
      bookingId: null,
      parkingName: 'Wallet Top-up',
      date: '2024-01-10',
      time: '12:00:00',
      amount: 100.00,
      paymentMethod: 'credit_card',
      status: 'completed',
      type: 'topup',
      cardType: 'Visa',
      cardLast4: '4242',
      description: 'Wallet balance top-up',
      createdAt: '2024-01-10T12:00:00Z'
    },
    {
      id: 6,
      transactionId: 'TXN006',
      bookingId: 'BK005',
      parkingName: 'Beach Side Parking',
      date: '2024-01-22',
      time: '08:00:00',
      amount: 100.00,
      paymentMethod: 'wallet',
      status: 'failed',
      type: 'booking',
      description: '10 hours parking',
      createdAt: '2024-01-22T08:00:00Z'
    }
  ];

  const paymentsData = payments.length > 0 ? payments : mockPayments;

  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = payment.parkingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.date);
      const now = new Date();

      switch (dateFilter) {
        case 'today':
          matchesDate = paymentDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'wallet':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600 bg-blue-100';
      case 'refund':
        return 'text-green-600 bg-green-100';
      case 'topup':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownloadReceipt = (payment) => {
    // Generate and download receipt
    console.log('Downloading receipt for transaction:', payment.transactionId);
  };

  const getTotalSpent = () => {
    return paymentsData
      .filter(p => p.status === 'completed' && p.type !== 'refund')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalRefunded = () => {
    return paymentsData
      .filter(p => p.status === 'completed' && p.type === 'refund')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getPendingAmount = () => {
    return paymentsData
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      <div className="flex flex-col">
        <div className="flex-1">
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                  <p className="text-sm text-gray-600">View and manage your payment transactions</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Link to="/payment-methods">
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-gray-900">${getTotalSpent().toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600">${getTotalRefunded().toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Refunded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">${getPendingAmount().toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{paymentsData.length}</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by transaction ID, location, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input-field w-40"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="input-field w-40"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPayments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPayments.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">{payment.parkingName}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                <span className="ml-1 capitalize">{payment.status}</span>
                              </span>
                              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                                {payment.type}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Transaction ID: {payment.transactionId}
                              </div>
                              {payment.bookingId && (
                                <div className="flex items-center">
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Booking ID: {payment.bookingId}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(payment.date).toLocaleDateString()} at {payment.time}
                              </div>
                              <div className="flex items-center">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                <span className="ml-2 capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                                {payment.cardType && (
                                  <span className="ml-2">
                                    ({payment.cardType} •••• {payment.cardLast4})
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-sm text-gray-600">
                              {payment.description}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <div className="text-right">
                              <div className={`text-lg font-bold ${payment.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                {payment.type === 'refund' ? '-' : ''}${payment.amount.toFixed(2)}
                              </div>
                            </div>
                            {payment.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleDownloadReceipt(payment)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'You haven\'t made any transactions yet'}
                    </p>
                    <Link to="/search">
                      <Button>Find Parking</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
