<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 px-4"
  >
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
      <!-- Login Header -->
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-gray-800">This Is For Admin</h1>
        <p class="text-sm text-gray-500 mt-1">Login to your account</p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="goDashBoard">
        <!-- Display Error -->
        <p
          v-if="error"
          class="text-sm text-red-500 bg-red-100 px-4 py-2 rounded-lg mb-4"
        >
          {{ error }}
        </p>

        <!-- Email Field -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            v-model="email"
            required
            placeholder="Enter your email"
            class="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            v-model="password"
            required
            placeholder="Enter your password"
            class="mt-2 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <!-- Login Button -->
        <div class="mt-6">
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </div>
      </form>

      <div class="text-center space-y-4">
        <p class="text-sm text-gray-500">
          <span class="text-red-500 font-semibold">
            You are not Admin. Please Go Back</span
          >
        </p>
        <button
          type="button"
          @click="openContact"
          class="bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router"; // Use useRouter for navigation

export default {
  setup(_, { emit }) {
    // Reactive state
    let email = ref("");
    let password = ref("");
    let error = ref(null);

    // Router instance
    let router = useRouter();

    // Function to handle login and navigation
    let goDashBoard = async () => {
      try {
        let userCredentials = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        if (userCredentials) {
          router.push({ name: "Dashboard" }); // Navigate to the Dashboard
        }
      } catch (err) {
        error.value = err.message; // Capture the error
      }
    };

    // Emit custom event
    let openContact = () => {
      emit("open-contact"); // Emit the "open-contact" event
    };

    // Return all variables and functions to the template
    return { openContact, goDashBoard, email, password, error };
  },
};
</script>

<style scoped>
/* Additional custom styles can go here */
</style>
