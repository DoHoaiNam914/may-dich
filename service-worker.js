'use strict'
/* global addEventListener, caches, clients, fetch, skipWaiting */
const cacheName = '26.08.27-alpha'
const precachedResources = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/manifest.json'
]
async function precache () {
  const cache = await caches.open(cacheName)
  return await cache.addAll(precachedResources)
}
addEventListener('install', event => {
  event.waitUntil(precache())
  skipWaiting()
})
addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(value => Promise.all(value.map(element => {
    if (element === cacheName) return null
    return caches.delete(element)
  }))))
  clients.claim()
})
async function networkFirst (request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch {
    const cachedResponse = await caches.match(request)
    if (cachedResponse != null) return cachedResponse
    if (request.mode === 'navigate') return await caches.match('/index.html')
    return Response.error()
  }
}
addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  event.respondWith(networkFirst(event.request))
})