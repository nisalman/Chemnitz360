<template>
    <transition name="slide">
        <div v-if="visible" class="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-lg z-50 overflow-auto p-6">
            <button @click="close" class="absolute top-4 right-4 text-xl font-bold">×</button>
            <h3 class="text-2xl font-semibold mb-4">{{ location.name }}</h3>
            <p><strong>Type:</strong> {{ location.type }}</p>
            <p><strong>Address:</strong> {{ getAddress(location.tags) }}</p>
            <p v-if="location.tags.website"><strong>Website:</strong> <a :href="location.tags.website" target="_blank">{{ location.tags.website }}</a></p>
            <p v-if="location.tags.phone"><strong>Phone:</strong> {{ location.tags.phone }}</p>
            <p v-if="location.tags.opening_hours"><strong>Hours:</strong> {{ location.tags.opening_hours }}</p>
            <p v-if="location.tags.description"><strong>Description:</strong> {{ location.tags.description }}</p>
        </div>
    </transition>
</template>

<script>
export default {
    props: ['visible', 'location'],
    emits: ['close'],
    methods: {
        close() {
            this.$emit('close');
        },
        getAddress(tags) {
            if (!tags) return '';
            const street = tags['addr:street'] || '';
            const housenumber = tags['addr:housenumber'] || '';
            const postcode = tags['addr:postcode'] || '';
            const city = tags['addr:city'] || '';
            return `${street} ${housenumber}, ${postcode} ${city}`.trim();
        }
    }
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>
