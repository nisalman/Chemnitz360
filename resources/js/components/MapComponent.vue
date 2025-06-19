<template>
    <section class="container mx-auto px-6 py-16">
        <div class="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">Locations in Chemnitz</h2>
            <!-- Items Per Page Dropdown -->
            <div class="flex justify-end mb-4">
                <select
                    v-model="itemsPerPage"
                    class="p-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option :value="10">10 per page</option>
                    <option :value="50">50 per page</option>
                    <option :value="100">100 per page</option>
                    <option :value="'all'">All</option>
                </select>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                    <tr class="bg-gray-200">
                        <th
                            class="p-3 text-left font-semibold cursor-pointer hover:bg-gray-300 transition-colors"
                            @click="sortBy('name')"
                        >
                            Name
                            <span v-if="sortKey === 'name'" class="ml-1">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th
                            class="p-3 text-left font-semibold cursor-pointer hover:bg-gray-300 transition-colors"
                            @click="sortBy('type')"
                        >
                            Type
                            <span v-if="sortKey === 'type'" class="ml-1">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th
                            class="p-3 text-left font-semibold cursor-pointer hover:bg-gray-300 transition-colors"
                            @click="sortBy('address')"
                        >
                            Address
                            <span v-if="sortKey === 'address'" class="ml-1">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="p-3 text-left font-semibold">Website</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="location in paginatedLocations"
                        :key="location.id"
                        @click="goToDetails(location)"
                        class="hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                        <td class="p-3 border-t border-gray-200">{{ location.name }}</td>
                        <td class="p-3 border-t border-gray-200">{{ location.type }}</td>
                        <td class="p-3 border-t border-gray-200">{{ getAddress(location.tags) }}</td>
                        <td class="p-3 border-t border-gray-200">
                            <a
                                v-if="location.tags.website"
                                :href="location.tags.website"
                                target="_blank"
                                class="text-blue-500 hover:underline"
                            >{{ truncateUrl(location.tags.website) }}</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-if="noResults" class="text-red-500 mt-2 text-center">No locations found</div>
            </div>
            <!-- Pagination Controls -->
            <div v-if="!noResults" class="flex justify-between items-center mt-4 flex-wrap gap-4">
                <div class="flex space-x-2">
                    <button
                        v-for="page in displayedPages"
                        :key="page"
                        @click="currentPage = page"
                        :class="[
                            'px-3 py-1 rounded-lg transition-colors',
                            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        ]"
                    >
                        {{ page }}
                    </button>
                    <span v-if="showEllipsis" class="px-3 py-1">...</span>
                </div>
                <div class="flex space-x-2">
                    <button
                        :disabled="currentPage === 1"
                        @click="currentPage--"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        :disabled="currentPage === totalPages"
                        @click="currentPage++"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'MapComponent',
    props: {
        allLocations: {
            type: Array,
            default: () => []
        },
        selectedType: {
            type: String,
            default: 'all'
        },
        searchQuery: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            sortKey: 'name',
            sortOrder: 'asc',
            currentPage: 1,
            itemsPerPage: 10 // Default to 10 items per page
        };
    },
    computed: {
        filteredLocations() {
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

            return filtered.sort((a, b) => {
                let keyA, keyB;
                if (this.sortKey === 'address') {
                    keyA = this.getAddress(a.tags).toLowerCase();
                    keyB = this.getAddress(b.tags).toLowerCase();
                } else {
                    keyA = a[this.sortKey].toLowerCase();
                    keyB = b[this.sortKey].toLowerCase();
                }
                if (this.sortOrder === 'asc') {
                    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
                } else {
                    return keyA > keyB ? -1 : keyA < keyB ? 1 : 0;
                }
            });
        },
        paginatedLocations() {
            if (this.itemsPerPage === 'all') {
                return this.filteredLocations;
            }
            const start = (this.currentPage - 1) * Number(this.itemsPerPage);
            const end = start + Number(this.itemsPerPage);
            return this.filteredLocations.slice(start, end);
        },
        totalPages() {
            if (this.itemsPerPage === 'all') {
                return 1;
            }
            return Math.ceil(this.filteredLocations.length / Number(this.itemsPerPage));
        },
        displayedPages() {
            const maxPagesToShow = 5;
            const total = this.totalPages;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(total, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        },
        showEllipsis() {
            return this.totalPages > 5 && this.currentPage < this.totalPages - 2;
        },
        noResults() {
            return this.filteredLocations.length === 0;
        }
    },
    watch: {
        selectedType() {
            this.currentPage = 1; // Reset to page 1 on filter change
        },
        searchQuery() {
            this.currentPage = 1; // Reset to page 1 on search change
        },
        itemsPerPage() {
            this.currentPage = 1; // Reset to page 1 on items per page change
        }
    },
    methods: {
        getAddress(tags) {
            if (!tags || !tags['addr:street']) return '';
            return `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}, ${tags['addr:postcode'] || ''} ${tags['addr:city'] || ''}`.trim();
        },
        goToDetails(location) {
            this.$router.push({
                path: `/details/${location.id}/${encodeURIComponent(location.name)}`
            });
        },
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
            this.currentPage = 1; // Reset to page 1 on sort
        },
        truncateUrl(url) {
            return url.length > 30 ? url.slice(0, 27) + '...' : url;
        }
    }
};
</script>

<style scoped>
/* All styles handled by Tailwind */
</style>
