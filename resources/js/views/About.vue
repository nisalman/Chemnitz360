<template>
    <div>
        <Header />
        <section class="container mx-auto px-6 py-16">
            <h2 class="text-3xl font-bold text-center mb-12">About</h2>
            <p class="text-gray-600 text-center">Learn more about MapDirectory and our mission.</p>
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