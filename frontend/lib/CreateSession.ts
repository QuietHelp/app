'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';


export const createSession = async () => {        
    try {
      const response = await fetch(`${API_BASE}/api/session`, {
        method: 'GET',
      });
      const data = await response.json();
      // Use sessionStorage
      sessionStorage.setItem('sessionId', data.sessionId)
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };
