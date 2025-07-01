<template>
  <header class="bg-cyan-500 p-4 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo Section (Left) -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <img
            src="https://voting-photo.s3.ap-southeast-1.amazonaws.com/kings/universitylogo.png"
            alt="Logo"
            class="h-16 md:h-16 lg:h-18 w-auto cursor-pointer"
          />
        </router-link>
      </div>

      <!-- Navigation Links (Right) -->
      <nav class="hidden md:flex space-x-6">
        <router-link
          to="/"
          class="text-white hover:text-gray-300"
          active-class="text-yellow-400 font-bold"
        >
          Home
        </router-link>
        <router-link
          to="/king"
          class="text-white hover:text-gray-300"
          active-class="text-yellow-400 font-bold"
        >
          King
        </router-link>
        <router-link
          to="/queen"
          class="text-white hover:text-gray-300"
          active-class="text-yellow-300 font-bold"
        >
          Queen
        </router-link>
        <router-link
          to="/votedKing"
          class="text-white hover:text-gray-300"
          active-class="text-yellow-300 font-bold"
        >
          Voted King
        </router-link>
        <router-link
          to="/votedQueen"
          class="text-white hover:text-gray-300"
          active-class="text-yellow-300 font-bold"
        >
          Voted Queen
        </router-link>
        <router-link
          to="/contact"
          class="text-white hover:text-gray-300"
          active-class="text-yellow-300 font-bold"
        >
          Contact
        </router-link>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu (Dropdown) -->
    <div v-if="isMenuOpen" class="md:hidden">
      <nav class="space-y-4 py-4 px-6 flex flex-col">
        <router-link
          to="/"
          class="text-red-500 hover:text-green-700"
          active-class="text-yellow-400 font-bold"
          exact-active-class="text-yellow-400 font-bold"
        >
          Home
        </router-link>
        <router-link
          to="/king"
          class="text-red-500 hover:text-green-700"
          active-class="text-yellow-400 font-bold"
        >
          King
        </router-link>
        <router-link
          to="/queen"
          class="text-red-500 hover:text-green-700"
          active-class="text-yellow-400 font-bold"
        >
          Queen
        </router-link>
        <router-link
          to="/votedKing"
          class="text-red-500 hover:text-green-700"
          active-class="text-yellow-300 font-bold"
        >
          Voted King
        </router-link>
        <router-link
          to="/votedQueen"
          class="text-red-500 hover:text-green-700"
          active-class="text-yellow-300 font-bold"
        >
          Voted Queen
        </router-link>
        <router-link
          to="/contact"
          class="text-red-500 hover:text-green-700"
          active-class="text-yellow-400 font-bold"
        >
          Contact
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const isMenuOpen = ref(false);
    let userInitiated = false; // To track if the menu is user-initiated

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
      userInitiated = true; // Mark as user-initiated when the menu is toggled
    };

    const closeMenuOnScroll = () => {
      if (!userInitiated && isMenuOpen.value) {
        isMenuOpen.value = false;
      }
      userInitiated = false; // Reset after the scroll event
    };

    // Lifecycle hooks to add/remove event listener
    onMounted(() => {
      window.addEventListener("scroll", closeMenuOnScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", closeMenuOnScroll);
    });

    return { isMenuOpen, toggleMenu };
  },
};
</script>

<style scoped>
/* Styling for the exact active route link */
.router-link-exact-active {
  color: yellow !important;
  font-weight: bold;
}
</style>
