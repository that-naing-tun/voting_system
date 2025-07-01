<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h1 class="text-2xl font-bold text-center text-blue-600 mb-4">
        Enter Your King Eight Digit Code
      </h1>
      <input
        v-model="code"
        type="text"
        placeholder="Enter Eight Digit Code Here"
        class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="clearError"
      />
      <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>
      <div class="flex justify-between">
        <button
          class="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
          :disabled="isSubmitting"
          @click="closeRandomForm"
          :style="isSubmitting ? { cursor: 'not-allowed' } : {}"
        >
          Cancel
        </button>
        <button
          class="py-2 px-4 text-white rounded-lg focus:outline-none"
          :class="{
            'bg-blue-500 hover:bg-blue-600': !isSubmitting,
            'bg-blue-300': isSubmitting,
          }"
          :disabled="isSubmitting"
          @click="submitVote"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Vote" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, runTransaction, increment } from "firebase/firestore";
import { db } from "../firebase/config";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export default {
  props: ["kingId"],
  setup(props, { emit }) {
    const code = ref("");
    const error = ref("");
    const isSubmitting = ref(false);
    const toast = useToast();

    const closeRandomForm = () => {
      emit("closeRandomCodeForm");
    };

    const clearError = () => {
      error.value = "";
    };

    const submitVote = async () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;

      if (!code.value) {
        error.value = "The code is required.";
        isSubmitting.value = false;
        return;
      }

      if (isNaN(Number(code.value))) {
        error.value = "Cannot use String. Please check and try again.";
        isSubmitting.value = false;
        return;
      }

      if (code.value.length !== 8) {
        error.value = "Your code must be exactly 8 digits.";
        isSubmitting.value = false;
        return;
      }

      try {
        await runTransaction(db, async (transaction) => {
          // Reference the kingsRandomCodes document
          const docRef = doc(db, "kingsRandomCodes", "uniqueDocumentID");
          const docSnap = await transaction.get(docRef);

          if (!docSnap.exists()) {
            throw new Error("Document not found!");
          }

          const data = docSnap.data();
          const kingsCodes = data.kingsCodes || [];

          const codeEntry = kingsCodes.find((item) => item.code === code.value);

          if (!codeEntry) {
            throw new Error(
              "Your code is invalid. Please check and try again."
            );
          }

          if (codeEntry.used) {
            throw new Error("This code has already been used.");
          }

          // Update the code entry
          codeEntry.studentId = props.kingId;
          codeEntry.used = true;

          // Update the document
          transaction.update(docRef, { kingsCodes });

          // Increment votes for the king
          const kingRef = doc(db, "kings", props.kingId);
          transaction.update(kingRef, {
            votes: increment(1),
          });
        });

        toast.success("Vote submitted successfully!", {
          timeout: 5000,
        });

        closeRandomForm();
        emit("voteSubmitted");
      } catch (err) {
        console.error(err);
        error.value =
          err.message || "An error occurred while submitting your vote.";
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      code,
      error,
      isSubmitting,
      closeRandomForm,
      submitVote,
      clearError,
    };
  },
};
</script>
