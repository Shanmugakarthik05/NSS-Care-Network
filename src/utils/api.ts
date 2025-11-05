import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fa4fa155`;

interface ApiOptions {
  method?: string;
  body?: any;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body } = options;

  const headers: HeadersInit = {
    Authorization: `Bearer ${publicAnonKey}`,
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Blood Donors API
export const donorsApi = {
  getAll: (filters?: { bloodGroup?: string; district?: string }) => {
    const params = new URLSearchParams();
    if (filters?.bloodGroup) params.append("bloodGroup", filters.bloodGroup);
    if (filters?.district) params.append("district", filters.district);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/donors${query}`);
  },

  add: (donor: any) => {
    return apiCall("/donors", { method: "POST", body: donor });
  },
};

// Emergency Help Requests API
export const helpRequestsApi = {
  getAll: (filters?: { status?: string; location?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.location) params.append("location", filters.location);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/help-requests${query}`);
  },

  create: (request: any) => {
    return apiCall("/help-requests", { method: "POST", body: request });
  },

  update: (id: string, data: any) => {
    return apiCall(`/help-requests/${id}`, { method: "PUT", body: data });
  },
};

// Health Camps API
export const campsApi = {
  getAll: (filters?: { type?: string; location?: string; upcoming?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.upcoming !== undefined) params.append("upcoming", String(filters.upcoming));
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/camps${query}`);
  },

  create: (camp: any) => {
    return apiCall("/camps", { method: "POST", body: camp });
  },

  register: (campId: string, registration: any) => {
    return apiCall(`/camps/${campId}/register`, { method: "POST", body: registration });
  },
};

// Volunteers API
export const volunteersApi = {
  getAll: (college?: string) => {
    const query = college ? `?college=${encodeURIComponent(college)}` : "";
    return apiCall(`/volunteers${query}`);
  },

  add: (volunteer: any) => {
    return apiCall("/volunteers", { method: "POST", body: volunteer });
  },
};

// Blood Requests API (Hospital)
export const bloodRequestsApi = {
  getAll: (filters?: { hospital?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.hospital) params.append("hospital", filters.hospital);
    if (filters?.status) params.append("status", filters.status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/blood-requests${query}`);
  },

  create: (request: any) => {
    return apiCall("/blood-requests", { method: "POST", body: request });
  },
};

// Stats API
export const statsApi = {
  getAll: () => {
    return apiCall("/stats");
  },
};

// Initialize sample data (call once)
export const initSampleData = () => {
  return apiCall("/init-data", { method: "POST" });
};
