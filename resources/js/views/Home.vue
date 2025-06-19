<template>
  <div>
    <Header @locations-updated="updateLocations" @filters-updated="updateFilters" />
    <MapComponent :all-locations="allLocations" :selected-type="selectedType" :search-query="searchQuery" />
    <FeaturedLocations :all-locations="allLocations" />
    <Cta />
    <Footer />
    <router-view :all-locations="allLocations" />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import MapComponent from '../components/MapComponent.vue';
import FeaturedLocations from '../components/FeaturedLocations.vue';
import Cta from '../components/Cta.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    MapComponent,
    FeaturedLocations,
    Cta,
    Footer
  },
  data() {
    return {
      allLocations: [],
      selectedType: 'all',
      searchQuery: ''
    };
  },
  methods: {
    updateLocations(locations) {
      this.allLocations = locations;
      console.log('Updated allLocations:', this.allLocations); // Debug log
    },
    updateFilters({ selectedType, searchQuery }) {
      this.selectedType = selectedType;
      this.searchQuery = searchQuery;
    }
  }
};
</script>
