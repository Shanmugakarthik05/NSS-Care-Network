// Mock API Layer using localStorage for demo purposes
// This works without any backend setup

interface StorageData {
  donors: any[];
  camps: any[];
  helpRequests: any[];
  volunteers: any[];
  bloodRequests: any[];
  reliefMissions: any[];
  reliefRequests: any[];
  volunteerMissionRegistrations: any[];
}

const STORAGE_KEY = 'nss-care-network-data';
const INIT_FLAG_KEY = 'nss-data-initialized';

// Get data from localStorage
const getData = (): StorageData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    donors: [],
    camps: [],
    helpRequests: [],
    volunteers: [],
    bloodRequests: [],
    reliefMissions: [],
    reliefRequests: [],
    volunteerMissionRegistrations: [],
  };
};

// Save data to localStorage
const saveData = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Simulate async operation
const asyncDelay = () => new Promise(resolve => setTimeout(resolve, 100));

// Apply filters to array
const applyFilters = (items: any[], filters: Record<string, any>) => {
  let result = items;
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== 'all') {
      if (key.includes('location') || key.includes('district') || key.includes('venue')) {
        result = result.filter(item => 
          item[key]?.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        result = result.filter(item => item[key] === value);
      }
    }
  }
  return result;
};

// Blood Donors API
export const donorsApi = {
  getAll: async (filters?: { bloodGroup?: string; district?: string }) => {
    await asyncDelay();
    const data = getData();
    let donors = data.donors;
    
    if (filters) {
      donors = applyFilters(donors, {
        bloodGroup: filters.bloodGroup,
        location: filters.district,
      });
    }
    
    return { donors };
  },

  add: async (donor: any) => {
    await asyncDelay();
    const data = getData();
    const newDonor = {
      id: generateId(),
      ...donor,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    data.donors.push(newDonor);
    saveData(data);
    return { success: true, donor: newDonor };
  },
};

// Emergency Help Requests API
export const helpRequestsApi = {
  getAll: async (filters?: { status?: string; location?: string }) => {
    await asyncDelay();
    const data = getData();
    let requests = data.helpRequests;
    
    if (filters) {
      requests = applyFilters(requests, filters);
    }
    
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { requests };
  },

  create: async (request: any) => {
    await asyncDelay();
    const data = getData();
    const newRequest = {
      id: generateId(),
      ...request,
      status: 'pending',
      urgent: request.urgent || false,
      createdAt: new Date().toISOString(),
    };
    data.helpRequests.push(newRequest);
    saveData(data);
    return { success: true, request: newRequest };
  },

  update: async (id: string, updateData: any) => {
    await asyncDelay();
    const data = getData();
    const index = data.helpRequests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    data.helpRequests[index] = {
      ...data.helpRequests[index],
      ...updateData,
      respondedAt: new Date().toISOString(),
    };
    saveData(data);
    return { success: true, request: data.helpRequests[index] };
  },
};

// Health Camps API
export const campsApi = {
  getAll: async (filters?: { type?: string; location?: string; upcoming?: boolean }) => {
    await asyncDelay();
    const data = getData();
    let camps = data.camps;
    
    if (filters) {
      if (filters.type && filters.type !== 'all') {
        camps = camps.filter(c => c.type === filters.type);
      }
      if (filters.location && filters.location !== 'all') {
        camps = camps.filter(c => c.venue?.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.upcoming) {
        camps = camps.filter(c => new Date(c.date) >= new Date());
      }
    }
    
    camps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return { camps };
  },

  create: async (camp: any) => {
    await asyncDelay();
    const data = getData();
    const newCamp = {
      id: generateId(),
      ...camp,
      spotsAvailable: camp.spotsAvailable || 0,
      totalSpots: camp.totalSpots || 0,
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    data.camps.push(newCamp);
    saveData(data);
    return { success: true, camp: newCamp };
  },

  register: async (campId: string, registration: any) => {
    await asyncDelay();
    const data = getData();
    const campIndex = data.camps.findIndex(c => c.id === campId);
    if (campIndex === -1) throw new Error('Camp not found');
    
    const camp = data.camps[campIndex];
    if (camp.spotsAvailable <= 0) throw new Error('No spots available');
    
    camp.registrations = camp.registrations || [];
    camp.registrations.push({ ...registration, registeredAt: new Date().toISOString() });
    camp.spotsAvailable = camp.spotsAvailable - 1;
    
    saveData(data);
    return { success: true, camp };
  },
};

// Volunteers API
export const volunteersApi = {
  getAll: async (college?: string) => {
    await asyncDelay();
    const data = getData();
    let volunteers = data.volunteers;
    
    if (college) {
      volunteers = volunteers.filter(v => v.college === college);
    }
    
    return { volunteers };
  },

  add: async (volunteer: any) => {
    await asyncDelay();
    const data = getData();
    const newVolunteer = {
      id: generateId(),
      ...volunteer,
      joinedAt: new Date().toISOString(),
      hoursServed: 0,
      campsAttended: 0,
    };
    data.volunteers.push(newVolunteer);
    saveData(data);
    return { success: true, volunteer: newVolunteer };
  },

  update: async (id: string, updateData: any) => {
    await asyncDelay();
    const data = getData();
    const index = data.volunteers.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Volunteer not found');
    
    data.volunteers[index] = { ...data.volunteers[index], ...updateData };
    saveData(data);
    return { success: true, volunteer: data.volunteers[index] };
  },
};

// Volunteer Assignments API
export const volunteerAssignmentsApi = {
  getAll: async (filters?: { volunteerId?: string; campId?: string; college?: string }) => {
    await asyncDelay();
    return { assignments: [] };
  },

  create: async (assignment: any) => {
    await asyncDelay();
    return { success: true };
  },

  markAttendance: async (id: string, hoursServed: number) => {
    await asyncDelay();
    return { success: true };
  },
};

// Blood Requests API (Hospital)
export const bloodRequestsApi = {
  getAll: async (filters?: { hospital?: string; status?: string }) => {
    await asyncDelay();
    const data = getData();
    let requests = data.bloodRequests;
    
    if (filters) {
      requests = applyFilters(requests, filters);
    }
    
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { requests };
  },

  create: async (request: any) => {
    await asyncDelay();
    const data = getData();
    const newRequest = {
      id: generateId(),
      ...request,
      urgent: request.urgent || false,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    data.bloodRequests.push(newRequest);
    saveData(data);
    return { success: true, request: newRequest };
  },
};

// Stats API
export const statsApi = {
  getAll: async () => {
    await asyncDelay();
    const data = getData();
    
    const stats = {
      totalDonors: data.donors.length,
      totalCamps: data.camps.length,
      upcomingCamps: data.camps.filter(c => new Date(c.date) >= new Date()).length,
      totalVolunteers: data.volunteers.length,
      totalHoursServed: data.volunteers.reduce((sum, v) => sum + (v.hoursServed || 0), 0),
      activeHelpRequests: data.helpRequests.filter(r => r.status === 'pending').length,
    };
    
    return { stats };
  },
};

// Relief Missions API (Disaster Relief)
export const reliefMissionsApi = {
  getAll: async (filters?: { status?: string; type?: string; district?: string }) => {
    await asyncDelay();
    const data = getData();
    let missions = data.reliefMissions;
    
    if (filters) {
      missions = applyFilters(missions, filters);
    }
    
    return { missions };
  },

  create: async (mission: any) => {
    await asyncDelay();
    const data = getData();
    const newMission = {
      id: generateId(),
      ...mission,
      createdAt: new Date().toISOString(),
    };
    data.reliefMissions.push(newMission);
    saveData(data);
    return { success: true, mission: newMission };
  },

  update: async (id: string, updateData: any) => {
    await asyncDelay();
    const data = getData();
    const index = data.reliefMissions.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Mission not found');
    
    data.reliefMissions[index] = {
      ...data.reliefMissions[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    saveData(data);
    return { success: true, mission: data.reliefMissions[index] };
  },

  getById: async (id: string) => {
    await asyncDelay();
    const data = getData();
    const mission = data.reliefMissions.find(m => m.id === id);
    if (!mission) throw new Error('Mission not found');
    return { mission };
  },
};

// Relief Requests API (Public Help Requests)
export const reliefRequestsApi = {
  getAll: async (filters?: { status?: string; urgency?: string; district?: string }) => {
    await asyncDelay();
    const data = getData();
    let requests = data.reliefRequests;
    
    if (filters) {
      requests = applyFilters(requests, filters);
    }
    
    return { requests };
  },

  create: async (request: any) => {
    await asyncDelay();
    const data = getData();
    const newRequest = {
      id: generateId(),
      ...request,
      createdAt: new Date().toISOString(),
    };
    data.reliefRequests.push(newRequest);
    saveData(data);
    return { success: true, request: newRequest };
  },

  update: async (id: string, updateData: any) => {
    await asyncDelay();
    const data = getData();
    const index = data.reliefRequests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    data.reliefRequests[index] = {
      ...data.reliefRequests[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    saveData(data);
    return { success: true, request: data.reliefRequests[index] };
  },
};

// Volunteer Mission Registrations API
export const volunteerMissionRegistrationsApi = {
  getAll: async (filters?: { missionId?: string; status?: string; college?: string }) => {
    await asyncDelay();
    const data = getData();
    let registrations = data.volunteerMissionRegistrations;
    
    if (filters) {
      registrations = applyFilters(registrations, filters);
    }
    
    return { registrations };
  },

  create: async (registration: any) => {
    await asyncDelay();
    const data = getData();
    const newRegistration = {
      id: generateId(),
      ...registration,
      createdAt: new Date().toISOString(),
    };
    data.volunteerMissionRegistrations.push(newRegistration);
    saveData(data);
    return { success: true, registration: newRegistration };
  },

  update: async (id: string, updateData: any) => {
    await asyncDelay();
    const data = getData();
    const index = data.volunteerMissionRegistrations.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Registration not found');
    
    data.volunteerMissionRegistrations[index] = {
      ...data.volunteerMissionRegistrations[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    saveData(data);
    return { success: true, registration: data.volunteerMissionRegistrations[index] };
  },
};

// Initialize sample data
export const initSampleData = async () => {
  await asyncDelay();
  
  // Check if already initialized
  if (localStorage.getItem(INIT_FLAG_KEY) === 'true') {
    return { success: true, message: 'Sample data already initialized' };
  }
  
  const sampleData: StorageData = {
    donors: [
      {
        id: 'donor-1',
        name: 'Rahul Sharma',
        bloodGroup: 'O+',
        location: 'Andheri West, Mumbai',
        college: 'Mumbai University NSS Unit',
        phone: '9876543210',
        verified: true,
        lastDonation: 'Aug 15, 2025',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'donor-2',
        name: 'Priya Patel',
        bloodGroup: 'O+',
        location: 'Koramangala, Bangalore',
        college: 'Bangalore Institute of Technology',
        phone: '9123456789',
        verified: true,
        lastDonation: 'Sep 2, 2025',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'donor-3',
        name: 'Amit Kumar',
        bloodGroup: 'A+',
        location: 'Powai, Mumbai',
        college: 'IIT Bombay NSS Chapter',
        phone: '9988776655',
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ],
    camps: [
      {
        id: 'camp-1',
        title: 'Blood Donation Drive',
        type: 'Blood Donation',
        date: '2025-11-12',
        time: '9:00 AM - 4:00 PM',
        venue: 'City College Auditorium, Mumbai',
        organizer: 'Mumbai City College NSS Unit',
        organizerType: 'college',
        image: 'https://images.unsplash.com/photo-1746806942689-f8966f63ed75?w=1080',
        spotsAvailable: 45,
        totalSpots: 100,
        registrations: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'camp-2',
        title: 'Free Eye Checkup Camp',
        type: 'Eye Care',
        date: '2025-11-15',
        time: '10:00 AM - 5:00 PM',
        venue: 'District Hospital, Pune',
        organizer: 'Pune District Hospital',
        organizerType: 'hospital',
        image: 'https://images.unsplash.com/photo-1589104759909-e355f8999f7e?w=1080',
        spotsAvailable: 30,
        totalSpots: 50,
        registrations: [],
        createdAt: new Date().toISOString(),
      },
    ],
    helpRequests: [
      {
        id: 'help-1',
        name: 'Emergency Patient',
        phone: '9123456789',
        location: 'Andheri, Mumbai',
        helpType: 'Blood Requirement',
        description: 'O+ blood needed urgently for surgery',
        status: 'pending',
        urgent: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    volunteers: [],
    bloodRequests: [],
    reliefMissions: [
      {
        id: 'mission-1',
        title: 'Flood Relief Mission – Thanjavur',
        type: 'flood',
        status: 'active',
        location: 'Thanjavur Town, South Zone',
        district: 'Thanjavur',
        startDate: '2025-11-12',
        endDate: '2025-11-15',
        description: 'Emergency flood relief operation providing food, medical aid, and shelter to affected families in Thanjavur district.',
        organizedBy: 'NSS Care Network + Thanjavur District Administration',
        contactPerson: 'Dr. Karthik Murugan',
        contactPhone: '98765 32100',
        volunteers: [
          { type: 'Food Preparation', needed: 20, assigned: 12 },
          { type: 'Medical Team', needed: 5, assigned: 5 },
          { type: 'Supply Transport', needed: 8, assigned: 6 },
          { type: 'Relief Distribution', needed: 15, assigned: 10 },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'mission-2',
        title: 'Cyclone Recovery – Coastal Tamil Nadu',
        type: 'cyclone',
        status: 'active',
        location: 'Coastal Villages, Kanyakumari',
        district: 'Kanyakumari',
        startDate: '2025-11-10',
        endDate: '2025-11-18',
        description: 'Post-cyclone recovery mission providing shelter, food, and medical assistance to coastal villages.',
        organizedBy: 'NSS Care Network + Tamil Nadu State Emergency',
        contactPerson: 'Priya Sundaram',
        contactPhone: '91234 56789',
        volunteers: [
          { type: 'Shelter Setup', needed: 25, assigned: 18 },
          { type: 'Medical Team', needed: 10, assigned: 7 },
          { type: 'Food Distribution', needed: 30, assigned: 22 },
          { type: 'Counseling', needed: 8, assigned: 5 },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    reliefRequests: [],
    volunteerMissionRegistrations: [],
  };
  
  saveData(sampleData);
  localStorage.setItem(INIT_FLAG_KEY, 'true');
  
  return { success: true, message: 'Sample data initialized successfully' };
};
