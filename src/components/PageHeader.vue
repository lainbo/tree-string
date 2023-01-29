<template>
  <div class="info_wrapper text-20px space-x-12px">
    <button icon-btn @click="toggleDark()">
      <i i-ph-sun-bold dark:i-ph-moon-bold />
    </button>
    <a href="https://github.com/lainbo/tree-string" target="_blank" rel="noopener">
      <i class="i-bi-github"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style lang="scss" scoped>
.info_wrapper i {
  @apply transition-color text-#383838b3 hover:text-#383838 dark:(text-#fff hover:text-#fff);
}
</style>
