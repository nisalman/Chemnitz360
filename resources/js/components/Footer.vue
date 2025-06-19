<template>
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">MapDirectory</h3>
                    <p class="text-gray-400">Your go-to platform for finding places and businesses worldwide.</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Links</h3>
                    <ul class="space-y-2">
                        <li><router-link to="/about" class="text-gray-400 hover:text-white">About</router-link></li>
                        <li><router-link to="/privacy" class="text-gray-400 hover:text-white">Privacy Policy</router-link></li>
                        <li><router-link to="/terms" class="text-gray-400 hover:text-white">Terms of Service</router-link></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <p class="text-gray-400">Email: support@mapdirectory.com</p>
                    <p class="text-gray-400">Phone: (123) 456-7890</p>
                </div>
            </div>
            <div class="mt-8 text-center text-gray-400">
                © 2025 MapDirectory. All rights reserved.
            </div>
        </div>
    </footer>
</template>

<script>
export default {};
</script>
