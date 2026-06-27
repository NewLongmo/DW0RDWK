<template>
  <section class="page user-dashboard-page">
    <div class="agent-hero">
      <FluidHeroScene variant="panel" />
      <div class="agent-hero__content">
        <p class="home-kicker">Agent Workspace</p>
        <h1>代理概览</h1>
        <p>查看余额、订单、公告和直属代理概况。</p>
      </div>
      <div class="agent-hero__balance">
        <span>账户余额</span>
        <strong>¥{{ Number(stats.balance).toFixed(2) }}</strong>
        <a-button @click="load" :loading="loading">刷新</a-button>
      </div>
    </div>

    <a-row :gutter="[12, 12]">
      <a-col :xs="24" :sm="12" :lg="6" v-for="item in metrics" :key="item.title">
        <a-card :bordered="false" class="metric-card">
          <a-statistic :title="item.title" :value="item.value" :precision="item.precision || 0" />
          <div v-if="item.extra" class="metric-extra">{{ item.extra }}</div>
        </a-card>
      </a-col>
    </a-row>

    <a-row class="notice-grid" :gutter="[16, 16]">
      <a-col v-if="stats.siteNotice" :xs="24" :lg="12">
        <a-card :bordered="false" title="全站公告">
          <div class="notice-text">{{ stats.siteNotice }}</div>
          <a v-if="stats.noticeUrl" :href="stats.noticeUrl" target="_blank" rel="noreferrer">订阅本站通知</a>
        </a-card>
      </a-col>
      <a-col v-if="stats.parentNotice" :xs="24" :lg="12">
        <a-card :bordered="false" title="上级公告">
          <div class="notice-text">{{ stats.parentNotice }}</div>
        </a-card>
      </a-col>
      <a-col v-if="stats.ownNotice" :xs="24" :lg="12">
        <a-card :bordered="false" title="我的代理公告">
          <div class="notice-text">{{ stats.ownNotice }}</div>
        </a-card>
      </a-col>
    </a-row>

    <a-card :bordered="false" class="trend-card" title="近7日订单趋势">
      <div class="mini-chart">
        <svg viewBox="0 0 700 220" preserveAspectRatio="none">
          <polyline :points="trendPoints" fill="none" stroke="var(--color-brand)" stroke-width="3" />
          <circle v-for="point in trendCircles" :key="point.key" :cx="point.x" :cy="point.y" r="4" fill="var(--color-brand)" />
        </svg>
        <div class="trend-labels">
          <span v-for="item in stats.trend7" :key="item.date">{{ item.date }}</span>
        </div>
      </div>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { fetchAgentDashboard, type AgentDashboard } from '@/api/user';
import FluidHeroScene from '@/components/FluidHeroScene.vue';

const loading = ref(false);
const popupShown = ref(false);
const stats = ref<AgentDashboard>({
  balance: 0,
  priceRate: 1,
  orders: 0,
  pending: 0,
  done: 0,
  failed: 0,
  todayOrders: 0,
  unfinished: 0,
  refreshing: 0,
  subAgents: 0,
  totalSpend: 0,
  siteNotice: '',
  popupNotice: '',
  noticeUrl: '',
  parentNotice: '',
  ownNotice: '',
  trend7: [],
});

const metrics = computed(() => [
  { title: '账户余额', value: stats.value.balance, precision: 2, extra: `今日订单 ${stats.value.todayOrders}` },
  { title: '总订单数', value: stats.value.orders, extra: `下级代理 ${stats.value.subAgents}` },
  { title: '待处理', value: stats.value.pending, extra: `未完成 ${stats.value.unfinished}` },
  { title: '已完成', value: stats.value.done, extra: `补刷中 ${stats.value.refreshing}` },
  { title: '失败订单', value: stats.value.failed },
  { title: '累计消费', value: stats.value.totalSpend, precision: 2 },
  { title: '价格倍率', value: stats.value.priceRate, precision: 4 },
  { title: '今日订单', value: stats.value.todayOrders },
]);

const trendPoints = computed(() => trendGeometry.value.points);
const trendCircles = computed(() => trendGeometry.value.circles);
const trendGeometry = computed(() => {
  const rows = stats.value.trend7 || [];
  const values = rows.map((row) => row.orders);
  const max = Math.max(1, ...values);
  const width = 700;
  const height = 220;
  const circles = values.map((value, index) => {
    const x = rows.length <= 1 ? 0 : (index / (rows.length - 1)) * width;
    const y = height - (value / max) * (height - 24) - 12;
    return { key: `${index}-${value}`, x, y };
  });
  return { points: circles.map((item) => `${item.x},${item.y}`).join(' '), circles };
});

async function load() {
  loading.value = true;
  try {
    stats.value = await fetchAgentDashboard();
    if (stats.value.popupNotice && !popupShown.value) {
      popupShown.value = true;
      Modal.info({
        title: '公告',
        content: stats.value.popupNotice,
      });
    }
  } catch (error) {
    message.error(error instanceof Error ? error.message : '代理概览加载失败');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void load();
});
</script>

<style scoped>
.user-dashboard-page {
  display: grid;
  gap: 16px;
}

.agent-hero {
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
    linear-gradient(135deg, var(--color-bg-elevated), color-mix(in srgb, var(--color-success) 10%, var(--color-bg-elevated))),
    var(--color-bg-elevated);
  box-shadow: var(--shadow-card);
}

.agent-hero__content,
.agent-hero__balance {
  position: relative;
  z-index: 1;
}

.agent-hero h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.15;
}

.agent-hero p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
}

.agent-hero__balance {
  display: grid;
  gap: 8px;
  justify-items: end;
  min-width: 190px;
}

.agent-hero__balance span {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.agent-hero__balance strong {
  font-size: 32px;
  line-height: 1;
}

.metric-extra {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
}

.trend-card {
  margin-top: 16px;
  border-radius: var(--radius-lg);
}

.mini-chart svg {
  width: 100%;
  height: 220px;
  border-bottom: 1px solid var(--color-border);
}

.trend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

@media (max-width: 920px) {
  .agent-hero {
    grid-template-columns: 1fr;
  }

  .agent-hero__balance {
    justify-items: start;
  }
}
</style>
