mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard", // Use the standard style for the map
  projection: "globe", // display the map as a globe
  zoom: 7, // initial zoom level, 0 is the world view, higher values zoom in
  center: coordinates, // center the map on this longitude and latitude
});

const marker1 = new mapboxgl.Marker({ color: "Red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<p>Exact location provided!</p>"
    )
  )
  .addTo(map);
