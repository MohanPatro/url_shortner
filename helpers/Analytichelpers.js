const getClicksByDate = (redirects, last7Days) => {
    const recentRedirects = redirects.filter(r => r.timestamp > last7Days);
  
    return recentRedirects.reduce((acc, redirect) => {

      const date = redirect.timestamp.toISOString().split('T')[0];

      acc[date] = (acc[date] || 0) + 1;

      return acc;

    }, {});


  };
  


  const getOSAnalytics = (redirects, last7Days) => {

    const recentRedirects = redirects.filter(r => r.timestamp > last7Days);
  
    return recentRedirects.reduce((acc, redirect) => {

      const os = redirect.osType;

      if (!acc[os]) acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };

      acc[os].uniqueClicks++;
      acc[os].uniqueUsers.add(redirect.ipAddress);

      return acc;

    }, {});


  };



    const getDeviceAnalytics = (redirects, last7Days) => {

    const recentRedirects = redirects.filter(r => r.timestamp > last7Days);
  
    return recentRedirects.reduce((acc, redirect) => {
      
      const device = redirect.deviceType;

      if (!acc[device]) acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };

      acc[device].uniqueClicks++;
      acc[device].uniqueUsers.add(redirect.ipAddress);

      return acc;

    }, {});
  };



  
  const getUniqueUsersCount = (redirects) => {
    return new Set(redirects.map(r => r.ipAddress)).size;
  };


  
  module.exports = {
    getClicksByDate,
    getOSAnalytics,
    getDeviceAnalytics,
    getUniqueUsersCount,
  };
  