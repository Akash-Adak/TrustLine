import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

function HeatmapPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  // Fetch complaints from backend
const fetchComplaints = async () => {
  try {
    setLoading(true);
    let url = "/complaints/all";

    const params = new URLSearchParams();
    if (categoryFilter !== "ALL") params.append("category", categoryFilter);
    if (statusFilter !== "ALL") params.append("status", statusFilter);

    const queryString = params.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const res = await api.get(finalUrl);
    setComplaints(res.data);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    setLoading(false);
  }
};
useEffect(() => {
  fetchComplaints(); // fetch immediately on mount or filter change
}, [categoryFilter, statusFilter]);

useEffect(() => {
  const interval = setInterval(fetchComplaints, 24 * 60 * 60 * 1000); // every 24 hours
  return () => clearInterval(interval);
}, []);


  if (loading) return <div className="text-center mt-10">Loading heatmap...</div>;

  // Apply filters
  const filteredComplaints = complaints.filter((c) => {
    return (categoryFilter === "ALL" || c.category === categoryFilter) &&
           (statusFilter === "ALL" || c.status === statusFilter);
  });

  // Aggregate complaints by lat/lng for dynamic intensity
  const intensityMap = {};
  filteredComplaints.forEach((c) => {
    const key = `${c.latitude.toFixed(4)}-${c.longitude.toFixed(4)}`; // round to reduce duplicates
    if (!intensityMap[key]) intensityMap[key] = { lat: c.latitude, lng: c.longitude, count: 0 };
    intensityMap[key].count += 1;
  });

  // Convert to heatmap points: [lat, lng, intensity]
  const heatPoints = Object.values(intensityMap).map(p => [p.lat, p.lng, p.count]);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Filters */}
      <div className="p-4 flex flex-wrap gap-4 bg-gray-100 shadow-md z-10">
        <div>
          <label className="mr-2 font-semibold">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="ALL">All</option>
            <option value="CYBER_CRIME">Cyber Crime</option>
            <option value="CIVIC_ISSUE">Civic Issue</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />

          {/* Heatmap Layer */}
          {heatPoints.length > 0 && (
            <HeatmapLayer
              fitBoundsOnLoad
              fitBoundsOnUpdate
              points={heatPoints}
              longitudeExtractor={(p) => p[1]}
              latitudeExtractor={(p) => p[0]}
              intensityExtractor={(p) => p[2]}
              radius={25}
              blur={15}
              max={Math.max(...heatPoints.map(p => p[2]))} // dynamic max intensity
            />
          )}

          {/* Markers */}
          {filteredComplaints.map((c) => (
            <CircleMarker
              key={c.id}
              center={[c.latitude, c.longitude]}
              radius={8}
              color={c.status === "RESOLVED" ? "green" : "red"}
              fillOpacity={0.7}
              stroke={false}
              eventHandlers={{
                click: () => navigate(`/reports/${c.id}`),
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={0.9} permanent={false}>
                <div className="text-sm">
                  <strong>{c.title}</strong>
                  <br />
                  <em>{c.category}</em>
                  <br />
                  {c.description}
                  <br />
                  <span className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default HeatmapPage;
