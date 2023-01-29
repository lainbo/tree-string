<template>
  <MainView />
</template>

<script setup lang="ts">
import MainView from '@/pages/MainView.vue'
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style lang="scss" scoped></style>
