import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable CORS
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// Helper function for error responses
const handleError = (c: any, error: any, message: string, status = 500) => {
  console.error(`${message}:`, error);
  return c.json({ error: message }, status);
};

// Helper function for filtering data
const applyFilters = (data: any[], filters: Record<string, any>) => {
  let result = data;
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      if (key.includes('location') || key.includes('district')) {
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

// Health check
app.get("/make-server-fa4fa155/health", (c) => c.json({ status: "ok" }));

// ==================== BLOOD DONORS ====================
app.get("/make-server-fa4fa155/donors", async (c) => {
  try {
    const donors = await kv.getByPrefix("donor:");
    const filtered = applyFilters(donors, {
      bloodGroup: c.req.query("bloodGroup"),
      location: c.req.query("district"),
    });
    return c.json({ donors: filtered });
  } catch (error) {
    return handleError(c, error, "Failed to fetch donors");
  }
});

app.post("/make-server-fa4fa155/donors", async (c) => {
  try {
    const donor = await c.req.json();
    const donorId = `donor:${Date.now()}`;
    const donorData = {
      id: donorId,
      ...donor,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    await kv.set(donorId, donorData);
    return c.json({ success: true, donor: donorData });
  } catch (error) {
    return handleError(c, error, "Failed to add donor");
  }
});

// ==================== EMERGENCY HELP REQUESTS ====================
app.get("/make-server-fa4fa155/help-requests", async (c) => {
  try {
    const requests = await kv.getByPrefix("help:");
    const filtered = applyFilters(requests, {
      status: c.req.query("status"),
      location: c.req.query("location"),
    });
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ requests: filtered });
  } catch (error) {
    return handleError(c, error, "Failed to fetch help requests");
  }
});

app.post("/make-server-fa4fa155/help-requests", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `help:${Date.now()}`;
    const helpRequest = {
      id: requestId,
      ...request,
      status: "pending",
      urgent: request.urgent || false,
      createdAt: new Date().toISOString(),
    };
    await kv.set(requestId, helpRequest);
    return c.json({ success: true, request: helpRequest });
  } catch (error) {
    return handleError(c, error, "Failed to create help request");
  }
});

app.put("/make-server-fa4fa155/help-requests/:id", async (c) => {
  try {
    const requestId = c.req.param("id");
    const { status, respondedBy } = await c.req.json();
    const request = await kv.get(requestId);
    if (!request) return c.json({ error: "Request not found" }, 404);
    
    const updatedRequest = {
      ...request,
      status,
      respondedBy,
      respondedAt: new Date().toISOString(),
    };
    await kv.set(requestId, updatedRequest);
    return c.json({ success: true, request: updatedRequest });
  } catch (error) {
    return handleError(c, error, "Failed to update help request");
  }
});

// ==================== HEALTH CAMPS ====================
app.get("/make-server-fa4fa155/camps", async (c) => {
  try {
    let camps = await kv.getByPrefix("camp:");
    const type = c.req.query("type");
    const location = c.req.query("location");
    const upcoming = c.req.query("upcoming");
    
    if (type && type !== "all") camps = camps.filter((camp: any) => camp.type === type);
    if (location && location !== "all") camps = camps.filter((camp: any) => 
      camp.venue.toLowerCase().includes(location.toLowerCase())
    );
    if (upcoming === "true") camps = camps.filter((camp: any) => 
      new Date(camp.date) >= new Date()
    );
    
    camps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return c.json({ camps });
  } catch (error) {
    return handleError(c, error, "Failed to fetch camps");
  }
});

