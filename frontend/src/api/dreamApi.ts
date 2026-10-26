import type { DreamAnalysis } from '../types/dream';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8082';

export async function analyzeDream(dreamText: string): Promise<DreamAnalysis> {
  const res = await fetch(`${API_BASE}/api/dreams/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamText }),
  });

  if (!res.ok) {
    throw new Error('Failed to analyze dream. The AI might be resting.');
  }
  return res.json();
}

export async function streamSynthesis(
  dreamText: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/dreams/synthesis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamText }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error('Failed to stream synthesis');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

     while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

     for (const frame of frames) {
      const dataLine = frame.split('\n').find(line => line.startsWith('data:'));
      if (dataLine) {
        // substring(5) removes "data:", keeping everything else including the space
        const token = dataLine.substring(5); 
        
        // ADD THIS LINE to inspect the raw token in the browser console
        
        onToken(token);
      }
    }
  }
}