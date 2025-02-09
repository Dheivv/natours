/* eslint disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGhlaXZ2IiwiYSI6ImNtNmk4aGZraDA0MmgyaXNiMWw0YzJwNmUifQ.UslWt1cgIad4NBRXPyxsYA';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dheivv/cm6i99ywq00hs01r58x02aski',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 4,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add pop-up
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
