<template>
  <div
    class="min-h-screen bg-blue-100 flex flex-col justify-center items-center"
  >
    <!-- Header Section -->
    <header class="bg-blue-500 text-white w-full py-6">
      <h1 class="text-3xl font-bold text-center">
        Fresher Welcome Contact Page
      </h1>
    </header>

    <!-- Welcome Message -->
    <div v-if="!showform">
      <section
        class="mt-8 bg-white shadow-md rounded-lg p-8 text-center max-w-xl"
      >
        <h2 class="text-2xl font-semibold text-blue-600">
          Welcome to the University of Computer Studies Meiktila!
        </h2>
        <p class="text-gray-700 mt-4">
          We are excited to have you join us for the Fresher Welcome Event! If
          you have any questions or need assistance, feel free to contact us
          using the information below.
        </p>
      </section>

      <!-- Contact Details -->
      <section
        class="mt-6 bg-gray-100 shadow-inner rounded-lg p-8 text-left max-w-xl w-full"
      >
        <h3 class="text-xl font-bold text-blue-600">Contact Information</h3>
        <ul class="mt-4 space-y-3">
          <li class="text-gray-800">
            📞 <span class="font-semibold">Phone:</span> +09 205 9604
          </li>
          <li class="text-gray-800">
            📍 <span class="font-semibold">Address:</span> University of
            Computer Studies Meiktila, Myanmar
          </li>
          <li class="text-gray-800">
            🌐 <span class="font-semibold">Website:</span>
            <a
              href="https://ucsmtla.edu.mm"
              target="_blank"
              class="text-blue-500 hover:underline"
            >
              www.ucsm.edu
            </a>
          </li>
        </ul>
      </section>

      <!-- Developer Team Section -->
      <section
        class="mt-6 bg-gray-100 shadow-inner rounded-lg p-8 text-left max-w-xl w-full"
      >
        <h3 class="text-xl font-bold text-blue-600">Developer Team</h3>
        <ul class="mt-4 space-y-3">
          <li class="text-gray-800">
            👨‍💻 <span class="font-semibold">Mg That Naing Tun</span> - 5th Year
          </li>
          <li class="text-gray-800">
            👩‍💻 <span class="font-semibold">Mg Ye Linn Oo</span> - 5th Year
          </li>
          <li class="text-gray-800">
            👨‍💻 <span class="font-semibold">Mg Hlaing Min</span> - 4th Year
          </li>
          <li class="text-gray-800">
            👨‍💻 <span class="font-semibold">Mg Thant Zing Aung</span> - 4th Year
          </li>
        </ul>
      </section>

      <!-- Go to Dashboard Button -->
      <div class="mt-8">
        <button
          @click="showLogin"
          class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
    <Login v-if="showform" @open-contact="showLogin"></Login>
  </div>
</template>

<script>
import Login from "../components/Login";
import { ref } from "vue";

export default {
  components: { Login },
  setup() {
    let showform = ref(false);
    let showLogin = () => {
      showform.value = !showform.value;
    };
    return { showLogin, showform };
  },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