app.post("/make-server-fa4fa155/camps", async (c) => {
  try {
    const camp = await c.req.json();
    const campId = `camp:${Date.now()}`;
    const campData = {
      id: campId,
      ...camp,
      spotsAvailable: camp.spotsAvailable || 0,
      totalSpots: camp.totalSpots || 0,
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    await kv.set(campId, campData);
    return c.json({ success: true, camp: campData });
  } catch (error) {
    return handleError(c, error, "Failed to create camp");
  }
});

app.post("/make-server-fa4fa155/camps/:id/register", async (c) => {
  try {
    const campId = c.req.param("id");
    const registration = await c.req.json();
    const camp = await kv.get(campId);
    
    if (!camp) return c.json({ error: "Camp not found" }, 404);
    if (camp.spotsAvailable <= 0) return c.json({ error: "No spots available" }, 400);
    
    const updatedCamp = {
      ...camp,
      registrations: [...(camp.registrations || []), { ...registration, registeredAt: new Date().toISOString() }],
      spotsAvailable: camp.spotsAvailable - 1,
    };
    await kv.set(campId, updatedCamp);
    return c.json({ success: true, camp: updatedCamp });
  } catch (error) {
    return handleError(c, error, "Failed to register for camp");
  }
});

// ==================== VOLUNTEERS ====================
app.get("/make-server-fa4fa155/volunteers", async (c) => {
  try {
    let volunteers = await kv.getByPrefix("volunteer:");
    const college = c.req.query("college");
    if (college) volunteers = volunteers.filter((v: any) => v.college === college);
    return c.json({ volunteers });
  } catch (error) {
    return handleError(c, error, "Failed to fetch volunteers");
  }
});

app.post("/make-server-fa4fa155/volunteers", async (c) => {
  try {
    const volunteer = await c.req.json();
    const volunteerId = `volunteer:${Date.now()}`;
    const volunteerData = {
      id: volunteerId,
      ...volunteer,
      joinedAt: new Date().toISOString(),
      hoursServed: 0,
      campsAttended: 0,
    };
    await kv.set(volunteerId, volunteerData);
    return c.json({ success: true, volunteer: volunteerData });
  } catch (error) {
    return handleError(c, error, "Failed to add volunteer");
  }
});

// ==================== BLOOD REQUESTS (HOSPITAL) ====================
app.get("/make-server-fa4fa155/blood-requests", async (c) => {
  try {
    const requests = await kv.getByPrefix("bloodreq:");
    const filtered = applyFilters(requests, {
      hospital: c.req.query("hospital"),
      status: c.req.query("status"),
    });
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ requests: filtered });
  } catch (error) {
    return handleError(c, error, "Failed to fetch blood requests");
  }
});

app.post("/make-server-fa4fa155/blood-requests", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `bloodreq:${Date.now()}`;
    const bloodRequest = {
      id: requestId,
      ...request,
      urgent: request.urgent || false,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    await kv.set(requestId, bloodRequest);
    return c.json({ success: true, request: bloodRequest });
  } catch (error) {
    return handleError(c, error, "Failed to create blood request");
  }
});

// ==================== ANALYTICS / STATS ====================
app.get("/make-server-fa4fa155/stats", async (c) => {
  try {
    const [donors, camps, volunteers, helpRequests] = await Promise.all([
      kv.getByPrefix("donor:"),
      kv.getByPrefix("camp:"),
      kv.getByPrefix("volunteer:"),
      kv.getByPrefix("help:"),
    ]);
    
    const stats = {
      totalDonors: donors.length,
      totalCamps: camps.length,
      upcomingCamps: camps.filter((camp: any) => new Date(camp.date) >= new Date()).length,
      totalVolunteers: volunteers.length,
      totalHoursServed: volunteers.reduce((sum: number, v: any) => sum + (v.hoursServed || 0), 0),
      activeHelpRequests: helpRequests.filter((r: any) => r.status === "pending").length,
    };
    return c.json({ stats });
  } catch (error) {
    return handleError(c, error, "Failed to fetch stats");
  }
});

// ==================== RELIEF MISSIONS (DISASTER RELIEF) ====================
app.get("/make-server-fa4fa155/relief-missions", async (c) => {
  try {
    const missions = await kv.getByPrefix("mission:");
    const filtered = applyFilters(missions, {
      status: c.req.query("status"),
      type: c.req.query("type"),
      district: c.req.query("district"),
    });
    return c.json({ missions: filtered });
  } catch (error) {
    return handleError(c, error, "Failed to fetch relief missions");
  }
});

