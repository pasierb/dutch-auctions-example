import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

function getAuctions(query = {}) {
  const qs = Object.keys(query)
    .map(k => [k, encodeURIComponent(query[k])].join("="))
    .join("&");

  return fetch(`${apiUrl}/api/auctions?${qs}`).then(res => res.json());
}

function postAuction({ token, auction }) {
  return fetch(`${apiUrl}/api/auctions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    method: "POST",
    body: JSON.stringify({ auction })
  }).then(res => res.json());
}

function patchAuction({ token, auction }) {
  return fetch(`${apiUrl}/api/auctions/${auction.id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    method: "PATCH",
    body: JSON.stringify({ auction })
  }).then(res => res.json());
}

function postAuctionBid({ token, auction }) {
  return fetch(`${apiUrl}/api/auctions/${auction.id}/bid`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "POST"
  });
}

function postAuctionStart({ token, auction }) {
  return fetch(`${apiUrl}/api/auctions/${auction.id}/start`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "POST"
  });
}

function authenticate(username) {
  return fetch(`${apiUrl}/api/sessions`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      username
    })
  }).then(res => res.json());
}

function verifySession(token) {
  return fetch(`${apiUrl}/api/sessions/verify`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "POST"
  });
}

export {
  authenticate,
  verifySession,
  getAuctions,
  postAuction,
  patchAuction,
  postAuctionBid,
  postAuctionStart
};
