<template>
  <div class="container mx-auto p-6" v-if="queen">
    <!-- Navigation Bar -->

    <!-- Image Box and Details -->
    <div class="bg-white shadow-lg rounded-lg p-6 mx-auto w-full max-w-md">
      <!-- Swiper Slider for images -->
      <swiper
        :modules="modules"
        :navigation="true"
        class="w-full h-65 rounded-t-lg mySwiper"
        :space-between="10"
        :slides-per-view="1"
        loop
      >
        <swiper-slide v-for="(image, index) in queen.imageUrls" :key="index">
          <img
            class="w-full h-65 object-cover rounded-t-lg"
            :src="image"
            :alt="'Image ' + (index + 1)"
          />
        </swiper-slide>
      </swiper>

      <!-- Details Section -->
      <div class="text-center mt-4">
        <h2 class="text-3xl font-bold text-blue-700">
          Name : {{ queen.name }}
        </h2>

        <button
          class="mt-6 py-2 px-4 rounded text-white focus:outline-none"
          :class="
            hasVoted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          "
          :disabled="hasVoted"
          @click="showQueenRandomCodeForm"
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
  <div v-if="showQueenForm">
    <RandomQueen
      :queenID="queen?.id"
      @closeRandomCodeForm="showQueenRandomCodeForm"
      @voteSubmitted="handleVoteSubmit"
    />
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import RandomQueen from "../components/RandomQueen";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default {
  components: {
    RandomQueen,
    Swiper,
    SwiperSlide,
  },
  setup() {
    const route = useRoute();
    const queen = ref(null);
    const error = ref("");
    const showQueenForm = ref(false);
    const hasVoted = ref(false);

    // Function to load queen data from localStorage
    const loadQueenDataFromLocalStorage = () => {
      const allQueensData = localStorage.getItem("queensData");

      if (allQueensData) {
        const parsedData = JSON.parse(allQueensData);
        const parsedQueens = parsedData.data || [];
        return parsedQueens.find((queen) => queen.id === route.params.queenid);
      }
      return null;
    };

    // Function to fetch queen data
    const fetchQueenData = () => {
      const cachedQueen = loadQueenDataFromLocalStorage();

      if (cachedQueen) {
        queen.value = cachedQueen;

        // Check if user has already voted
        const votedQueenId = localStorage.getItem("votedQueenId");
        if (votedQueenId || votedQueenId === queen.value.id) {
          hasVoted.value = true;
        }
      } else {
        error.value = "Queen not found in localStorage!";
      }
    };

    // Show/Hide Random Code Form
    const showQueenRandomCodeForm = () => {
      showQueenForm.value = !showQueenForm.value;
    };

    // Handle Vote Submission
    const handleVoteSubmit = () => {
      hasVoted.value = true;
      localStorage.setItem("votedQueenId", queen.value.id);
    };

    onMounted(() => {
      fetchQueenData();
    });

    // Watch effect to handle scrolling
    watchEffect(() => {
      document.body.style.overflow = showQueenForm.value ? "hidden" : "auto";
    });

    const modules = [Navigation];

    return {
      queen,
      error,
      hasVoted,
      showQueenForm,
      showQueenRandomCodeForm,
      handleVoteSubmit,
      modules,
    };
  },
};
</script>

<style scoped>
.mySwiper {
  max-width: 100%;
  overflow: hidden;
}
</style>
