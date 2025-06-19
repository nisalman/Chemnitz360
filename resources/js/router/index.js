import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/features',
        name: 'Features',
        component: () => import('../views/Features.vue')
    },
    {
        path: '/pricing',
        name: 'Pricing',
        component: () => import('../views/Pricing.vue')
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('../views/Contact.vue')
    },
    {
        path: '/get-started',
        name: 'GetStarted',
        component: () => import('../views/GetStarted.vue')
    },
    {
        path: '/sign-up',
        name: 'SignUp',
        component: () => import('../views/SignUp.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/privacy',
        name: 'Privacy',
        component: () => import('../views/Privacy.vue')
    },
    {
        path: '/terms',
        name: 'Terms',
        component: () => import('../views/Terms.vue')
    },
    {
        path: '/details/:id/:name',
        name: 'Details',
        component: () => import('../views/Details.vue'),
        props: true // Pass route params as props to Details.vue
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
