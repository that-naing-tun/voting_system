<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-blue-700">King Data Management</h1>
      <div class="flex gap-4">
        <button
          @click="toggleForm"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
        >
          + Add King
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
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Votes</th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Image</th>
            <th class="px-6 py-3 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(king, index) in kingData"
            :key="index"
            class="border-t hover:bg-gray-100 transition"
          >
            <td class="px-6 py-4 text-gray-700">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-gray-700">{{ king.id }}</td>
            <td class="px-6 py-4 text-gray-700">{{ king.name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ king.votes }}</td>
            <td class="px-6 py-4 text-gray-700">
              <img
                :src="king.imageUrls[0]"
                alt="King Image"
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

    <!-- Add King Form -->
    <Form v-if="showAddForm" @close="toggleForm" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js"; // Path to your Firebase config file
import Form from "@/components/Form.vue";

export default {
  components: {
    Form,
  },
  setup() {
    const kingData = ref([]);
    const router = useRouter();

    const showAddForm = ref(false);

    const toggleForm = () => {
      showAddForm.value = !showAddForm.value;
    };

    const goToDashboard = () => {
      router.push("/admin/dashboard");
    };

    // Fetch Kings Data from Firestore using getDocs for one-time fetch
    const fetchKings = async () => {
      const querySnapshot = await getDocs(collection(db, "kings"));
      kingData.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };

    // Fetch data on component mount
    onMounted(() => {
      fetchKings();
    });

    return {
      kingData,
      showAddForm,
      toggleForm,
      goToDashboard,
    };
  },
};
</script>
