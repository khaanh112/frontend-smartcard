import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import {
  FaEye,
  FaQrcode,
  FaChartLine,
  FaMobileAlt,
  FaDesktop,
  FaDownload,
  FaSpinner,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ProfileAnalytics = ({ profileId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [profileId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/analytics/profiles/${profileId}/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/v1/analytics/profiles/${profileId}/analytics/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${profileId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export analytics');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!analytics) return null;

  const deviceData = [
    { name: 'Mobile', value: analytics.deviceBreakdown.mobile, color: '#3B82F6' },
    { name: 'Desktop', value: analytics.deviceBreakdown.desktop, color: '#10B981' },
  ];

  const sourceData = Object.entries(analytics.viewsBySource).map(([source, count]) => ({
    name: source.replace('_', ' '),
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Analytics</h2>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {exporting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaDownload />
          )}
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Views</p>
            <FaEye className="text-blue-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalViews}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        {/* Last 7 Days */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Last 7 Days</p>
            <FaChartLine className="text-green-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.viewsLast7Days}</p>
          <p className="text-xs text-gray-500 mt-1">Recent activity</p>
        </div>

        {/* Last 30 Days */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Last 30 Days</p>
            <FaChartLine className="text-purple-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.viewsLast30Days}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly views</p>
        </div>

        {/* QR Scans */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">QR Scans</p>
            <FaQrcode className="text-orange-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalQRScans}</p>
          <p className="text-xs text-gray-500 mt-1">
            {analytics.qrScansLast7Days} in last 7 days
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Views Over Time (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.viewsByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <FaMobileAlt className="text-blue-600" />
              <span className="text-sm text-gray-700">
                Mobile: {analytics.deviceBreakdown.mobile}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaDesktop className="text-green-600" />
              <span className="text-sm text-gray-700">
                Desktop: {analytics.deviceBreakdown.desktop}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Views by Source */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Views by Source</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sourceData.map((source) => (
            <div key={source.name} className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{source.count}</p>
              <p className="text-sm text-gray-600 mt-1 capitalize">{source.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Referrers */}
      {analytics.topReferrers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {analytics.topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{referrer.domain}</span>
                <span className="text-sm font-medium text-gray-900">{referrer.count} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAnalytics;