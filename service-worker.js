'use strict'
/* global addEventListener, caches */
const cacheName = '26.09.03-alpha'
addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(value => Promise.all(value.map(element => {
    if (element === cacheName) return null
    return caches.delete(element)
  }))))
  clients.claim()
})
