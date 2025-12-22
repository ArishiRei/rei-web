// 注册 Material Web 组件
// 注意：Web Components 必须在客户端运行
import '@material/web/all.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

export default defineNuxtPlugin(() => {
  if (typescaleStyles.styleSheet) {
    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
  }
});
