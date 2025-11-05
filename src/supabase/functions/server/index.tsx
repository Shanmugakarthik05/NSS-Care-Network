import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fa4fa155/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== BLOOD DONORS ====================

// Get all blood donors with filters
app.get("/make-server-fa4fa155/donors", async (c) => {
  try {
    const bloodGroup = c.req.query("bloodGroup");
    const district = c.req.query("district");
    
    const allDonors = await kv.getByPrefix("donor:");
    
    let filteredDonors = allDonors;
    
    if (bloodGroup) {
      filteredDonors = filteredDonors.filter((d: any) => d.bloodGroup === bloodGroup);
    }
    
    if (district) {
      filteredDonors = filteredDonors.filter((d: any) => 
        d.location.toLowerCase().includes(district.toLowerCase())
      );
    }
    
    return c.json({ donors: filteredDonors });
  } catch (error) {
    console.log(`Error fetching donors: ${error}`);
    return c.json({ error: "Failed to fetch donors" }, 500);
  }
});

// Add new blood donor
app.post("/make-server-fa4fa155/donors", async (c) => {
  try {
    const donor = await c.req.json();
    const donorId = `donor:${Date.now()}`;
    
    const donorData = {
      id: donorId,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      location: donor.location,
      college: donor.college,
      phone: donor.phone,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(donorId, donorData);
    
    return c.json({ success: true, donor: donorData });
  } catch (error) {
    console.log(`Error adding donor: ${error}`);
    return c.json({ error: "Failed to add donor" }, 500);
  }
});

// ==================== EMERGENCY HELP REQUESTS ====================

// Get all help requests
app.get("/make-server-fa4fa155/help-requests", async (c) => {
  try {
    const status = c.req.query("status");
    const location = c.req.query("location");
    
    const allRequests = await kv.getByPrefix("help:");
    
    let filteredRequests = allRequests;
    
    if (status) {
      filteredRequests = filteredRequests.filter((r: any) => r.status === status);
    }
    
    if (location) {
      filteredRequests = filteredRequests.filter((r: any) => 
        r.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Sort by creation date, newest first
    filteredRequests.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ requests: filteredRequests });
  } catch (error) {
    console.log(`Error fetching help requests: ${error}`);
    return c.json({ error: "Failed to fetch help requests" }, 500);
  }
});

// Create new help request
app.post("/make-server-fa4fa155/help-requests", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `help:${Date.now()}`;
    
    const helpRequest = {
      id: requestId,
      name: request.name,
      phone: request.phone,
      location: request.location,
      helpType: request.helpType,
      description: request.description,
      status: "pending",
      urgent: request.urgent || false,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(requestId, helpRequest);
    
    return c.json({ success: true, request: helpRequest });
  } catch (error) {
    console.log(`Error creating help request: ${error}`);
    return c.json({ error: "Failed to create help request" }, 500);
  }
});

// Update help request status
app.put("/make-server-fa4fa155/help-requests/:id", async (c) => {
  try {
    const requestId = c.req.param("id");
    const { status, respondedBy } = await c.req.json();
    
    const request = await kv.get(requestId);
    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }
    
    const updatedRequest = {
      ...request,
      status,
      respondedBy,
      respondedAt: new Date().toISOString(),
    };
    
    await kv.set(requestId, updatedRequest);
    
    return c.json({ success: true, request: updatedRequest });
  } catch (error) {
    console.log(`Error updating help request: ${error}`);
    return c.json({ error: "Failed to update help request" }, 500);
  }
});

// ==================== HEALTH CAMPS ====================

// Get all health camps
app.get("/make-server-fa4fa155/camps", async (c) => {
  try {
    const type = c.req.query("type");
    const location = c.req.query("location");
    const upcoming = c.req.query("upcoming");
    
    const allCamps = await kv.getByPrefix("camp:");
    
    let filteredCamps = allCamps;
    
    if (type && type !== "all") {
      filteredCamps = filteredCamps.filter((camp: any) => camp.type === type);
    }
    
    if (location && location !== "all") {
      filteredCamps = filteredCamps.filter((camp: any) => 
        camp.venue.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (upcoming === "true") {
      const today = new Date();
      filteredCamps = filteredCamps.filter((camp: any) => 
        new Date(camp.date) >= today
      );
    }
    
    // Sort by date
    filteredCamps.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return c.json({ camps: filteredCamps });
  } catch (error) {
    console.log(`Error fetching camps: ${error}`);
    return c.json({ error: "Failed to fetch camps" }, 500);
  }
});

// Create new health camp
app.post("/make-server-fa4fa155/camps", async (c) => {
  try {
    const camp = await c.req.json();
    const campId = `camp:${Date.now()}`;
    
    const campData = {
      id: campId,
      title: camp.title,
      type: camp.type,
      date: camp.date,
      time: camp.time,
      venue: camp.venue,
      organizer: camp.organizer,
      organizerType: camp.organizerType,
      image: camp.image,
      spotsAvailable: camp.spotsAvailable || 0,
      totalSpots: camp.totalSpots || 0,
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(campId, campData);
    
    return c.json({ success: true, camp: campData });
  } catch (error) {
    console.log(`Error creating camp: ${error}`);
    return c.json({ error: "Failed to create camp" }, 500);
  }
});

// Register for a camp
app.post("/make-server-fa4fa155/camps/:id/register", async (c) => {
  try {
    const campId = c.req.param("id");
    const registration = await c.req.json();
    
    const camp = await kv.get(campId);
    if (!camp) {
      return c.json({ error: "Camp not found" }, 404);
    }
    
    if (camp.spotsAvailable <= 0) {
      return c.json({ error: "No spots available" }, 400);
    }
    
    const registrationData = {
      name: registration.name,
      phone: registration.phone,
      email: registration.email,
      registeredAt: new Date().toISOString(),
    };
    
    const updatedCamp = {
      ...camp,
      registrations: [...(camp.registrations || []), registrationData],
      spotsAvailable: camp.spotsAvailable - 1,
    };
    
    await kv.set(campId, updatedCamp);
    
    return c.json({ success: true, camp: updatedCamp });
  } catch (error) {
    console.log(`Error registering for camp: ${error}`);
    return c.json({ error: "Failed to register for camp" }, 500);
  }
});

// ==================== VOLUNTEERS ====================

// Get volunteers by college
app.get("/make-server-fa4fa155/volunteers", async (c) => {
  try {
    const college = c.req.query("college");
    
    let volunteers = await kv.getByPrefix("volunteer:");
    
    if (college) {
      volunteers = volunteers.filter((v: any) => v.college === college);
    }
    
    return c.json({ volunteers });
  } catch (error) {
    console.log(`Error fetching volunteers: ${error}`);
    return c.json({ error: "Failed to fetch volunteers" }, 500);
  }
});

// Add new volunteer
app.post("/make-server-fa4fa155/volunteers", async (c) => {
  try {
    const volunteer = await c.req.json();
    const volunteerId = `volunteer:${Date.now()}`;
    
    const volunteerData = {
      id: volunteerId,
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      college: volunteer.college,
      bloodGroup: volunteer.bloodGroup,
      joinedAt: new Date().toISOString(),
      hoursServed: 0,
      campsAttended: 0,
    };
    
    await kv.set(volunteerId, volunteerData);
    
    return c.json({ success: true, volunteer: volunteerData });
  } catch (error) {
    console.log(`Error adding volunteer: ${error}`);
    return c.json({ error: "Failed to add volunteer" }, 500);
  }
});

// ==================== BLOOD REQUESTS (HOSPITAL) ====================

// Get blood requests
app.get("/make-server-fa4fa155/blood-requests", async (c) => {
  try {
    const hospital = c.req.query("hospital");
    const status = c.req.query("status");
    
    let requests = await kv.getByPrefix("bloodreq:");
    
    if (hospital) {
      requests = requests.filter((r: any) => r.hospital === hospital);
    }
    
    if (status) {
      requests = requests.filter((r: any) => r.status === status);
    }
    
    // Sort by creation date, newest first
    requests.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ requests });
  } catch (error) {
    console.log(`Error fetching blood requests: ${error}`);
    return c.json({ error: "Failed to fetch blood requests" }, 500);
  }
});

// Create blood request
app.post("/make-server-fa4fa155/blood-requests", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `bloodreq:${Date.now()}`;
    
    const bloodRequest = {
      id: requestId,
      bloodGroup: request.bloodGroup,
      units: request.units,
      hospital: request.hospital,
      urgent: request.urgent || false,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(requestId, bloodRequest);
    
    return c.json({ success: true, request: bloodRequest });
  } catch (error) {
    console.log(`Error creating blood request: ${error}`);
    return c.json({ error: "Failed to create blood request" }, 500);
  }
});

