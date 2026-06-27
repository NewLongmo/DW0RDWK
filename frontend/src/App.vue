<template>
  <a-config-provider :locale="zhCN" :theme="themeConfig" :render-empty="renderEmpty">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { Empty, theme as antTheme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useAppStore } from '@/stores/app';

const app = useAppStore();

const fontFamily =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif";

const themeConfig = computed(() => ({
  algorithm: app.theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    borderRadiusLG: 12,
    fontSize: 14,
    fontFamily,
  },
  components: {
    Menu: {
      itemHeight: 42,
      itemBorderRadius: 8,
      itemMarginInline: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
}));

function renderEmpty() {
  return h(Empty, {
    image: Empty.PRESENTED_IMAGE_SIMPLE,
    description: '暂无数据',
  });
}
</script>