app.post("/make-server-fa4fa155/relief-missions", async (c) => {
  try {
    const mission = await c.req.json();
    const missionId = `mission:${Date.now()}`;
    const missionData = { id: missionId, ...mission, createdAt: new Date().toISOString() };
    await kv.set(missionId, missionData);
    return c.json({ success: true, mission: missionData });
  } catch (error) {
    return handleError(c, error, "Failed to create relief mission");
  }
});

app.put("/make-server-fa4fa155/relief-missions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`mission:${id}`);
    if (!existing) return c.json({ error: "Mission not found" }, 404);
    
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`mission:${id}`, updated);
    return c.json({ success: true, mission: updated });
  } catch (error) {
    return handleError(c, error, "Failed to update relief mission");
  }
});

app.get("/make-server-fa4fa155/relief-missions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const mission = await kv.get(`mission:${id}`);
    if (!mission) return c.json({ error: "Mission not found" }, 404);
    return c.json({ mission });
  } catch (error) {
    return handleError(c, error, "Failed to fetch relief mission");
  }
});

// ==================== RELIEF REQUESTS (PUBLIC HELP REQUESTS) ====================
app.get("/make-server-fa4fa155/relief-requests", async (c) => {
  try {
    const requests = await kv.getByPrefix("relief-request:");
    const filtered = applyFilters(requests, {
      status: c.req.query("status"),
      urgency: c.req.query("urgency"),
      district: c.req.query("district"),
    });
    return c.json({ requests: filtered });
  } catch (error) {
    return handleError(c, error, "Failed to fetch relief requests");
  }
});

app.post("/make-server-fa4fa155/relief-requests", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `relief-request:${Date.now()}`;
    const requestData = { id: requestId, ...request, createdAt: new Date().toISOString() };
    await kv.set(requestId, requestData);
    return c.json({ success: true, request: requestData });
  } catch (error) {
    return handleError(c, error, "Failed to create relief request");
  }
});

app.put("/make-server-fa4fa155/relief-requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`relief-request:${id}`);
    if (!existing) return c.json({ error: "Request not found" }, 404);
    
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`relief-request:${id}`, updated);
    return c.json({ success: true, request: updated });
  } catch (error) {
    return handleError(c, error, "Failed to update relief request");
  }
});

// ==================== VOLUNTEER MISSION REGISTRATIONS ====================
app.get("/make-server-fa4fa155/volunteer-mission-registrations", async (c) => {
  try {
    const registrations = await kv.getByPrefix("vol-mission-reg:");
    const filtered = applyFilters(registrations, {
      missionId: c.req.query("missionId"),
      status: c.req.query("status"),
      college: c.req.query("college"),
    });
    return c.json({ registrations: filtered });
  } catch (error) {
    return handleError(c, error, "Failed to fetch volunteer registrations");
  }
});

app.post("/make-server-fa4fa155/volunteer-mission-registrations", async (c) => {
  try {
    const registration = await c.req.json();
    const regId = `vol-mission-reg:${Date.now()}`;
    const registrationData = { id: regId, ...registration, createdAt: new Date().toISOString() };
    await kv.set(regId, registrationData);
    return c.json({ success: true, registration: registrationData });
  } catch (error) {
    return handleError(c, error, "Failed to create volunteer registration");
  }
});

app.put("/make-server-fa4fa155/volunteer-mission-registrations/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`vol-mission-reg:${id}`);
    if (!existing) return c.json({ error: "Registration not found" }, 404);
    
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`vol-mission-reg:${id}`, updated);
    return c.json({ success: true, registration: updated });
  } catch (error) {
    return handleError(c, error, "Failed to update volunteer registration");
  }
});

