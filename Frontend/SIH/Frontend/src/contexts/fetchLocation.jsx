export async function fetchLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=&lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    return data.display_name; // returns the address
  } catch (err) {
    console.error("Error fetching location:", err);
    return null;
  }
}