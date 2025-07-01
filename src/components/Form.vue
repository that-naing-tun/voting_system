<template>
  <div v-if="visible" class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Fill Data</h1>
    <div class="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div class="mb-4">
          <label for="name" class="block text-gray-700 font-bold mb-2"
            >Name</label
          >
          <input
            id="name"
            v-model="name"
            type="text"
            class="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            required
          />
        </div>

        <!-- Image Upload -->
        <div class="mb-6">
          <label for="images" class="block text-gray-700 font-bold mb-2"
            >Upload Images</label
          >
          <input
            type="file"
            multiple
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            accept="image/*"
          />
        </div>

        <!-- Preview Selected Images -->
        <div class="mb-6 flex flex-wrap gap-4">
          <div
            v-for="(preview, index) in imagePreviews"
            :key="index"
            class="w-24 h-24 bg-gray-100 rounded overflow-hidden"
          >
            <img
              :src="preview"
              class="w-full h-full object-cover"
              alt="Selected image preview"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-4 flex justify-between">
          <button
            type="button"
            @click="closeForm"
            class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none"
          >
            Close Form
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Save Data
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config.js";
import s3 from "../aws/awsConfig.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const name = ref("");
    const files = ref([]);
    const imagePreviews = ref([]);

    const closeForm = () => {
      emit("close");
    };

    const handleFileUpload = (event) => {
      files.value = Array.from(event.target.files);
      imagePreviews.value = files.value.map((file) =>
        URL.createObjectURL(file)
      );
    };

    const submitForm = async () => {
      if (!name.value) {
        alert("Please fill out the name field.");
        return;
      }

      if (files.value.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      try {
        const imageUrls = [];
        for (const file of files.value) {
          const params = {
            Bucket: "voting-photo",
            Key: `kings/${Date.now()}_${file.name}`,
            Body: file,
            ContentType: file.type,
          };
          const uploadResult = await s3.upload(params).promise();
          imageUrls.push(uploadResult.Location);
        }

        await addDoc(collection(db, "kings"), {
          name: name.value,
          imageUrls,
          createdAt: serverTimestamp(),
          votes: 0,
        });

        name.value = "";
        files.value = [];
        imagePreviews.value = [];

        alert("Data saved successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("An error occurred while saving the data. Please try again.");
      }
    };

    return {
      name,
      files,
      imagePreviews,
      closeForm,
      handleFileUpload,
      submitForm,
    };
  },
};
</script>

<style scoped>
/* Tailwind CSS is used for styling */
</style>
