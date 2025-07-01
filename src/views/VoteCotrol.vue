<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Vote Control Management</h1>
      <div class="flex gap-4">
        <button
          @click="goToDashboard"
          class="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          Go Dashboard
        </button>
      </div>
    </div>

    <!-- Control Buttons Section -->
    <div class="flex items-center justify-between gap-4">
      <!-- Left Side: Vote Open -->
      <div class="flex-1 flex justify-center flex-col items-center">
        <button
          @click="handleVoteOpen"
          :disabled="isVotingOpen"
          class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition disabled:opacity-50"
        >
          Vote Open
        </button>
        <div
          v-if="isVotingOpen"
          class="mt-3 flex items-center text-green-600 font-semibold text-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 110 12 6 6 0 010-12z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Vote is Open</span>
        </div>
      </div>

      <!-- Vertical Divider Line -->
      <div class="w-0.5 h-10 bg-gray-400"></div>

      <!-- Right Side: Vote Close -->
      <div class="flex-1 flex justify-center flex-col items-center">
        <button
          @click="handleVoteClose"
          :disabled="!isVotingOpen"
          class="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-500 transition disabled:opacity-50"
        >
          Vote Close
        </button>
        <div
          v-if="!isVotingOpen"
          class="mt-3 flex items-center text-red-600 font-semibold text-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 110 12 6 6 0 010-12z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Vote is Closed</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase/config"; // Adjust the path as needed
import { setDoc, doc, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import { useRouter } from "vue-router";
import { ref } from "vue"; // Import 'ref' from Vue

export default {
  setup() {
    const router = useRouter();

    // Reactive state to track vote status
    const isVotingOpen = ref(false);

    // Real-time listener to update the status from Firestore
    const voteControlRef = doc(db, "voteControl", "currentStatus");

    // Listen for real-time updates from Firestore
    onSnapshot(voteControlRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        isVotingOpen.value = data.isVotingOpen ?? false; // Update the reactive state based on the Firestore data
      }
    });

    // Function to go to the dashboard
    const goToDashboard = () => {
      router.push("/admin/dashboard");
    };

    // Function to handle opening the vote
    const handleVoteOpen = async () => {
      try {
        // Set the document to isVotingOpen: true
        await setDoc(voteControlRef, { isVotingOpen: true });

        console.log("Vote opened");
      } catch (error) {
        console.error("Error opening vote: ", error);
      }
    };

    // Function to handle closing the vote
    const handleVoteClose = async () => {
      try {
        // Set the document to isVotingOpen: false
        await setDoc(voteControlRef, { isVotingOpen: false });

        console.log("Vote closed");
      } catch (error) {
        console.error("Error closing vote: ", error);
      }
    };

    return {
      goToDashboard,
      handleVoteOpen,
      handleVoteClose,
      isVotingOpen, // Expose to the template
    };
  },
};
</script>

<style scoped></style>
