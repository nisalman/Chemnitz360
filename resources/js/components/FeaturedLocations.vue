<template>
    <section class="container mx-auto px-6 py-16">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Featured Locations in Chemnitz</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
                v-for="location in featuredLocations"
                :key="location.id"
                class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
                <img
                    :src="location.image"
                    :alt="location.name"
                    class="w-full h-48 object-cover"
                />
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ location.name }}</h3>
                    <p class="text-gray-600 mb-4">{{ location.description }}</p>
                    <router-link
                        :to="`/details/${location.id}/${encodeURIComponent(location.name)}`"
                        class="inline-block text-blue-600 font-semibold hover:text-blue-800"
                    >
                        Learn More
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'FeaturedLocations',
    props: {
        allLocations: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        featuredLocations() {
            // Select up to 3 locations with names (placeholder logic)
            return this.allLocations
                .filter(loc => loc.name !== 'Unknown' && loc.type === 'museum' || loc.type === 'theatre')
                .slice(0, 3)
                .map(loc => ({
                    ...loc,
                    image: this.getImage(loc.type),
                    description: loc.tags.description || `Explore this iconic ${loc.type} in Chemnitz.`
                }));
        }
    },
    methods: {
        getImage(type) {
            const images = {
                theatre: 'https://images.unsplash.com/photo-1519167758481-83f1bd47aa55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                artwork: 'https://images.unsplash.com/photo-1579783902614-a3db42110b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                museum: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            };
            return images[type] || images.museum;
        }
    }
};
</script>

<style scoped>
/* All styles handled by Tailwind */
</style>