// ==================== INITIALIZE SAMPLE DATA ====================
app.post("/make-server-fa4fa155/init-data", async (c) => {
  try {
    // Sample data initialization
    const sampleDonors = [
      { id: "donor:1", name: "Rahul Sharma", bloodGroup: "O+", location: "Andheri West, Mumbai", college: "Mumbai University NSS Unit", phone: "9876543210", verified: true, lastDonation: "Aug 15, 2025", createdAt: new Date().toISOString() },
      { id: "donor:2", name: "Priya Patel", bloodGroup: "O+", location: "Koramangala, Bangalore", college: "Bangalore Institute of Technology", phone: "9123456789", verified: true, lastDonation: "Sep 2, 2025", createdAt: new Date().toISOString() },
      { id: "donor:3", name: "Amit Kumar", bloodGroup: "A+", location: "Powai, Mumbai", college: "IIT Bombay NSS Chapter", phone: "9988776655", verified: true, createdAt: new Date().toISOString() },
    ];
    
    const sampleCamps = [
      { id: "camp:1", title: "Blood Donation Drive", type: "Blood Donation", date: "2025-11-12", time: "9:00 AM - 4:00 PM", venue: "City College Auditorium, Mumbai", organizer: "Mumbai City College NSS Unit", organizerType: "college", image: "https://images.unsplash.com/photo-1746806942689-f8966f63ed75?w=1080", spotsAvailable: 45, totalSpots: 100, registrations: [], createdAt: new Date().toISOString() },
      { id: "camp:2", title: "Free Eye Checkup Camp", type: "Eye Care", date: "2025-11-15", time: "10:00 AM - 5:00 PM", venue: "District Hospital, Pune", organizer: "Pune District Hospital", organizerType: "hospital", image: "https://images.unsplash.com/photo-1589104759909-e355f8999f7e?w=1080", spotsAvailable: 30, totalSpots: 50, registrations: [], createdAt: new Date().toISOString() },
    ];
    
    const sampleHelpRequests = [
      { id: "help:1", name: "Emergency Patient", phone: "9123456789", location: "Andheri, Mumbai", helpType: "Blood Requirement", description: "O+ blood needed urgently for surgery", status: "pending", urgent: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ];
    
    const sampleMissions = [
      { id: "mission:1", title: "Flood Relief Mission – Thanjavur", type: "flood", status: "active", location: "Thanjavur Town, South Zone", district: "Thanjavur", startDate: "2025-11-12", endDate: "2025-11-15", description: "Emergency flood relief operation providing food, medical aid, and shelter to affected families in Thanjavur district.", organizedBy: "NSS Care Network + Thanjavur District Administration", contactPerson: "Dr. Karthik Murugan", contactPhone: "98765 32100", volunteers: [{ type: "Food Preparation", needed: 20, assigned: 12 }, { type: "Medical Team", needed: 5, assigned: 5 }, { type: "Supply Transport", needed: 8, assigned: 6 }, { type: "Relief Distribution", needed: 15, assigned: 10 }], createdAt: new Date().toISOString() },
      { id: "mission:2", title: "Cyclone Recovery – Coastal Tamil Nadu", type: "cyclone", status: "active", location: "Coastal Villages, Kanyakumari", district: "Kanyakumari", startDate: "2025-11-10", endDate: "2025-11-18", description: "Post-cyclone recovery mission providing shelter, food, and medical assistance to coastal villages.", organizedBy: "NSS Care Network + Tamil Nadu State Emergency", contactPerson: "Priya Sundaram", contactPhone: "91234 56789", volunteers: [{ type: "Shelter Setup", needed: 25, assigned: 18 }, { type: "Medical Team", needed: 10, assigned: 7 }, { type: "Food Distribution", needed: 30, assigned: 22 }, { type: "Counseling", needed: 8, assigned: 5 }], createdAt: new Date().toISOString() },
    ];
    
    // Store all sample data
    for (const donor of sampleDonors) await kv.set(donor.id, donor);
    for (const camp of sampleCamps) await kv.set(camp.id, camp);
    for (const request of sampleHelpRequests) await kv.set(request.id, request);
    for (const mission of sampleMissions) await kv.set(mission.id, mission);
    
    return c.json({ success: true, message: "Sample data initialized" });
  } catch (error) {
    return handleError(c, error, "Failed to initialize sample data");
  }
});

Deno.serve(app.fetch);
