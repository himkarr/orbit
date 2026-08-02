const API_URL = import.meta.env.VITE_API_URL || "/api";

async function readJson(response) {
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}

export function signIn(values) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(values),
  }).then(readJson);
}

export function register(values) {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(values),
  }).then(readJson);
}

function projectRequest(path, token, options = {}) {
  return fetch(`${API_URL}/projects${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export function getProjects(token) {
  return projectRequest("", token).then(readJson);
}

export function getProject(id, token) {
  return projectRequest(`/${id}`, token).then(readJson);
}

export function updateProject(id, values, token) {
  return projectRequest(`/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(values),
  }).then(readJson);
}

export async function deleteProject(id, token) {
  const response = await projectRequest(`/${id}`, token, {method: "DELETE"});
  if (!response.ok) throw new Error((await response.json()).error || "Could not delete project.");
}

export async function streamGeneration({prompt, token, onChunk, onSaved, signal}) {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({prompt, title: prompt.slice(0, 50)}),
  });

  if (!response.ok)
    throw new Error((await response.json()).error || "Generation failed.");
  if (!response.body)
    throw new Error("Streaming is not supported by this browser.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const handleEvent = (event) => {
    if (!event.startsWith("data: ")) return;
    const data = JSON.parse(event.slice(6));
    if (data.type === "chunk") onChunk(data.content);
    if (data.type === "saved") onSaved(data.project);
    if (data.type === "error") throw new Error(data.error);
  };

  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true});
    const events = buffer.split("\n\n");
    buffer = events.pop();
    events.forEach(handleEvent);
  }
  if (buffer) handleEvent(buffer);
}
