<template>
  <a-layout class="admin-shell">
    <a-layout-sider v-model:collapsed="app.collapsed" collapsible width="232">
      <div class="brand">
        <span class="brand__mark">G</span>
        <span v-if="!app.collapsed" class="brand__text">代理中心</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :theme="app.theme === 'dark' ? 'dark' : 'light'"
        mode="inline"
        :items="items"
        @click="go"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="admin-header">
        <div class="admin-header__left">
          <a-button type="text" class="icon-button" @click="app.toggleCollapsed">
            <MenuFoldOutlined v-if="!app.collapsed" />
            <MenuUnfoldOutlined v-else />
          </a-button>
        </div>
        <div class="admin-header__right">
          <a-segmented :value="app.density" :options="densityOptions" @change="onDensity" />
          <a-tooltip :title="app.theme === 'dark' ? '切换浅色' : '切换深色'">
            <a-button type="text" class="icon-button" @click="app.toggleTheme">
              <BulbFilled v-if="app.theme === 'light'" />
              <BulbOutlined v-else />
            </a-button>
          </a-tooltip>
          <a-tag :bordered="false" color="blue">余额 {{ profile.balance.toFixed(2) }}</a-tag>
          <a-dropdown placement="bottomRight">
            <div class="header-user">
              <a-avatar :size="32" :style="{ background: 'var(--color-brand)' }">{{ avatarChar }}</a-avatar>
              <div>
                <div class="header-user__name">{{ app.account || profile.account || 'agent' }}</div>
                <div class="header-user__role">倍率 {{ profile.priceRate }}</div>
              </div>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="meta" disabled>
                  余额 {{ profile.balance.toFixed(2) }} · 倍率 {{ profile.priceRate }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="signOut">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="admin-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" @changed="loadProfile" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  AppstoreOutlined,
  BulbFilled,
  BulbOutlined,
  CreditCardOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { logout } from '@/api/admin';
import { fetchAgentProfile } from '@/api/user';
import { useAppStore } from '@/stores/app';

const app = useAppStore();
const route = useRoute();
const router = useRouter();
const selectedKeys = computed(() => [route.path]);
const profile = reactive({
  account: '',
  balance: 0,
  priceRate: 1,
});
const densityOptions = [
  { label: '标准', value: 'default' },
  { label: '紧凑', value: 'compact' },
];
const avatarChar = computed(() =>
  (app.account || profile.account || 'A').charAt(0).toUpperCase(),
);

const items = [
  { key: '/user/dashboard', icon: () => h(AppstoreOutlined), label: '代理概览' },
  { key: '/user/order-submit', icon: () => h(PlusOutlined), label: '订单提交' },
  { key: '/user/orders', icon: () => h(ShoppingCartOutlined), label: '我的订单' },
  { key: '/user/work-orders', icon: () => h(MessageOutlined), label: '工单系统' },
  { key: '/user/recharge', icon: () => h(CreditCardOutlined), label: '充值卡' },
  { key: '/user/agents', icon: () => h(TeamOutlined), label: '下级代理' },
  { key: '/user/account', icon: () => h(UserOutlined), label: '账号安全' },
];

function go(event: { key: string }) {
  router.push(event.key);
}

function onDensity(value: string | number) {
  app.setDensity(value === 'compact' ? 'compact' : 'default');
}

async function signOut() {
  try {
    await logout();
  } finally {
    app.setAccount('');
    app.setRole('');
    router.replace('/login');
  }
}

async function loadProfile() {
  try {
    const data = await fetchAgentProfile();
    profile.account = data.account;
    profile.balance = data.balance;
    profile.priceRate = data.priceRate;
    app.setAccount(data.account);
    app.setRole(data.role);
  } catch (error) {
    message.error(error instanceof Error ? error.message : '会话校验失败');
  }
}

onMounted(() => {
  void loadProfile();
});
</script>
