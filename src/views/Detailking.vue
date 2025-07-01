<template>
  <div class="container mx-auto p-6" v-if="king">
    <!-- Navigation Bar (Already existing, assumed in your code) -->

    <!-- Image Box and Details -->
    <div class="bg-white shadow-lg rounded-lg p-6 mx-auto w-full max-w-md">
      <!-- Swiper Slider for images -->
      <swiper
        :modules="modules"
        :navigation="true"
        class="w-full h-auto rounded-t-lg mySwiper"
        :space-between="10"
        :slides-per-view="1"
        loop
      >
        <swiper-slide v-for="(image, index) in king.imageUrls" :key="index">
          <img
            class="w-full h-65 object-cover rounded-t-lg"
            :src="image"
            :alt="'Image ' + (index + 1)"
          />
        </swiper-slide>
      </swiper>

      <!-- Details Section -->
      <div class="text-center mt-4">
        <h2 class="text-3xl font-bold text-blue-700">Name : {{ king.name }}</h2>

        <button
          class="mt-6 py-2 px-4 rounded text-white focus:outline-none"
          :class="
            hasVoted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          "
          :disabled="hasVoted"
          @click="showRandomCodeForm"
        >
          {{ hasVoted ? "Vote Submitted" : "Vote" }}
        </button>
      </div>
    </div>
  </div>

  <!-- Error Handling -->
  <div v-else-if="error">
    {{ error }}
  </div>

  <!-- Loading Spinner -->
  <div v-else>
    <div class="flex justify-center items-center h-40">
      <div
        class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-800"
      ></div>
    </div>
  </div>

  <!-- Random Code Form as Modal -->
  <div v-if="showcodeForm">
    <Random
      :kingId="king?.id"
      @closeRandomCodeForm="showRandomCodeForm"
      @voteSubmitted="handleVoteSubmit"
    />
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Random from "../components/Random";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default {
  components: {
    Random,
    Swiper,
    SwiperSlide,
  },
  setup() {
    let route = useRoute();
    let king = ref(null);
    let error = ref("");
    let showcodeForm = ref(false);
    const hasVoted = ref(false);

    // Function to load king data from localStorage
    const loadKingDataFromLocalStorage = () => {
      const allKingsData = localStorage.getItem("kingsData");

      if (allKingsData) {
        // Parse the data from localStorage
        const parsedData = JSON.parse(allKingsData);

        // Access the 'data' array inside the parsed object
        const parsedKings = parsedData.data || [];

        // Find the king by ID from the 'data' array
        return parsedKings.find((king) => king.id === route.params.kingid);
      }
      return null; // Return null if not found
    };

    // Function to load king data from localStorage or Firebase
    const fetchKingData = () => {
      const cachedKing = loadKingDataFromLocalStorage();

      if (cachedKing) {
        king.value = cachedKing;

        // Check if user has already voted
        const votedKingId = localStorage.getItem("votedKingId");
        if (votedKingId || votedKingId === king.value.id) {
          hasVoted.value = true;
        }
      } else {
        error.value = "King not found in localStorage!";
      }
    };

    // Function to handle vote submission
    const handleVoteSubmit = () => {
      hasVoted.value = true; // Disable voting after submission

      // Store the voted king ID in localStorage to persist across page reloads
      localStorage.setItem("votedKingId", king.value.id);
    };

    // Show/Hide random code form
    const showRandomCodeForm = () => {
      showcodeForm.value = !showcodeForm.value;
    };

    onMounted(() => {
      fetchKingData();
    });

    // Watch effect to disable scrolling when the Random component is visible
    watchEffect(() => {
      if (showcodeForm.value) {
        // Disable scroll on body
        document.body.style.overflow = "hidden";
      } else {
        // Re-enable scroll on body
        document.body.style.overflow = "auto";
      }
    });

    // Define the Swiper modules
    const modules = [Navigation];

    // Return the values to be used in the template
    return {
      modules,
      king,
      hasVoted,
      error,
      showRandomCodeForm,
      showcodeForm,
      handleVoteSubmit,
    };
  },
};
</script>

<style scoped>
/* Custom styles for Swiper */
.mySwiper {
  max-width: 100%;
  overflow: hidden;
}
</style>
