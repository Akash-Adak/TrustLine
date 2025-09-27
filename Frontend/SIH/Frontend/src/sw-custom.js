// src/sw-custom.js

import { getAllPendingReports, deletePendingReport, getTokenFromDB } from './services/db';

// Listen for the 'sync' event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-reports') {
    event.waitUntil(syncPendingReports());
  }
});

async function syncPendingReports() {
  const token = await getTokenFromDB();
  if (!token) {
    console.error('Auth token not found in DB. Cannot sync.');
    return;
  }

  const pendingReports = await getAllPendingReports();
  for (const report of pendingReports) {
    try {
      const response = await fetch('http://localhost:9095/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use the token from IndexedDB
        },
        body: JSON.stringify({
          title: report.title,
          description: report.description,
          category: report.category,
        }),
      });

      if (response.ok) {
        console.log(`Successfully synced report #${report.id}`);
        // If sync is successful, delete the report from IndexedDB
        await deletePendingReport(report.id);
      } else {
        console.error(`Failed to sync report #${report.id}. Server responded with:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error syncing report #${report.id}:`, error);
      // If there's a network error, the report remains in the DB for the next sync attempt.
    }
  }
}