import React, { useState, useEffect } from 'react';
import {
  Building,
  Bell,
  CreditCard,
  Shield,
  Terminal,
  Zap,
  Save,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  Activity,
  DollarSign,
  Globe
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import Button from '../../components/Button';

const OwnerSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('owner_settings');
    return saved ? JSON.parse(saved) : {
      general: {
        businessName: 'Apex Parking Solutions',
        email: 'admin@apexparking.com',
        phone: '+91 98765 43210',
        address: '7th Cross St, Gandhipuram',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        zip: '641001',
        timezone: 'Asia/Kolkata',
        currency: 'INR'
      },
      notifications: {
        bookingAlerts: true,
        paymentAlerts: true,
        newReviews: true,
        weeklyReports: true,
        systemUpdates: false
      },
      payment: {
        taxRate: 18,
        lateFee: 25,
        cancellationFee: 10,
        refundPolicy: 'Flexible',
        autoPayout: true
      },
      security: {
        twoFactor: true,
        sessionTimeout: 60,
        apiAccess: true,
        ipWhitelist: ''
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('owner_settings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('owner_settings', JSON.stringify(settings));
      console.log('Operational settings updated:', settings);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Facility Profile', icon: Building },
    { id: 'notifications', label: 'Alert Protocols', icon: Bell },
    { id: 'payment', label: 'Financial Rules', icon: CreditCard },
    { id: 'security', label: 'Security Shield', icon: Shield },
    { id: 'integrations', label: 'API & Nodes', icon: Terminal }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise Console</h1>
            <p className="text-slate-500 font-medium mt-1">Global administrative control for your parking infrastructure</p>
          </div>
          <Button onClick={handleSave} loading={loading} className="px-10 h-12 shadow-xl shadow-primary-500/20">
            Apply Global Changes
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* TABS VERTICAL */}
          <div className="lg:w-64 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-4 ring-primary-500/10' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1">
            <Card hover={false} className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden rounded-[32px]">
              <CardContent className="p-10">
                {activeTab === 'general' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Business ID</label>
                        <input
                          value={settings.general.businessName}
                          onChange={(e) => handleChange('general', 'businessName', e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-slate-900 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Operations Email</label>
                        <input
                          value={settings.general.email}
                          onChange={(e) => handleChange('general', 'email', e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-slate-900 transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Coordinates (Address)</label>
                      <textarea
                        rows="3"
                        value={settings.general.address}
                        onChange={(e) => handleChange('general', 'address', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-slate-900 transition-all shadow-inner resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region</label>
                        <input value={settings.general.city} onChange={(e) => handleChange('general', 'city', e.target.value)} className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State Code</label>
                        <input value={settings.general.state} onChange={(e) => handleChange('general', 'state', e.target.value)} className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Postal Code</label>
                        <input value={settings.general.zip} onChange={(e) => handleChange('general', 'zip', e.target.value)} className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</label>
                        <select value={settings.general.currency} onChange={(e) => handleChange('general', 'currency', e.target.value)} className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold shadow-sm">
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {[
                      { id: 'bookingAlerts', title: 'New Reservation Signal', desc: 'Trigger alerts when a driver secures a slot' },
                      { id: 'paymentAlerts', title: 'Financial Inflow', desc: 'Notify on successful transaction processing' },
                      { id: 'newReviews', title: 'Reputation Feedback', desc: 'Alert when a driver leaves a rating or review' },
                      { id: 'weeklyReports', title: 'Data Synthesis', desc: 'Automated weekly performance analytics' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 rounded-[28px] border border-slate-100/50 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl transition-all ${settings.notifications[item.id] ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 text-slate-400'}`}>
                            <Bell className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900">{item.title}</h4>
                            <p className="text-sm font-medium text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleChange('notifications', item.id, !settings.notifications[item.id])}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${settings.notifications[item.id] ? 'bg-primary-500' : 'bg-slate-200'}`}
                        >
                          <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${settings.notifications[item.id] ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <Card className="bg-slate-50 border-none rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tax Implementation</p>
                        <div className="flex items-end gap-2">
                          <input type="number" value={settings.payment.taxRate} onChange={(e) => handleChange('payment', 'taxRate', e.target.value)} className="bg-transparent text-4xl font-black text-slate-900 w-24 border-b-2 border-slate-200 focus:border-primary-500 outline-none" />
                          <span className="text-xl font-bold text-slate-400 mb-1">%</span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-4">Calculated on gross reservation amount</p>
                      </Card>

                      <Card className="bg-slate-50 border-none rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Breach Penalty (Late Fee)</p>
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-bold text-slate-400 mb-1">₹</span>
                          <input type="number" value={settings.payment.lateFee} onChange={(e) => handleChange('payment', 'lateFee', e.target.value)} className="bg-transparent text-4xl font-black text-slate-900 w-24 border-b-2 border-slate-200 focus:border-primary-500 outline-none" />
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-4">Per 15 minutes past expiration</p>
                      </Card>

                      <Card className="bg-slate-50 border-none rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Revocation Fee</p>
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-bold text-slate-400 mb-1">₹</span>
                          <input type="number" value={settings.payment.cancellationFee} onChange={(e) => handleChange('payment', 'cancellationFee', e.target.value)} className="bg-transparent text-4xl font-black text-slate-900 w-24 border-b-2 border-slate-200 focus:border-primary-500 outline-none" />
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-4">Applied to driver cancellations</p>
                      </Card>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/10 rounded-2xl"><Zap className="h-8 w-8 text-amber-400" /></div>
                        <div>
                          <h4 className="text-xl font-bold">Automated Settlement</h4>
                          <p className="text-sm text-white/50">Funds are auto-disbursed every 24 hours</p>
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all whitespace-nowrap">Configure Payouts</button>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                        <h4 className="font-black text-blue-900 mb-2">Two-Factor Authentication</h4>
                        <p className="text-sm text-blue-700/70 mb-6">Require a hardware key or mobile code for every administrative action.</p>
                        <button
                          onClick={() => handleChange('security', 'twoFactor', !settings.security.twoFactor)}
                          className={`px-6 py-2 rounded-xl font-bold transition-all ${settings.security.twoFactor ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}
                        >
                          {settings.security.twoFactor ? 'Active' : 'Enable Shield'}
                        </button>
                      </div>

                      <div className="p-8 bg-purple-50/50 rounded-3xl border border-purple-100">
                        <h4 className="font-black text-purple-900 mb-2">Session Expiry</h4>
                        <p className="text-sm text-purple-700/70 mb-6">Automatically terminate inactive sessions to prevent unauthorized access.</p>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleChange('security', 'sessionTimeout', e.target.value)}
                          className="w-full bg-white px-4 py-2 rounded-xl font-bold text-purple-900 border border-purple-200 outline-none"
                        >
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="60">1 Hour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {[
                      { name: 'Stripe Gateway', status: 'Connected', logo: CreditCard },
                      { name: 'Google Maps API', status: 'Active', logo: Globe },
                      { name: 'Twilio SMS', status: 'Linked', logo: Smartphone },
                      { name: 'AWS Cloud Front', status: 'Protected', logo: Shield }
                    ].map(app => (
                      <div key={app.name} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-primary-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm"><app.logo className="h-6 w-6 text-slate-400 group-hover:text-primary-500" /></div>
                          <div>
                            <h4 className="font-bold text-slate-900">{app.name}</h4>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{app.status}</span>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600"><Terminal className="h-5 w-5" /></button>
                      </div>
                    ))}
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

export default OwnerSettingsPage;
