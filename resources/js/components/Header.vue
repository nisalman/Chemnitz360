<template>
    <header class="bg-blue-600 text-white">
        <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="text-2xl font-bold">MapDirectory</div>
            <div class="space-x-4">
                <router-link to="/" class="hover:text-blue-200">Home</router-link>
                <router-link to="/features" class="hover:text-blue-200">Features</router-link>
                <router-link to="/pricing" class="hover:text-blue-200">Pricing</router-link>
                <router-link to="/contact" class="hover:text-blue-200">Contact</router-link>
            </div>
        </nav>

        <div class="container mx-auto px-6 py-16 relative">
            <!-- Controls -->
            <div class="flex justify-center mb-6">
                <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <select
                        v-model="selectedType"
                        @change="updateFilters"
                        class="w-full p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="all">All Locations</option>
                        <option value="theatre">Theatre</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="artwork">Artwork</option>
                        <option value="museum">Museum</option>
                    </select>
                    <input
                        v-model="searchQuery"
                        @input="updateFilters"
                        placeholder="Search by type or name..."
                        class="w-full p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            <!-- Map and Overlay Container -->
            <div class="relative w-full h-[600px] mb-6">
                <div id="map" class="w-full h-full rounded-lg border border-gray-300"></div>
                <div v-if="noResults" class="text-red-500 mt-2 text-center">No locations found</div>
                <div v-if="error && !error.includes('location')" class="text-red-500 mt-2 text-center">{{ error }}</div>

                <!-- Overlay Panel Inside Map Frame -->
                <div
                    v-if="selectedLocation"
                    class="absolute top-0 right-0 w-full sm:w-80 h-full bg-white bg-opacity-100 shadow-xl p-4 overflow-y-auto z-50 transform transition-transform duration-300 rounded-lg"
                    :class="{ 'translate-x-0': selectedLocation, 'translate-x-full': !selectedLocation }"
                >
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold text-gray-800">{{ selectedLocation.name }}</h3>
                        <button
                            @click="selectedLocation = null"
                            class="text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label="Close overlay"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p class="text-gray-600 text-sm mb-2"><strong>Type:</strong> {{ selectedLocation.type }}</p>
                    <p class="text-gray-600 text-sm mb-2"><strong>Address:</strong> {{ getAddress(selectedLocation.tags) }}</p>
                    <p v-if="selectedLocation.tags.website" class="text-gray-600 text-sm mb-2">
                        <strong>Website:</strong>
                        <a :href="selectedLocation.tags.website" target="_blank" class="text-blue-500 hover:underline">
                            {{ truncateUrl(selectedLocation.tags.website) }}
                        </a>
                    </p>
                    <p v-if="selectedLocation.tags.phone" class="text-gray-600 text-sm mb-2">
                        <strong>Phone:</strong> {{ selectedLocation.tags.phone }}
                    </p>
                    <p v-if="selectedLocation.tags.opening_hours" class="text-gray-600 text-sm mb-2">
                        <strong>Opening Hours:</strong> {{ selectedLocation.tags.opening_hours }}
                    </p>
                    <p class="text-gray-600 text-sm mb-2">
                        <strong>Rating:</strong>
                        <span class="inline-flex items-center">
                            <svg
                                v-for="n in 5"
                                :key="n"
                                class="w-4 h-4"
                                :class="n <= selectedLocation.rating ? 'text-yellow-400' : 'text-gray-300'"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.475 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                        </span>
                    </p>
                    <p class="text-gray-600 text-sm mb-2">
                        <strong>Visitors:</strong> {{ selectedLocation.visitors || 'Not available' }}
                    </p>
                    <p class="text-gray-600 text-sm mb-2">
                        <strong>Distance:</strong> {{ selectedLocation.travelInfo?.distance || getHaversineDistance(selectedLocation) || 'Not available' }}
                    </p>
                    <div class="flex flex-row space-x-4 mb-4">
                        <p class="text-gray-600 text-sm flex items-center">
                            <img src="https://img.icons8.com/color/48/000000/walking.png" alt="Walk" class="w-6 h-6" />
                            <span>{{ selectedLocation.travelInfo?.walkTime || getEstimatedWalkTime(selectedLocation) || 'Not available' }}</span>
                        </p>
                        <p class="text-gray-600 text-sm flex items-center">
                            <img src="https://img.icons8.com/color/48/000000/car.png" alt="Car" class="w-6 h-6" />
                            <span>{{ selectedLocation.travelInfo?.carTime || getEstimatedCarTime(selectedLocation) || 'Not available' }}</span>
                        </p>
                        <p class="text-gray-600 text-sm flex items-center">
                            <img src="https://img.icons8.com/color/48/000000/bicycle.png" alt="Bike" class="w-6 h-6" />
                            <span>{{ selectedLocation.travelInfo?.bikeTime || getEstimatedBikeTime(selectedLocation) || 'Not available' }}</span>
                        </p>
                    </div>
                    <div class="text-center bottom-1">
                        <button @click="returnAction" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Close</button>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-4">Discover Places with Ease</h1>
                <p class="text-lg md:text-xl mb-8">Your ultimate map directory for finding locations, businesses, and more.</p>
                <router-link
                    to="/get-started"
                    class="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-100"
                >
                    Get Started
                </router-link>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            map: null,
            allLocations: [],
            error: null,
            noResults: false,
            selectedType: 'all',
            searchQuery: '',
            markers: [],
            currentInfoWindow: null,
            selectedLocation: null,
            userLocation: null,
            retryCount: 0,
            maxRetries: 3,
            customIcons: {
                theatre: { url: 'https://img.icons8.com/color/48/theatre-mask.png', scaledSize: { width: 32, height: 32 } },
                restaurant: { url: 'https://img.icons8.com/ios-filled/50/0000FF/cutlery.png', scaledSize: { width: 32, height: 32 } },
                artwork: { url: 'https://img.icons8.com/color/48/paint-palette.png', scaledSize: { width: 32, height: 32 } },
                museum: { url: 'https://img.icons8.com/color/48/museum.png', scaledSize: { width: 32, height: 32 } }
            }
        };
    },
    computed: {
        displayedLocations() {
            let filtered = [...this.allLocations];

            if (this.selectedType !== 'all') {
                filtered = filtered.filter(loc => loc.type === this.selectedType);
            }

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(loc =>
                    loc.type.toLowerCase().includes(query) ||
                    loc.name.toLowerCase().includes(query)
                );
            }

            return filtered;
        }
    },
    async mounted() {
        await this.getUserLocation();
        const apiKey = 'AIzaSyA8KumTZG3UOV3_l9GVGVaCcqdQ5coYsWk';
        const googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&loading=async`;
        googleMapScript.async = true;
        googleMapScript.defer = true;
        googleMapScript.onerror = () => {
            this.error = 'Failed to load Google Maps script';
            console.error('Google Maps Script Error');
        };
        window.initMap = this.initMap.bind(this);
        document.head.appendChild(googleMapScript);

        await this.fetchLocations();
    },
    watch: {
        selectedLocation(newLocation) {
            if (newLocation && this.userLocation) {
                this.fetchTravelInfo(newLocation);
            } else if (newLocation) {
                console.log('No user location available, using haversine fallback');
                const travelInfo = {
                    distance: this.getHaversineDistance(newLocation),
                    walkTime: this.getEstimatedWalkTime(newLocation),
                    carTime: this.getEstimatedCarTime(newLocation),
                    bikeTime: this.getEstimatedBikeTime(newLocation)
                };
                this.$set(newLocation, 'travelInfo', travelInfo);
            }
        }
    },
    methods: {
        async getUserLocation() {
            if (navigator.geolocation) {
                while (this.retryCount < this.maxRetries) {
                    try {
                        const position = await new Promise((resolve, reject) =>
                            navigator.geolocation.getCurrentPosition(resolve, reject, {
                                timeout: 10000,
                                enableHighAccuracy: true,
                                maximumAge: 60000
                            })
                        );
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        console.log('User Location:', this.userLocation);
                        this.retryCount = 0; // Reset on success
                        return;
                    } catch (err) {
                        this.retryCount++;
                        console.error(`Geolocation Attempt ${this.retryCount} Error:`, err);
                        if (this.retryCount === this.maxRetries) {
                            this.error = `Failed to get current location after ${this.maxRetries} attempts: ${err.message}.`;
                            break;
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                    }
                }
            } else {
                this.error = 'Geolocation is not supported by this browser';
                console.error('Geolocation not supported');
            }
        },
        retryGeolocation() {
            this.error = null;
            this.getUserLocation();
            if (this.selectedLocation && this.userLocation) {
                this.fetchTravelInfo(this.selectedLocation);
            }
        },
        async fetchLocations() {
            try {
                const query = '[out:json];(node(around:5000,50.8323,12.9253)[amenity=theatre];node(around:5000,50.8323,12.9253)[amenity=restaurant];node(around:5000,50.8323,12.9253)[tourism=artwork];node(around:5000,50.8323,12.9253)[tourism=museum];);out;';
                const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.elements || data.elements.length === 0) {
                    this.error = 'No locations found from Overpass API';
                    return;
                }

                this.allLocations = data.elements.map(element => {
                    const location = {
                        id: element.id,
                        lat: element.lat,
                        lng: element.lon,
                        type: element.tags.amenity || element.tags.tourism || 'unknown',
                        name: element.tags.name || 'Unknown',
                        tags: element.tags,
                        rating: Math.floor(Math.random() * 5) + 1,
                        visitors: Math.floor(Math.random() * 1000) + 50
                    };
                    console.log('Location:', location);
                    return location;
                });

                this.$emit('locations-updated', this.allLocations);
                this.filterData();
                this.addMarkers();
            } catch (err) {
                this.error = 'Failed to fetch locations: ' + err.message;
                console.error('Fetch Locations Error:', err);
            }
        },
        async fetchTravelInfo(location) {
            if (!this.userLocation || !location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
                console.log('Missing or invalid coordinates:', { userLocation: this.userLocation, location });
                this.$set(location, 'travelInfo', null);
                return;
            }

            let attempt = 0;
            const maxAttempts = 3;
            while (attempt < maxAttempts) {
                try {
                    const apiKey = 'AIzaSyA8KumTZG3UOV3_l9GVGVaCcqdQ5coYsWk';
                    const modes = ['walking', 'driving', 'bicycling'];
                    const travelInfo = {};
                    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.userLocation.lat},${this.userLocation.lng}&destinations=${location.lat},${location.lng}&mode=walking&key=${apiKey}`;
                    console.log(`Attempt ${attempt + 1} URL:`, url);

                    for (const mode of modes) {
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.userLocation.lat},${this.userLocation.lng}&destinations=${location.lat},${location.lng}&mode=${mode}&key=${apiKey}`
                        );
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log(`Distance Matrix Response (${mode}, Attempt ${attempt + 1}):`, data);

                        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
                            const element = data.rows[0].elements[0];
                            const duration = Math.round(element.duration.value / 60); // Seconds to minutes
                            const distance = (element.distance.value / 1000).toFixed(2); // Meters to kilometers
                            travelInfo[mode] = { duration, distance };
                        } else {
                            console.warn(`Distance Matrix Error (${mode}, Attempt ${attempt + 1}):`, data.status, data.rows[0]?.elements[0]?.status, data.error_message || 'No error message');
                            travelInfo[mode] = null;
                            if (data.error_message) {
                                console.error(`Distance Matrix API Error (${mode}): ${data.error_message}`);
                            } else if (data.status === 'OVER_QUERY_LIMIT') {
                                console.warn('Distance Matrix API: Quota exceeded. Wait until ~09:00 AM CEST or increase quota.');
                            } else if (data.status === 'REQUEST_DENIED') {
                                console.warn('Distance Matrix API: Request denied. Ensure billing is enabled and API key is valid.');
                            }
                        }
                    }

                    if (Object.values(travelInfo).some(info => info !== null)) {
                        this.$set(location, 'travelInfo', {
                            distance: travelInfo.walking?.distance ? `${travelInfo.walking.distance} km` : null,
                            walkTime: travelInfo.walking?.duration ? `${travelInfo.walking.duration} min` : null,
                            carTime: travelInfo.driving?.duration ? `${travelInfo.driving.duration} min` : null,
                            bikeTime: travelInfo.bicycling?.duration ? `${travelInfo.bicycling.duration} min` : null
                        });
                        console.log('Travel Info Set:', location.travelInfo);
                        return;
                    }
                    attempt++;
                    if (attempt < maxAttempts) {
                        console.log(`Retrying travel info fetch, attempt ${attempt + 1}...`);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    }
                } catch (err) {
                    attempt++;
                    console.error(`Distance Matrix API Network Error (Attempt ${attempt}):`, err);
                    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                        console.warn('Possible CORS or connectivity issue. Ensure HTTPS or localhost with valid API key.');
                    } else if (err.name === 'AbortError') {
                        console.warn('Request timed out. Check network stability or increase timeout.');
                    } else if (err.message.includes('timeout')) {
                        console.warn('Request timed out. Consider increasing timeout or checking network.');
                    } else {
                        console.warn('Unknown network error:', err);
                    }
                    if (attempt === maxAttempts) {
                        console.warn('All attempts failed. Using fallback.');
                        this.$set(location, 'travelInfo', null);
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                    }
                }
            }
        },
        getHaversineDistance(location) {
            if (!this.userLocation || !location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
                return null;
            }
            const R = 6371; // Earth's radius in kilometers
            const dLat = ((location.lat - this.userLocation.lat) * Math.PI) / 180;
            const dLng = ((location.lng - this.userLocation.lng) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((this.userLocation.lat * Math.PI) / 180) *
                Math.cos((location.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return `${distance.toFixed(2)} km`;
        },
        getEstimatedWalkTime(location) {
            const distance = this.getHaversineDistance(location);
            if (!distance) return null;
            const distanceKm = parseFloat(distance);
            const walkSpeed = 5; // km/h
            const minutes = Math.round((distanceKm / walkSpeed) * 60);
            return `${minutes} min`;
        },
        getEstimatedCarTime(location) {
            const distance = this.getHaversineDistance(location);
            if (!distance) return null;
            const distanceKm = parseFloat(distance);
            const carSpeed = 50; // km/h
            const minutes = Math.round((distanceKm / carSpeed) * 60);
            return `${minutes} min`;
        },
        getEstimatedBikeTime(location) {
            const distance = this.getHaversineDistance(location);
            if (!distance) return null;
            const distanceKm = parseFloat(distance);
            const bikeSpeed = 20; // km/h
            const minutes = Math.round((distanceKm / bikeSpeed) * 60);
            return `${minutes} min`;
        },
        updateFilters() {
            this.filterData();
            if (this.map) {
                this.map.setZoom(15); // Zoom out to initial level on dropdown change
            }
            this.$emit('filters-updated', {
                selectedType: this.selectedType,
                searchQuery: this.searchQuery
            });
        },
        returnAction() {
            if (this.map) {
                this.map.setZoom(15); // Zoom out to initial level
                this.map = null; // Clear current map instance
                this.initMap(); // Reinitialize map
                this.addMarkers(); // Readd markers
                this.filterData(); // Refilter displayed locations
            }
            this.selectedLocation = null; // Close overlay
        },
        filterData() {
            this.noResults = this.displayedLocations.length === 0;

            if (this.map) {
                this.markers.forEach(marker => {
                    const shouldShow = this.displayedLocations.some(loc => loc.id === marker.locationId);
                    marker.setVisible(shouldShow);
                });
                this.map.setZoom(this.map.getZoom());
            }
        },
        initMap() {
            try {
                if (this.map) return;
                this.map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: 50.8323, lng: 12.9253 },
                    zoom: 15,
                    styles: [
                        {
                            featureType: 'poi',
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                });

                if (this.allLocations.length > 0) {
                    this.addMarkers();
                    this.filterData();
                }
            } catch (err) {
                this.error = 'Failed to initialize map: ' + err.message;
                console.error('Init Map Error:', err);
            }
        },
        addMarkers() {
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];

            this.allLocations.forEach(location => {
                if (!location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
                    console.warn('Invalid coordinates for location:', location);
                    return;
                }

                const icon = this.customIcons[location.type] || {
                    url: 'https://maps.google.com/mapfiles/kml/paddle/ylw-blank.png',
                    scaledSize: { width: 32, height: 32 }
                };

                const marker = new google.maps.Marker({
                    position: { lat: location.lat, lng: location.lng },
                    map: this.map,
                    title: location.name,
                    icon: icon
                });

                marker.locationType = location.type;
                marker.locationId = location.id;
                marker.locationData = location;

                marker.addListener('click', () => {
                    this.selectedLocation = location; // Directly set selectedLocation on click
                    if (this.map && marker.getPosition) {
                        this.map.setZoom(18);
                        this.map.setCenter(marker.getPosition());
                    }
                });

                marker.setVisible(true);
                this.markers.push(marker);
            });
        },
        getAddress(tags) {
            if (!tags) return 'Address not available';
            const street = tags['addr:street'] || '';
            const housenumber = tags['addr:housenumber'] || '';
            const postcode = tags['addr:postcode'] || '';
            const city = tags['addr:city'] || '';
            const address = `${street} ${housenumber}, ${postcode} ${city}`.trim();
            return address || 'Address not available';
        },
        truncateUrl(url) {
            return url.length > 30 ? url.slice(0, 27) + '...' : url;
        }
    }
};
</script>
