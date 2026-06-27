<template>
  <section class="page dashboard-page">
    <div class="dashboard-hero">
      <FluidHeroScene variant="panel" />
      <div class="dashboard-hero__content">
        <p class="home-kicker">Admin Console</p>
        <h1>控制台</h1>
        <p>查看订单、队列、用户和课程的实时运行概览。</p>
      </div>
      <div class="dashboard-hero__status">
        <span>演示站运行中</span>
        <strong>Redis + MySQL</strong>
        <a-button :loading="loading" @click="load">刷新</a-button>
      </div>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="6" v-for="card in overviewCards" :key="card.title">
        <a-card :bordered="false" class="metric-card metric-card--featured">
          <a-statistic :title="card.title" :value="card.value" />
          <div class="metric-extra">{{ card.extra }}</div>
        </a-card>
      </a-col>
    </a-row>

    <div class="dashboard-grid">
      <a-card :bordered="false" title="队列态势" class="dashboard-panel">
        <div class="status-matrix">
          <div v-for="card in queueCards" :key="card.title">
            <span>{{ card.title }}</span>
            <strong>{{ card.value }}</strong>
          </div>
        </div>
      </a-card>
      <a-card :bordered="false" title="资源概览" class="dashboard-panel">
        <div class="resource-list">
          <div v-for="card in resourceCards" :key="card.title">
            <span>{{ card.title }}</span>
            <strong>{{ card.value }}</strong>
          </div>
        </div>
      </a-card>
    </div>

    <a-alert
      class="page-note"
      type="info"
      show-icon
      :message="cacheMessage"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { fetchDashboard, fetchSettings, type DashboardStats } from '@/api/admin';
import FluidHeroScene from '@/components/FluidHeroScene.vue';

const loading = ref(false);
const cacheSeconds = ref(30);
const stats = ref<DashboardStats>({
  users: 0,
  classes: 0,
  orders: 0,
  pending: 0,
  flashOrders: 0,
  flashPending: 0,
  queueOrders: 0,
  queueRefreshes: 0,
  queueSubmit: 0,
  queueSubmitFlash: 0,
  queueRefresh: 0,
  queueRefreshFlash: 0,
  activeUsers: 0,
  onlineClasses: 0,
});

const overviewCards = computed(() => [
  { title: '用户总数', value: stats.value.users, extra: `启用 ${stats.value.activeUsers}` },
  { title: '课程总数', value: stats.value.classes, extra: `上架 ${stats.value.onlineClasses}` },
  { title: '订单总数', value: stats.value.orders, extra: `待处理 ${stats.value.pending}` },
  { title: '提交队列', value: stats.value.queueOrders, extra: `刷新队列 ${stats.value.queueRefreshes}` },
]);

const queueCards = computed(() => [
  { title: '普通提交', value: stats.value.queueSubmit },
  { title: '极速提交', value: stats.value.queueSubmitFlash },
  { title: '普通刷新', value: stats.value.queueRefresh },
  { title: '极速刷新', value: stats.value.queueRefreshFlash },
]);

const resourceCards = computed(() => [
  { title: '待处理订单', value: stats.value.pending },
  { title: '极速订单', value: stats.value.flashOrders },
  { title: '待处理极速单', value: stats.value.flashPending },
  { title: '上架课程', value: stats.value.onlineClasses },
]);

const cacheMessage = computed(
  () => `Redis 会缓存控制台指标 ${cacheSeconds.value} 秒；列表数据仍直接读取 MySQL，保证页面信息新鲜。`,
);

async function load() {
  loading.value = true;
  try {
    const [dashboard, settings] = await Promise.all([fetchDashboard(), fetchSettings()]);
    stats.value = dashboard;
    cacheSeconds.value = normalizeCacheSeconds(settings.dashboard_cache_seconds);
  } catch (error) {
    message.error(error instanceof Error ? error.message : '控制台加载失败');
  } finally {
    loading.value = false;
  }
}

function normalizeCacheSeconds(value: string | undefined) {
  const parsed = Number(value || 30);
  if (!Number.isFinite(parsed)) {
    return 30;
  }
  return Math.min(Math.max(Math.trunc(parsed), 5), 3600);
}

onMounted(load);
</script>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 16px;
}

.dashboard-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
  min-height: 230px;
  overflow: hidden;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, var(--color-bg-elevated), color-mix(in srgb, var(--color-brand) 12%, var(--color-bg-elevated))),
    var(--color-bg-elevated);
  box-shadow: var(--shadow-card);
}

.dashboard-hero__content,
.dashboard-hero__status {
  position: relative;
  z-index: 1;
}

.dashboard-hero h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.15;
}

.dashboard-hero p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
}

.dashboard-hero__status {
  display: grid;
  gap: 8px;
  justify-items: end;
}

.dashboard-hero__status span {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
  gap: 16px;
}

.dashboard-panel {
  border-radius: var(--radius-lg);
}

.status-matrix,
.resource-list {
  display: grid;
  gap: 10px;
}

.status-matrix {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.status-matrix div,
.resource-list div {
  display: grid;
  gap: 6px;
  min-height: 74px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-subtle);
}

.status-matrix span,
.resource-list span {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.status-matrix strong,
.resource-list strong {
  font-size: 24px;
}

@media (max-width: 920px) {
  .dashboard-hero,
  .dashboard-grid,
  .status-matrix {
    grid-template-columns: 1fr;
  }

  .dashboard-hero__status {
    justify-items: start;
  }
}
</style>
