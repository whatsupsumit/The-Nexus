import React, { useState, useEffect } from 'react';
import { testTMDBConnectivity } from '../utils/vidsrcApi';

const TMDBStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkStatus = async () => {
    setStatus('checking');
    const isOnline = await testTMDBConnectivity();
    setStatus(isOnline ? 'online' : 'offline');
    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkStatus();
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return '🌐 TMDB API Online';
      case 'offline': return '📦 Using Offline Content';
      default: return '🔄 Checking...';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 text-sm">
      <div className={`font-['JetBrains_Mono',monospace] ${getStatusColor()}`}>
        {getStatusText()}
      </div>
      {lastCheck && (
        <div className="text-gray-400 text-xs mt-1">
          Last check: {lastCheck}
        </div>
      )}
      <button
        onClick={checkStatus}
        className="text-xs text-gray-300 hover:text-white mt-1 underline"
      >
        Refresh
      </button>
    </div>
  );
};

export default TMDBStatus;
