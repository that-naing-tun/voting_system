<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Queen Data Management</h1>
      <div class="flex gap-4">
        <button
          @click="toggleForm"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
        >
          + Add Queen
        </button>
        <button
          @click="goToDashboard"
          class="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          Go Dashboard
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div
      v-if="!showAddForm"
      class="overflow-hidden rounded-lg shadow-lg border border-gray-200 mt-8"
    >
      <table class="table-auto w-full text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">
              Student ID
            </th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Votes</th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Image</th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(queen, index) in queenData"
            :key="index"
            class="border-t hover:bg-gray-100 transition"
          >
            <td class="px-6 py-4 text-gray-700">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-gray-700">{{ queen.id }}</td>
            <td class="px-6 py-4 text-gray-700">{{ queen.name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ queen.votes }}</td>
            <td class="px-6 py-4 text-gray-700">
              <img
                :src="queen.imageUrls[0]"
                alt="Queen Image"
                class="h-12 w-12 rounded-full border"
              />
            </td>
            <td class="px-6 py-4 flex gap-2">
              <button
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition"
              >
                ✏️ Edit
              </button>
              <button
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Queen Form -->
    <QueenForm v-if="showAddForm" @close="toggleForm" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import QueenForm from "../components/QueenForm";
import { useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js"; // Path to your Firebase config file

export default {
  components: {
    QueenForm,
  },
  setup() {
    const router = useRouter();
    const queenData = ref([]);
    const showAddForm = ref(false);

    const toggleForm = () => {
      showAddForm.value = !showAddForm.value;
    };

    const goToDashboard = () => {
      router.push("/admin/dashboard");
    };

    // Fetch Queens Data from Firestore using getDocs for one-time fetch
    const fetchQueens = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "queens"));
        queenData.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching queen data:", error);
      }
    };

    // Fetch data on component mount
    onMounted(() => {
      fetchQueens();
    });

    return {
      queenData,
      showAddForm,
      toggleForm,
      goToDashboard,
    };
  },
};
</script>
