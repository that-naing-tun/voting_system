<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-blue-700">Random Codes Management</h1>
      <div class="flex gap-4">
        <!-- Button to open generate code modal -->
        <button
          @click="openGenerateModal"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
        >
          + Generate Codes
        </button>
        <!-- Button to go to Dashboard -->
        <button
          @click="goToDashboard"
          class="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          Go Dashboard
        </button>
      </div>
    </div>

    <!-- Modal for code generation -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg w-1/3">
        <h3 class="text-xl font-semibold text-blue-600 mb-4">
          Enter Number of Codes to Generate
        </h3>
        <input
          type="number"
          v-model="codeCount"
          class="border border-gray-300 p-2 w-full rounded-md mb-4"
          placeholder="Enter number of codes"
        />
        <div class="flex justify-between gap-4">
          <button
            @click="closeGenerateModal"
            :disabled="isSubmitting"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition focus:outline-none"
          >
            Cancel
          </button>
          <button
            @click="submitCodeGeneration"
            :disabled="isSubmitting"
            :class="{
              'bg-blue-600 hover:bg-blue-500': !isSubmitting,
              'bg-gray-400 cursor-not-allowed': isSubmitting,
            }"
            class="text-white px-6 py-2 rounded-lg font-semibold transition focus:outline-none"
          >
            {{ isSubmitting ? "Submitting" : "Submit" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div>
      <h2 class="text-xl font-semibold text-blue-600 mb-4">
        Kings Generated Codes
      </h2>
      <div class="overflow-x-auto">
        <table
          class="table-auto w-full text-left border-collapse border border-gray-200"
        >
          <thead>
            <tr class="bg-blue-100">
              <th class="px-4 py-2 border border-gray-300">ID</th>
              <th class="px-4 py-2 border border-gray-300">Code</th>
              <th class="px-4 py-2 border border-gray-300">Student ID</th>
              <th class="px-4 py-2 border border-gray-300">Used</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(codeData, index) in codes"
              :key="index"
              class="hover:bg-gray-100"
            >
              <td class="px-4 py-2 border border-gray-300">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ codeData.code }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ codeData.studentId || "Not Assigned" }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ codeData.used ? "Yes" : "No" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebase/config"; // Adjust the import path to your Firebase config
import { doc, getDoc, setDoc } from "firebase/firestore";

// Function to generate a random code
const generateRandomCode = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // Generate an 8-digit code
};

export default {
  setup() {
    const router = useRouter();
    const codes = ref([]); // Store the list of random codes
    const isModalOpen = ref(false); // Controls modal visibility
    const codeCount = ref(0); // The number of codes to generate
    const isSubmitting = ref(false); // Tracks whether the form is being submitted

    // Navigate to the dashboard
    const goToDashboard = () => {
      router.push("/admin/dashboard");
    };

    // Open the generate code modal
    const openGenerateModal = () => {
      isModalOpen.value = true;
    };

    // Close the generate code modal
    const closeGenerateModal = () => {
      isModalOpen.value = false;
    };

    // Handle the code generation
    const submitCodeGeneration = async () => {
      if (codeCount.value <= 0) {
        alert("Please enter a valid number of codes.");
        return;
      }

      isSubmitting.value = true; // Disable buttons and change text

      const codesSet = new Set(); // Use a Set to ensure unique codes

      // Generate unique random codes
      while (codesSet.size < codeCount.value) {
        codesSet.add(generateRandomCode());
      }

      // Format the codes into an array of objects
      const codesArray = Array.from(codesSet).map((code) => ({
        code,
        used: false,
        studentId: null,
      }));

      try {
        // Save the generated codes to Firestore
        const codesDocument = doc(db, "kingsRandomCodes", "uniqueDocumentID"); // Replace 'uniqueDocumentID'
        await setDoc(codesDocument, { kingsCodes: codesArray });

        alert("Random codes generated and stored successfully!");
        closeGenerateModal(); // Close the modal after submission
      } catch (error) {
        console.error("Error generating codes:", error);
      } finally {
        isSubmitting.value = false; // Re-enable the buttons after submission
      }
    };

    // Load codes once using getDocs
    const loadCodesOnce = async () => {
      try {
        const codesDocument = doc(db, "kingsRandomCodes", "uniqueDocumentID");
        const docSnap = await getDoc(codesDocument);
        if (docSnap.exists()) {
          codes.value = docSnap.data().kingsCodes || [];
        } else {
          console.log("No codes found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching codes:", error);
      }
    };

    // Load codes when the component is mounted
    onMounted(() => {
      loadCodesOnce();
    });

    return {
      codes,
      goToDashboard,
      openGenerateModal,
      closeGenerateModal,
      submitCodeGeneration,
      isModalOpen,
      codeCount,
      isSubmitting,
    };
  },
};
</script>

<style>
/* Optional styling for customization */
</style>
