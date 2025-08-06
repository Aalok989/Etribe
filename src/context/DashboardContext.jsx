import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { getAuthHeaders } from '../utils/apiHeaders';
import { toast } from 'react-toastify';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Cache utility functions
const isDataFresh = (timestamp) => {
  return timestamp && (Date.now() - timestamp) < CACHE_DURATION;
};

const createCacheEntry = (data) => ({
  data,
  timestamp: Date.now()
});

export const DashboardProvider = ({ children }) => {
  // Cache states
  const [cache, setCache] = useState({
    members: { active: null, inactive: null, expired: null },
    events: { all: null, past: null, future: null },
    contacts: null,
    analytics: null,
    groupData: null
  });

  // Loading states
  const [loading, setLoading] = useState({
    members: false,
    events: false,
    contacts: false,
    analytics: false,
    groupData: false,
    initial: true
  });

  // Error states
  const [errors, setErrors] = useState({
    members: null,
    events: null,
    contacts: null,
    analytics: null,
    groupData: null
  });

  // Data states (computed from cache)
  const [data, setData] = useState({
    members: { active: [], inactive: [], expired: [] },
    events: { all: [], past: [], future: [] },
    contacts: [],
    analytics: [],
    groupData: {
      name: '',
      email: '',
      logo: '',
      signature: '',
      address: '',
      contact: '',
      website: ''
    },
    stats: {
      activeCount: 0,
      inactiveCount: 0,
      expiredCount: 0,
      totalEventsCount: 0,
      pastEventsCount: 0,
      upcomingEventsCount: 0
    }
  });

  // Generic error handler
  const handleError = useCallback((error, type) => {
    console.error(`Dashboard ${type} error:`, error);
    setErrors(prev => ({ ...prev, [type]: error.message || `Failed to load ${type}` }));
    // Don't show toast for initial loads to avoid spam
    if (!loading.initial) {
      toast.error(`Failed to refresh ${type}`);
    }
  }, [loading.initial]);

  // Fetch members data (active, inactive, expired)
  const fetchMembers = useCallback(async (force = false) => {
    const membersCache = cache.members;
    
    // Check if we have fresh cached data
    if (!force && 
        isDataFresh(membersCache.active?.timestamp) && 
        isDataFresh(membersCache.inactive?.timestamp) && 
        isDataFresh(membersCache.expired?.timestamp)) {
      return;
    }

    setLoading(prev => ({ ...prev, members: true }));
    setErrors(prev => ({ ...prev, members: null }));

    try {
      const uid = localStorage.getItem('uid') || '1';
      const headers = { ...getAuthHeaders() };

      const [activeRes, inactiveRes, expiredRes] = await Promise.all([
        api.post('/userDetail/active_members', { uid }, { headers }),
        api.post('/userDetail/not_members', { uid }, { headers }),
        api.post('/userDetail/membership_expired', { uid }, { headers })
      ]);

      const activeMembers = Array.isArray(activeRes.data) ? activeRes.data : activeRes.data.data || [];
      const inactiveMembers = Array.isArray(inactiveRes.data) ? inactiveRes.data : inactiveRes.data.data || [];
      const expiredMembers = Array.isArray(expiredRes.data) ? expiredRes.data : expiredRes.data.data || [];

      // Update cache
      setCache(prev => ({
        ...prev,
        members: {
          active: createCacheEntry(activeMembers),
          inactive: createCacheEntry(inactiveMembers),
          expired: createCacheEntry(expiredMembers)
        }
      }));

      // Update data state
      setData(prev => ({
        ...prev,
        members: {
          active: activeMembers,
          inactive: inactiveMembers,
          expired: expiredMembers
        },
        stats: {
          ...prev.stats,
          activeCount: activeMembers.length,
          inactiveCount: inactiveMembers.length,
          expiredCount: expiredMembers.length
        }
      }));

    } catch (error) {
      handleError(error, 'members');
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  }, [cache.members, handleError]);

  // Fetch events data (all, past, future)
  const fetchEvents = useCallback(async (force = false) => {
    const eventsCache = cache.events;
    
    // Check if we have fresh cached data
    if (!force && 
        isDataFresh(eventsCache.all?.timestamp) && 
        isDataFresh(eventsCache.past?.timestamp) && 
        isDataFresh(eventsCache.future?.timestamp)) {
      return;
    }

    setLoading(prev => ({ ...prev, events: true }));
    setErrors(prev => ({ ...prev, events: null }));

    try {
      const headers = { ...getAuthHeaders() };

      const [allRes, pastRes, futureRes] = await Promise.all([
        api.post('/event/index', {}, { headers }),
        api.post('/event/past', {}, { headers }),
        api.post('/event/future', {}, { headers })
      ]);

      // Helper function to extract events from various response formats
      const extractEvents = (response) => {
        if (Array.isArray(response.data?.data?.event)) return response.data.data.event;
        if (Array.isArray(response.data?.data?.events)) return response.data.data.events;
        if (Array.isArray(response.data?.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        if (response.data?.data && typeof response.data.data === 'object') return Object.values(response.data.data);
        return [];
      };

      const allEvents = extractEvents(allRes);
      const pastEvents = extractEvents(pastRes);
      const futureEvents = extractEvents(futureRes);

      // Update cache
      setCache(prev => ({
        ...prev,
        events: {
          all: createCacheEntry(allEvents),
          past: createCacheEntry(pastEvents),
          future: createCacheEntry(futureEvents)
        }
      }));

      // Update data state
      setData(prev => ({
        ...prev,
        events: {
          all: allEvents,
          past: pastEvents,
          future: futureEvents
        },
        stats: {
          ...prev.stats,
          totalEventsCount: allEvents.length,
          pastEventsCount: pastEvents.length,
          upcomingEventsCount: futureEvents.length
        }
      }));

    } catch (error) {
      handleError(error, 'events');
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  }, [cache.events, handleError]);

  // Fetch contacts data
  const fetchContacts = useCallback(async (force = false) => {
    // Check if we have fresh cached data
    if (!force && isDataFresh(cache.contacts?.timestamp)) {
      return;
    }

    setLoading(prev => ({ ...prev, contacts: true }));
    setErrors(prev => ({ ...prev, contacts: null }));

    try {
      const headers = { ...getAuthHeaders() };
      const response = await api.get('/contact', { headers });
      
      let contacts = [];
      if (response.data?.data?.contact && Array.isArray(response.data.data.contact)) {
        contacts = response.data.data.contact;
      } else if (Array.isArray(response.data?.data)) {
        contacts = response.data.data;
      } else if (Array.isArray(response.data)) {
        contacts = response.data;
      } else if (response.data?.data && typeof response.data.data === 'object') {
        contacts = Object.values(response.data.data);
      } else if (response.data?.contacts && Array.isArray(response.data.contacts)) {
        contacts = response.data.contacts;
      } else if (response.data?.contact && Array.isArray(response.data.contact)) {
        contacts = response.data.contact;
      }

      // Map contacts to consistent format
      const mappedContacts = contacts.map((contact, index) => ({
        id: contact.id || contact.contact_id || contact.contactId || index + 1,
        dept: contact.department || contact.dept || contact.role || contact.contact_department || 'General',
        name: contact.name || contact.person_name || contact.contact_name || contact.contactName || `Contact ${index + 1}`,
        contact: contact.contact || contact.phone || contact.phone_number || contact.mobile || contact.contact_number || contact.contact_no || '',
        email: contact.email || contact.email_address || contact.contact_email || contact.email_id || '',
        address: contact.address || contact.location || contact.contact_address || contact.address_line || '',
      }));

      // Update cache
      setCache(prev => ({
        ...prev,
        contacts: createCacheEntry(mappedContacts)
      }));

      // Update data state
      setData(prev => ({
        ...prev,
        contacts: mappedContacts
      }));

    } catch (error) {
      handleError(error, 'contacts');
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  }, [cache.contacts, handleError]);

  // Fetch group data
  const fetchGroupData = useCallback(async (force = false) => {
    // Check if we have fresh cached data
    if (!force && isDataFresh(cache.groupData?.timestamp)) {
      return;
    }

    setLoading(prev => ({ ...prev, groupData: true }));
    setErrors(prev => ({ ...prev, groupData: null }));

    try {
      const headers = { ...getAuthHeaders() };
      const response = await api.post('/groupSettings', {}, { headers });

      const backendData = response.data?.data || response.data || {};
      
      // Get API base URL from environment
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.etribes.ezcrm.site';
      
      // Process logo and signature URLs with correct API base URL
      const processedData = {
        name: backendData.name || '',
        email: backendData.email || '',
        logo: backendData.logo ? (backendData.logo.startsWith('http') ? backendData.logo : `${API_BASE_URL}/${backendData.logo}`) : '',
        signature: backendData.signature ? (backendData.signature.startsWith('http') ? backendData.signature : `${API_BASE_URL}/${backendData.signature}`) : '',
        address: backendData.address || '',
        contact: backendData.contact || '',
        website: backendData.website || ''
      };

      // Update cache
      setCache(prev => ({
        ...prev,
        groupData: createCacheEntry(processedData)
      }));

      // Update data state
      setData(prev => ({
        ...prev,
        groupData: processedData
      }));

    } catch (error) {
      handleError(error, 'groupData');
    } finally {
      setLoading(prev => ({ ...prev, groupData: false }));
    }
  }, [cache.groupData, handleError]);

  // Generate analytics data from members cache
  const generateAnalytics = useCallback(() => {
    const membersData = data.members;
    if (!membersData.active.length && !membersData.inactive.length && !membersData.expired.length) {
      return;
    }

    try {
      // Group by month using month index for accurate mapping
      const groupByMonth = (members) => {
        const monthMap = {};
        members.forEach(m => {
          const date = m.lct ? new Date(m.lct) : new Date();
          const monthIdx = date.getMonth();
          if (!monthMap[monthIdx]) monthMap[monthIdx] = 0;
          monthMap[monthIdx]++;
        });
        return monthMap;
      };

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const activeByMonth = groupByMonth(membersData.active);
      const inactiveByMonth = groupByMonth(membersData.inactive);
      const expiredByMonth = groupByMonth(membersData.expired);

      // Create chart data
      const analyticsData = [
        { month: '0', Active: 0, Inactive: 0, Expired: 0 },
        ...months.map((month, idx) => ({
          month,
          Active: activeByMonth[idx] || 0,
          Inactive: inactiveByMonth[idx] || 0,
          Expired: expiredByMonth[idx] || 0,
        }))
      ];

      // Update cache and data
      setCache(prev => ({
        ...prev,
        analytics: createCacheEntry(analyticsData)
      }));

      setData(prev => ({
        ...prev,
        analytics: analyticsData
      }));

    } catch (error) {
      console.error('Analytics generation error:', error);
    }
  }, [data.members]);

  // Update analytics when members data changes
  useEffect(() => {
    if (data.members.active.length || data.members.inactive.length || data.members.expired.length) {
      generateAnalytics();
    }
  }, [data.members, generateAnalytics]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(prev => ({ ...prev, initial: true }));
      
      // Load all data in parallel for fastest initial load
      await Promise.allSettled([
        fetchMembers(),
        fetchEvents(),
        fetchContacts(),
        fetchGroupData()
      ]);
      
      setLoading(prev => ({ ...prev, initial: false }));
    };

    loadInitialData();
  }, []); // Run only once on mount

  // Refresh functions
  const refreshMembers = useCallback(() => fetchMembers(true), [fetchMembers]);
  const refreshEvents = useCallback(() => fetchEvents(true), [fetchEvents]);
  const refreshContacts = useCallback(() => fetchContacts(true), [fetchContacts]);
  const refreshGroupData = useCallback(() => fetchGroupData(true), [fetchGroupData]);
  
  const refreshAll = useCallback(async () => {
    await Promise.allSettled([
      refreshMembers(),
      refreshEvents(),
      refreshContacts(),
      refreshGroupData()
    ]);
    toast.success('Dashboard data refreshed!');
  }, [refreshMembers, refreshEvents, refreshContacts, refreshGroupData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    setCache({
      members: { active: null, inactive: null, expired: null },
      events: { all: null, past: null, future: null },
      contacts: null,
      analytics: null,
      groupData: null
    });
  }, []);

  // Context value
  const value = {
    // Data
    data,
    loading,
    errors,
    
    // Cache status
    isCacheValid: {
      members: isDataFresh(cache.members.active?.timestamp) && 
               isDataFresh(cache.members.inactive?.timestamp) && 
               isDataFresh(cache.members.expired?.timestamp),
      events: isDataFresh(cache.events.all?.timestamp) && 
              isDataFresh(cache.events.past?.timestamp) && 
              isDataFresh(cache.events.future?.timestamp),
      contacts: isDataFresh(cache.contacts?.timestamp),
      analytics: isDataFresh(cache.analytics?.timestamp),
      groupData: isDataFresh(cache.groupData?.timestamp)
    },
    
    // Refresh functions
    refreshMembers,
    refreshEvents,
    refreshContacts,
    refreshGroupData,
    refreshAll,
    clearCache,
    
    // Quick access to stats
    stats: data.stats
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};