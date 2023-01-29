<template>
  <el-config-provider namespace="ep">
    <div class="h-full flex flex-col bg-#fff dark:(bg-#272728)">
      <div p="y-12px x-24px" class="flex justify-between">
        <Logo></Logo>
        <PageHeader></PageHeader>
      </div>
      <MainView class="flex-1 overflow-hidden" />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import MainView from '@/pages/MainView.vue'
</script>

<style lang="scss" scoped></style>
