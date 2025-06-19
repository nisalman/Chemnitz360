<template>
    <div>
        <h1>Cultural Spots Near Chemnitz</h1>
        <div id="filter-container">
            <label for="amenity-filter">Filter by Type: </label>
            <select id="amenity-filter" v-model="selectedFilter" @change="renderMarkers">
                <option value="all">All</option>
                <option value="theatre">Theatre</option>
                <option value="restaurant">Restaurant</option>
                <option value="artwork">Artwork</option>
                <option value="museum">Museum</option>
            </select>
        </div>
        <div id="map" style="height: 600px; width: 100%;"></div>
        <div id="status">{{ status }}</div>
        <div class="attribution">
            Icons by <a href="https://www.flaticon.com" target="_blank">Flaticon</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CulturalSpotsMap',
    data() {
        return {
            map: null,
            nodes: [],
            markers: [],
            selectedFilter: 'all',
            status: 'Loading...',
            iconMap: {
                theatre: 'https://cdn-icons-png.flaticon.com/32/3181/3181719.png',
                restaurant: 'https://cdn-icons-png.flaticon.com/32/3075/3075977.png', // Burger icon as in your image
                artwork: 'https://cdn-icons-png.flaticon.com/32/2088/2088608.png',
                museum: 'https://cdn-icons-png.flaticon.com/32/2289/2289174.png', // Black square-like icon
                default: 'https://cdn-icons-png.flaticon.com/32/684/684908.png',
            },
        };
    },
    mounted() {
        this.loadGoogleMaps();
    },
    methods: {
        loadGoogleMaps() {
            if (window.google && window.google.maps) {
                this.initMap();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA8KumTZG3UOV3_l9GVGVaCcqdQ5coYsWk&v=weekly&libraries=marker&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = this.initMap;
            document.head.appendChild(script);
        },
        initMap() {
            const mapCenter = { lat: 50.8323, lng: 12.9253 };
            this.map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: mapCenter,
                mapId: 'd5280d388f90b10dde93631c', // Replace with your Google Maps Map ID
            });

            this.fetchOverpassData();
        },
        async fetchOverpassData() {
            try {
                const response = await fetch(
                    'https://overpass-api.de/api/interpreter?data=[out:json];(node(around:1000,50.8323,12.9253)[amenity=theatre];node(around:1000,50.8323,12.9253)[amenity=restaurant];node(around:1000,50.8323,12.9253)[tourism=artwork];node(around:1000,50.8323,12.9253)[tourism=museum];);out;'
                );
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();

                if (!data.elements || data.elements.length === 0) {
                    this.status = 'No theatres, restaurants, artworks, or museums found in this area.';
                    return;
                }

                this.nodes = data.elements;
                this.renderMarkers();
                this.status = '';
            } catch (error) {
                console.error('Error fetching Overpass API data:', error);
                this.status = 'Failed to load data. Please check your connection or try again later.';
            }
        },
        renderMarkers() {
            // Clear existing markers
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];

            let filteredNodes = this.nodes;
            if (this.selectedFilter !== 'all') {
                filteredNodes = this.nodes.filter(node => {
                    const type = node.tags.amenity || node.tags.tourism || 'Unknown';
                    return type === this.selectedFilter;
                });
            }

            // Update status if no nodes match filter
            if (filteredNodes.length === 0 && this.selectedFilter !== 'all') {
                this.status = `No ${this.selectedFilter.charAt(0).toUpperCase() + this.selectedFilter.slice(1)}s found in this area.`;
            } else {
                this.status = '';
            }

            // Render filtered nodes
            filteredNodes.forEach(node => {
                if (node.type === 'node' && node.lat && node.lon) {
                    const position = { lat: node.lat, lng: node.lon };
                    const type = node.tags.amenity || node.tags.tourism || 'Unknown';
                    const name = node.tags.name || (type.charAt(0).toUpperCase() + type.slice(1)); // Use name from tags or fallback to type
                    const tooltip = name ? `${name} (${type.charAt(0).toUpperCase() + type.slice(1)})` : type.charAt(0).toUpperCase() + type.slice(1);
                    const iconUrl = this.iconMap[type] || this.iconMap.default;

                    const img = document.createElement('img');
                    img.src = iconUrl;
                    img.className = 'custom-icon';
                    img.alt = type;
                    img.onerror = () => { img.src = this.iconMap.default; };

                    const marker = new window.google.maps.marker.AdvancedMarkerElement({
                        position: position,
                        map: this.map,
                        title: tooltip, // Displays name on hover
                        content: img,
                    });

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<h3>${name || type.charAt(0).toUpperCase() + type.slice(1)}</h3><p>${type.charAt(0).toUpperCase() + type.slice(1)}</p>`,
                    });

                    marker.addListener('gmp-click', () => {
                        infoWindow.open(this.map, marker);
                    });

                    this.markers.push(marker);
                }
            });
        },
    },
};
</script>

<style scoped>
#map {
    height: 600px;
    width: 100%;
}
h1 {
    text-align: center;
    margin: 20px;
}
.custom-icon {
    width: 32px;
    height: 32px;
}
.attribution {
    text-align: center;
    font-size: 12px;
    margin: 10px;
}
#status {
    text-align: center;
    font-size: 14px;
    margin: 10px;
    color: #555;
}
#filter-container {
    text-align: center;
    margin: 10px;
}
#amenity-filter {
    padding: 8px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    cursor: pointer;
}
</style>
