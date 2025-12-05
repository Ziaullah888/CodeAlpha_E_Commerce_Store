console.log("api loaded");
const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (res.status === 204) return { success: true };
  return res.json();
}

async function apiPost(path, body = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 204) return { success: true };
  return res.json();
}

async function apiPut(url, body) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

async function apiDelete(url) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

async function getCart() {
  const res = await fetch(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  return data.products || [];
}
