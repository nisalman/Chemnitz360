<template>
    <div>
        <Header />
        <section class="container mx-auto px-6 py-16">
            <h2 class="text-3xl font-bold text-center mb-12">Get Started</h2>
            <p class="text-gray-600 text-center">Begin your journey with MapDirectory today.</p>
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
    }
};
</script>