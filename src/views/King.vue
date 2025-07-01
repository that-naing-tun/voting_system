<template>
  <div>
    <!-- Displaying the kings data -->
    <div
      v-if="kings.length"
      class="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="king in kings"
        :key="king.id"
        class="bg-white shadow-lg rounded-lg p-6 mx-auto w-full max-w-md"
      >
        <img
          class="w-full h-65 object-cover rounded-t-lg"
          :src="king.imageUrls[0]"
          alt="King's Image"
          style="image-rendering: auto; -webkit-font-smoothing: antialiased"
        />

        <div class="text-center mt-4">
          <h2 class="text-3xl font-bold text-gray-800">{{ king.name }}</h2>

          <div v-if="isVotingOpen">
            <router-link
              :to="{ name: 'KingDetail', params: { kingid: king.id } }"
            >
              <button
                class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
              >
                See More
              </button>
            </router-link>
          </div>
          <div v-else>
            <button
              class="mt-4 bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed"
              disabled
            >
              Voting Close Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-else-if="error">
      {{ error }}
    </div>

    <!-- Loading spinner -->
    <div v-else>
      <div class="flex justify-center items-center h-40">
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-800"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config.js"; // Your Firebase config file

export default {
  setup() {
    const kings = ref([]);
    const isVotingOpen = ref(false);
    const error = ref(null);
    let unsubscribe = null; // To store the unsubscribe function for the snapshot listener

    // Function to load kings data from localStorage
    const loadKingsDataFromLocalStorage = () => {
      const cachedData = localStorage.getItem("kingsData");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheExpiry = Date.now() - parsedData.timestamp;
        if (cacheExpiry < 259200000) {
          return parsedData.data;
        }
      }
      return null;
    };

    // Function to fetch kings data from Firestore
    const fetchKingsData = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "kings"), orderBy("createdAt", "asc"))
        );
        const kingsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const { votes, ...dataWithoutVotes } = data;
          return {
            id: doc.id,
            ...dataWithoutVotes,
          };
        });

        localStorage.setItem(
          "kingsData",
          JSON.stringify({
            data: kingsData,
            timestamp: Date.now(),
          })
        );

        kings.value = kingsData;
      } catch (error) {
        console.error("Error fetching kings data:", error);
        error.value = "Failed to load data.";
      }
    };

    // Function to listen to voting status in real-time
    const listenToVotingStatus = () => {
      const statusDocRef = doc(db, "voteControl", "currentStatus");
      unsubscribe = onSnapshot(
        statusDocRef,
        (doc) => {
          if (doc.exists()) {
            isVotingOpen.value = doc.data().isVotingOpen;
          } else {
            console.warn("No such document for voting status!");
            isVotingOpen.value = false; // Default to false if document doesn't exist
          }
        },
        (error) => {
          console.error("Error listening to voting status:", error);
          error.value = "Failed to load voting status.";
        }
      );
    };

    onMounted(() => {
      const cachedData = loadKingsDataFromLocalStorage();
      if (cachedData) {
        kings.value = cachedData;
      } else {
        fetchKingsData();
      }

      // Start listening to voting status changes
      listenToVotingStatus();
    });

    onUnmounted(() => {
      // Unsubscribe from the snapshot listener when the component is unmounted
      if (unsubscribe) unsubscribe();
    });

    return {
      kings,
      isVotingOpen,
      error,
    };
  },
};
</script>

<style scoped>
.imgeHeight {
  height: 500px;
}
</style>
