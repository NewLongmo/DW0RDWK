<template>
  <main class="home-page">
    <section class="home-hero">
      <FluidHeroScene />
      <header class="home-nav">
        <RouterLink class="home-brand" to="/">
          <span class="brand__mark">D</span>
          <strong>DW0RDWK</strong>
        </RouterLink>
        <nav>
          <RouterLink to="/support">自助查单</RouterLink>
          <RouterLink to="/register">注册代理</RouterLink>
          <RouterLink class="home-nav__login" to="/login">登录演示</RouterLink>
        </nav>
      </header>

      <div class="home-hero__content">
        <p class="home-kicker">Go + Vue 3 · 29 网课系统 · 运行监控</p>
        <h1>DW0RDWK</h1>
        <p class="home-lead">
          面向网课代理、货源对接和演示运营的完整工作台，包含订单提交、货源同步、运行监控、售后工单和插件框架。
        </p>
        <div class="home-actions">
          <RouterLink class="home-button home-button--primary" to="/login">进入演示后台</RouterLink>
          <RouterLink class="home-button" to="/support">查看订单售后</RouterLink>
        </div>
      </div>
      <div class="home-hero__signal">
        <span>演示站模式</span>
        <strong>真实下单与上游同步已关闭</strong>
      </div>
    </section>

    <section class="home-section">
      <div class="home-section__heading">
        <h2>核心能力</h2>
        <p>从公开查单到后台运营，演示站保留完整产品结构，敏感业务数据已清空。</p>
      </div>
      <div class="home-feature-grid">
        <article v-for="item in features" :key="item.title" class="home-feature">
          <span>{{ item.index }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="home-section home-section--runtime">
      <div class="runtime-board">
        <div>
          <p class="home-kicker">Runtime Map</p>
          <h2>订单、货源、Worker 与插件统一观测</h2>
          <p>运行监控以结构化任务状态展示最近执行、错误摘要和手动触发结果，适合演示系统完整度。</p>
        </div>
        <div class="runtime-lanes">
          <span v-for="item in runtimeItems" :key="item">{{ item }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import FluidHeroScene from '@/components/FluidHeroScene.vue';

const features = [
  { index: '01', title: '后台管理', text: '菜单、用户、代理、卡密、课程、分类和操作日志统一管理。' },
  { index: '02', title: '订单提交', text: '支持平台筛选、查课、批量账号整理、收藏和推荐下单。' },
  { index: '03', title: '货源对接', text: '29wk 货源、价格策略、词替换、同步配置和余额查询流程齐备。' },
  { index: '04', title: '运行监控', text: '展示队列、同步任务、Worker、代理池和插件运行状态。' },
];

const runtimeItems = ['API', 'MySQL', 'Redis', '29wk', 'Worker', 'Plugin'];
</script>

<style scoped>
.home-page {
  min-height: 100%;
  background: var(--color-bg-body);
  color: var(--color-text);
}

.home-hero {
  position: relative;
  display: grid;
  min-height: min(760px, 92vh);
  overflow: hidden;
  padding: 24px clamp(18px, 4vw, 56px) 72px;
  background:
    linear-gradient(180deg, rgb(14 16 20 / 12%), transparent 58%),
    var(--color-bg-body);
}

.home-hero::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 28%;
  background: linear-gradient(180deg, transparent, var(--color-bg-body));
  content: "";
  pointer-events: none;
}

.home-nav,
.home-hero__content,
.home-hero__signal {
  position: relative;
  z-index: 1;
}

.home-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 48px;
}

.home-brand,
.home-nav nav {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.home-brand,
.home-nav a {
  color: var(--color-text);
  text-decoration: none;
}

.home-nav nav {
  gap: 18px;
}

.home-nav__login {
  padding: 7px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: rgb(255 255 255 / 8%);
}

.home-hero__content {
  align-self: center;
  width: min(760px, 100%);
  padding: 72px 0 48px;
}

.home-kicker {
  margin: 0 0 12px;
  color: var(--color-brand);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.home-hero h1 {
  margin: 0;
  font-size: clamp(54px, 9vw, 112px);
  line-height: 0.92;
  letter-spacing: 0;
}

.home-lead {
  width: min(700px, 100%);
  margin: 22px 0 0;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.8;
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-weight: 700;
  text-decoration: none;
}

.home-button--primary {
  border-color: var(--color-brand);
  background: var(--color-brand);
  color: #fff;
}

.home-hero__signal {
  align-self: end;
  display: inline-grid;
  justify-self: start;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-bg-elevated) 74%, transparent);
  box-shadow: var(--shadow-card);
}

.home-hero__signal span {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.home-section {
  width: min(1180px, calc(100% - 36px));
  margin: 0 auto;
  padding: 44px 0;
}

.home-section__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.home-section h2 {
  margin: 0;
  font-size: 28px;
}

.home-section__heading p,
.runtime-board p {
  max-width: 620px;
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.home-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.home-feature {
  min-height: 178px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-card);
}

.home-feature span {
  color: var(--color-brand);
  font-weight: 800;
}

.home-feature h3 {
  margin: 26px 0 10px;
}

.home-feature p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.home-section--runtime {
  padding-bottom: 72px;
}

.runtime-board {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 24px;
  align-items: center;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background:
    linear-gradient(135deg, var(--color-brand-soft), transparent 55%),
    var(--color-bg-elevated);
  box-shadow: var(--shadow-card);
}

.runtime-lanes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.runtime-lanes span {
  display: grid;
  min-height: 72px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-subtle);
  font-weight: 800;
}

@media (max-width: 920px) {
  .home-feature-grid,
  .runtime-board {
    grid-template-columns: 1fr;
  }

  .home-section__heading {
    align-items: start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .home-nav {
    align-items: flex-start;
    height: auto;
  }

  .home-nav nav {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
  }

  .home-hero h1 {
    font-size: 52px;
  }

  .runtime-lanes {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
