<template>
  <el-config-provider namespace="ep">
    <div class="h-full flex flex-col bg-#fff dark:(bg-#272728)">
      <PageHeader p="y-12px r-24px" class="flex justify-end"></PageHeader>
      <MainView class="flex-1 overflow-hidden" />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import MainView from '@/pages/MainView.vue'
</script>

<style lang="scss" scoped></style>
