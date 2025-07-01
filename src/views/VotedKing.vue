<template>
  <div class="container mx-auto p-6">
    <!-- Main Content (Only shown when king data exists) -->
    <div v-if="king && hasVoted">
      <!-- Welcome Text -->
      <div class="text-center mb-4">
        <p class="text-3xl font-bold text-blue-600">
          You voted for <span class="text-green-600">{{ king.name }}</span>
        </p>
      </div>

      <!-- King Details Section -->
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
              class="w-full h-auto object-cover rounded-t-lg"
              :src="image"
              :alt="'Image ' + (index + 1)"
            />
          </swiper-slide>
        </swiper>

        <!-- King Details -->
        <div class="text-center mt-4">
          <h2 class="text-3xl font-bold text-blue-700">
            Name: {{ king.name }}
          </h2>

          <!-- Vote Button -->
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

    <!-- If user has not voted yet, show a message -->
    <div v-else-if="king === null && !hasVoted">
      <div class="text-center mt-6">
        <h1 class="text-xl font-bold mb-4 text-red-600">
          You have not voted yet.
        </h1>
        <p class="text-center">
          Please go back and vote for your favorite king to see the details
          here.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const king = ref(null); // To store the voted king's data
    const hasVoted = ref(false); // Track if the user has already voted
    const modules = [Navigation];

    // Fetch the king's data based on the ID stored in localStorage
    const fetchVotedKing = () => {
      const votedKingId = localStorage.getItem("votedKingId");
      if (!votedKingId) {
        king.value = null;
        hasVoted.value = false;
        return;
      }
      // Retrieve all kings data from localStorage
      const kingsData = localStorage.getItem("kingsData"); // Use your actual key
      if (kingsData) {
        try {
          const parsedDatas = JSON.parse(kingsData);
          const parsedKings = parsedDatas.data || [];

          const votedKing = parsedKings.find((king) => king.id === votedKingId);
          if (votedKing) {
            king.value = votedKing;
            hasVoted.value = true;
          } else {
            console.log("Voted king not found.");
            king.value = null;
            hasVoted.value = false;
          }
        } catch (error) {
          console.error("Error parsing kingsData:", error);
          king.value = null;
          hasVoted.value = false;
        }
      } else {
        console.log("No kings data found in localStorage.");
        king.value = null;
        hasVoted.value = false;
      }
    };

    // Fetch the voted king data when the component is mounted
    onMounted(() => {
      fetchVotedKing();
    });

    // Simulate showing random code form (you can replace this function with your logic)
    const showRandomCodeForm = () => {
      console.log("Random Code Form displayed (You can replace this)");
    };

    return {
      king,
      hasVoted,
      modules,
      showRandomCodeForm,
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
