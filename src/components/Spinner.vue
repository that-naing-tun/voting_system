<template>
  <div class="spin"></div>
</template>

<script>
export default {};
</script>

<style>
.spin {
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  margin: 30px auto;
  border-radius: 50%;
  border-top-color: red;
  animation: spin 1s infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
