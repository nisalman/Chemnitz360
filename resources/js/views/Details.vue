<template>
    <div>
        <Header />
        <section class="container mx-auto px-6 py-16">
            <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">Location Details</h2>

            <div v-if="loading" class="text-center text-gray-500">Loading...</div>

            <div v-else-if="location" class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h3 class="text-2xl font-semibold mb-4">{{ location.name }}</h3>
                <p class="text-gray-600 mb-2"><strong>Type:</strong> {{ location.type }}</p>
                <p class="text-gray-600 mb-2"><strong>Address:</strong> {{ getAddress(location.tags) }}</p>

                <p v-if="location.tags.website" class="text-gray-600 mb-2">
                    <strong>Website:</strong>
                    <a :href="location.tags.website" target="_blank" class="text-blue-500 hover:underline">
                        {{ truncateUrl(location.tags.website) }}
                    </a>
                </p>

                <p v-if="location.tags.phone" class="text-gray-600 mb-2">
                    <strong>Phone:</strong> {{ location.tags.phone }}
                </p>

                <p v-if="location.tags.opening_hours" class="text-gray-600 mb-2">
                    <strong>Opening Hours:</strong> {{ location.tags.opening_hours }}
                </p>

                <p v-if="location.tags.description" class="text-gray-600 mb-2">
                    <strong>Description:</strong> {{ location.tags.description }}
                </p>

                <p v-else class="text-gray-600 mb-2">No additional details available.</p>

                <router-link to="/" class="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800">Back to Home</router-link>
            </div>

            <div v-else class="text-center text-red-500">Location not found. Please try again.</div>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            location: null,
            loading: true,
            error: null
        };
    },
    created() {
        this.fetchLocationDetails();
    },
    watch: {
        '$route.params.id': 'fetchLocationDetails' // React to route param change
    },
    methods: {
        async fetchLocationDetails() {
            this.loading = true;
            const id = this.$route.params.id;
            const name = this.$route.params.name;

            try {
                const query = `[out:json];node(${id});out body;`;
                const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.elements && data.elements.length) {
                    const element = data.elements[0];
                    this.location = {
                        id: element.id,
                        name: element.tags.name || decodeURIComponent(name),
                        type: element.tags.amenity || element.tags.tourism || 'unknown',
                        tags: element.tags
                    };
                } else {
                    throw new Error('No data found for this ID');
                }
            } catch (err) {
                this.error = err.message;
                console.error('Fetch Error:', err);
            } finally {
                this.loading = false;
            }
        },
        getAddress(tags) {
            if (!tags) return '';
            const street = tags['addr:street'] || '';
            const housenumber = tags['addr:housenumber'] || '';
            const postcode = tags['addr:postcode'] || '';
            const city = tags['addr:city'] || '';
            return `${street} ${housenumber}, ${postcode} ${city}`.trim();
        },
        truncateUrl(url) {
            return url.length > 30 ? url.slice(0, 27) + '...' : url;
        }
    }
};
</script>

<style scoped>
/* Tailwind handles all styling */
</style>