// ==================== ANALYTICS / STATS ====================

// Get dashboard stats
app.get("/make-server-fa4fa155/stats", async (c) => {
  try {
    const donors = await kv.getByPrefix("donor:");
    const camps = await kv.getByPrefix("camp:");
    const volunteers = await kv.getByPrefix("volunteer:");
    const helpRequests = await kv.getByPrefix("help:");
    
    const upcomingCamps = camps.filter((camp: any) => 
      new Date(camp.date) >= new Date()
    );
    
    const totalHoursServed = volunteers.reduce((sum: number, v: any) => 
      sum + (v.hoursServed || 0), 0
    );
    
    const stats = {
      totalDonors: donors.length,
      totalCamps: camps.length,
      upcomingCamps: upcomingCamps.length,
      totalVolunteers: volunteers.length,
      totalHoursServed,
      activeHelpRequests: helpRequests.filter((r: any) => r.status === "pending").length,
    };
    
    return c.json({ stats });
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// ==================== INITIALIZE SAMPLE DATA ====================

// Initialize sample data endpoint (call once to populate)
app.post("/make-server-fa4fa155/init-data", async (c) => {
  try {
    // Sample donors
    const sampleDonors = [
      {
        id: "donor:1",
        name: "Rahul Sharma",
        bloodGroup: "O+",
        location: "Andheri West, Mumbai",
        college: "Mumbai University NSS Unit",
        phone: "9876543210",
        verified: true,
        lastDonation: "Aug 15, 2025",
        createdAt: new Date().toISOString(),
      },
      {
        id: "donor:2",
        name: "Priya Patel",
        bloodGroup: "O+",
        location: "Koramangala, Bangalore",
        college: "Bangalore Institute of Technology",
        phone: "9123456789",
        verified: true,
        lastDonation: "Sep 2, 2025",
        createdAt: new Date().toISOString(),
      },
      {
        id: "donor:3",
        name: "Amit Kumar",
        bloodGroup: "A+",
        location: "Powai, Mumbai",
        college: "IIT Bombay NSS Chapter",
        phone: "9988776655",
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Sample camps
    const sampleCamps = [
      {
        id: "camp:1",
        title: "Blood Donation Drive",
        type: "Blood Donation",
        date: "2025-11-12",
        time: "9:00 AM - 4:00 PM",
        venue: "City College Auditorium, Mumbai",
        organizer: "Mumbai City College NSS Unit",
        organizerType: "college",
        image: "https://images.unsplash.com/photo-1746806942689-f8966f63ed75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwdm9sdW50ZWVyJTIwaGVscGluZ3xlbnwxfHx8fDE3NjIyNjM0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        spotsAvailable: 45,
        totalSpots: 100,
        registrations: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "camp:2",
        title: "Free Eye Checkup Camp",
        type: "Eye Care",
        date: "2025-11-15",
        time: "10:00 AM - 5:00 PM",
        venue: "District Hospital, Pune",
        organizer: "Pune District Hospital",
        organizerType: "hospital",
        image: "https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoJTIwY2FtcCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjIyNjM0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        spotsAvailable: 30,
        totalSpots: 50,
        registrations: [],
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Sample help requests
    const sampleHelpRequests = [
      {
        id: "help:1",
        name: "Emergency Patient",
        phone: "9123456789",
        location: "Andheri, Mumbai",
        helpType: "Blood Requirement",
        description: "O+ blood needed urgently for surgery",
        status: "pending",
        urgent: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
    ];
    
    // Save all sample data
    for (const donor of sampleDonors) {
      await kv.set(donor.id, donor);
    }
    
    for (const camp of sampleCamps) {
      await kv.set(camp.id, camp);
    }
    
    for (const request of sampleHelpRequests) {
      await kv.set(request.id, request);
    }
    
    return c.json({ 
      success: true, 
      message: "Sample data initialized",
      counts: {
        donors: sampleDonors.length,
        camps: sampleCamps.length,
        helpRequests: sampleHelpRequests.length,
      }
    });
  } catch (error) {
    console.log(`Error initializing data: ${error}`);
    return c.json({ error: "Failed to initialize data" }, 500);
  }
});

Deno.serve(app.fetch);
