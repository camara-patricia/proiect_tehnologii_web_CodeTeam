const API_URL = 'http://localhost:8080/api';

async function handleJson(response) {
  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      msg = data?.message || data?.error || msg;
    } catch {
    }
    throw new Error(msg);
  }
  return response.json();
}

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    return handleJson(response);
  },

  register: async (data) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return handleJson(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });

    await handleJson(response);
  },
};

export const eventGroupsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/event-groups`);
    const data = await handleJson(response);
    return data.eventGroups;
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/event-groups/${id}`);
    const data = await handleJson(response);
    return data.eventGroup;
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/event-groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await handleJson(response);
    return out.eventGroup;
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/event-groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await handleJson(response);
    return out.eventGroup;
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/event-groups/${id}`, { method: 'DELETE' });
    await handleJson(response);
  },

  exportToCsv: async (groupId) => {
    const response = await fetch(`${API_URL}/event-groups/${groupId}/export`);
    if (!response.ok) throw new Error(`Export failed (${response.status})`);
    return response.blob();
  },
};

export const eventsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/events`);
    const data = await handleJson(response);
    return data.events;
  },

  getByGroupId: async (groupId) => {
    const response = await fetch(`${API_URL}/events/group/${groupId}`);
    const data = await handleJson(response);
    return data.events;
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`);
    const data = await handleJson(response);
    return data.event;
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await handleJson(response);
    return out.event;
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await handleJson(response);
    return out.event;
  },

  delete: async (id, userId) => {
    const response = await fetch(`${API_URL}/events/${id}`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    await handleJson(response);
  },
};

export const eventUsersAPI = {
  getParticipants: async (eventId) => {
    const response = await fetch(`${API_URL}/events/${eventId}/participants`);
    const data = await handleJson(response);
    return data.participants;
  },

  markAttendance: async (accessCode, userId) => {
    const response = await fetch(`${API_URL}/events/attend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessCode: accessCode.trim(),
        userId,
      }),
    });

    return handleJson(response);
  },

  exportToCsv: async (eventId) => {
    const response = await fetch(`${API_URL}/events/${eventId}/export`);
    if (!response.ok) throw new Error(`Export failed (${response.status})`);
    return response.blob();
  },
};
