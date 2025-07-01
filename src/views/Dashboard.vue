<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-blue-700 text-white">
      <div class="p-6 text-center">
        <h2 class="text-xl font-bold">Voting Dashboard</h2>
      </div>
      <nav>
        <ul>
          <li class="px-6 py-3 hover:bg-blue-600 cursor-pointer">
            <router-link
              :to="{ name: 'Crudking' }"
              class="flex items-center gap-2"
              >👑 King</router-link
            >
          </li>
          <li class="px-6 py-3 hover:bg-blue-600 cursor-pointer">
            <router-link
              :to="{ name: 'Crudqueen' }"
              class="flex items-center gap-2"
              >👸 Queen</router-link
            >
          </li>
          <li class="px-6 py-3 hover:bg-blue-600 cursor-pointer">
            <router-link
              :to="{ name: 'RandomCodes' }"
              class="flex items-center gap-2"
            >
              🎲👑 Generate Kings Codes
            </router-link>
          </li>
          <li class="px-6 py-3 hover:bg-blue-600 cursor-pointer">
            <router-link
              :to="{ name: 'RandomQueensCodes' }"
              class="flex items-center gap-2"
            >
              🎲👸 Generate Queens Codes
            </router-link>
          </li>
          <li class="px-6 py-3 hover:bg-blue-600 cursor-pointer">
            <router-link
              :to="{ name: 'VoteControl' }"
              class="flex items-center gap-2"
            >
              ⚙️ Vote Control
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Dashboard Content -->
    <main class="flex-1 p-4 md:p-6 overflow-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-green-500 text-center">
        Dashboard
      </h1>

      <!-- Total Votes Section -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <div class="bg-white shadow rounded-lg p-4 text-center">
          <h2 class="text-lg font-bold text-blue-700">Total Kings Votes</h2>
          <p class="text-2xl md:text-3xl font-bold text-gray-800">
            {{ totalKingsVotes }}
          </p>
        </div>
        <div class="bg-white shadow rounded-lg p-4 text-center">
          <h2 class="text-lg font-bold text-pink-700">Total Queens Votes</h2>
          <p class="text-2xl md:text-3xl font-bold text-gray-800">
            {{ totalQueensVotes }}
          </p>
        </div>
      </div>

      <!-- Most Voted Section -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold text-blue-700">Most Voted King</h2>
          <p class="text-gray-500">
            👑 {{ mostVotedKing.name }} - {{ mostVotedKing.votes }} votes
          </p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold text-pink-700">Most Voted Queen</h2>
          <p class="text-gray-500">
            👸 {{ mostVotedQueen.name }} - {{ mostVotedQueen.votes }} votes
          </p>
        </div>
      </div>

      <!-- Second Most Voted Section -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold text-blue-700">
            Second Most Voted King
          </h2>
          <p class="text-gray-500">
            👑 {{ secondMostVotedKing.name }} -
            {{ secondMostVotedKing.votes }} votes
          </p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold text-pink-700">
            Second Most Voted Queen
          </h2>
          <p class="text-gray-500">
            👸 {{ secondMostVotedQueen.name }} -
            {{ secondMostVotedQueen.votes }} votes
          </p>
        </div>
      </div>
      <!-- Third Most Voted Section -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold text-blue-700">Third Most Voted King</h2>
          <p class="text-gray-500">
            👑 {{ thirdMostVotedKing.name }} -
            {{ thirdMostVotedKing.votes }} votes
          </p>
        </div>
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold text-pink-700">
            Third Most Voted Queen
          </h2>
          <p class="text-gray-500">
            👸 {{ thirdMostVotedQueen.name }} -
            {{ thirdMostVotedQueen.votes }} votes
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "Dashboard",
  setup() {
    const totalKingsVotes = ref(0);
    const totalQueensVotes = ref(0);
    const mostVotedKing = ref({ name: "", votes: 0 });
    const mostVotedQueen = ref({ name: "", votes: 0 });
    const secondMostVotedKing = ref({ name: "", votes: 0 });
    const secondMostVotedQueen = ref({ name: "", votes: 0 });
    const thirdMostVotedKing = ref({ name: "", votes: 0 });
    const thirdMostVotedQueen = ref({ name: "", votes: 0 });

    let kingsUnsubscribe; // Unsubscribe function for kings snapshot
    let queensUnsubscribe; // Unsubscribe function for queens snapshot

    const fetchDataWithSnapshot = () => {
      // Real-time listener for Kings collection with sorting by votes
      const kingsRef = query(collection(db, "kings"), orderBy("votes", "desc"));
      kingsUnsubscribe = onSnapshot(
        kingsRef,
        (snapshot) => {
          const kingsData = [];
          snapshot.forEach((doc) => {
            kingsData.push({ id: doc.id, ...doc.data() });
          });

          // Compute Total Kings Votes
          totalKingsVotes.value = kingsData.reduce(
            (sum, king) => sum + (king.votes || 0),
            0
          );

          // Assign Most Voted Kings
          mostVotedKing.value = kingsData[0] || { name: "", votes: 0 };
          secondMostVotedKing.value = kingsData[1] || { name: "", votes: 0 };
          thirdMostVotedKing.value = kingsData[2] || { name: "", votes: 0 };
        },
        (error) => {
          console.error("Error fetching kings data:", error);
        }
      );

      // Real-time listener for Queens collection with sorting by votes
      const queensRef = query(
        collection(db, "queens"),
        orderBy("votes", "desc")
      );
      queensUnsubscribe = onSnapshot(
        queensRef,
        (snapshot) => {
          const queensData = [];
          snapshot.forEach((doc) => {
            queensData.push({ id: doc.id, ...doc.data() });
          });

          // Compute Total Queens Votes
          totalQueensVotes.value = queensData.reduce(
            (sum, queen) => sum + (queen.votes || 0),
            0
          );

          // Assign Most Voted Queens
          mostVotedQueen.value = queensData[0] || { name: "", votes: 0 };
          secondMostVotedQueen.value = queensData[1] || { name: "", votes: 0 };
          thirdMostVotedQueen.value = queensData[2] || { name: "", votes: 0 };
        },
        (error) => {
          console.error("Error fetching queens data:", error);
        }
      );
    };

    onMounted(fetchDataWithSnapshot);

    onBeforeUnmount(() => {
      if (kingsUnsubscribe) kingsUnsubscribe(); // Stop listening to Kings updates
      if (queensUnsubscribe) queensUnsubscribe(); // Stop listening to Queens updates
    });

    return {
      totalKingsVotes,
      totalQueensVotes,
      mostVotedKing,
      mostVotedQueen,
      secondMostVotedKing,
      secondMostVotedQueen,
      thirdMostVotedKing,
      thirdMostVotedQueen,
    };
  },
};
</script>
