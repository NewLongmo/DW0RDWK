import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Row,
  Segmented,
  Select,
  Slider,
  Space,
  Spin,
  Statistic,
  Switch,
  Tabs,
  Table,
  Tag,
  Timeline,
  Tooltip,
} from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import App from './App.vue';
import { setUnauthorizedHandler } from './api/http';
import { router } from './router';
import { useAppStore } from './stores/app';
import './styles/app.css';

const app = createApp(App);
const pinia = createPinia();

[
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Row,
  Segmented,
  Select,
  Slider,
  Space,
  Spin,
  Statistic,
  Switch,
  Tabs,
  Table,
  Tag,
  Timeline,
  Tooltip,
].forEach((component) => app.use(component));

app.use(pinia).use(router);

setUnauthorizedHandler(() => {
  const store = useAppStore(pinia);
  store.setAccount('');
  store.setRole('');
  if (router.currentRoute.value.path !== '/login') {
    router.replace('/login');
  }
});

app.mount('#app');
