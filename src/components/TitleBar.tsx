import styles from "./TitleBar.module.css";
import {Minimize, Maximize, Restore, Close} from "./WindowsBtnsSvg";
import { appWindow } from '@tauri-apps/api/window';

function TitleBar() {
    return (
      <div data-tauri-drag-region class={styles.titlebar}>
        <div class={styles.logoDiv}>
          <div class={styles.titleText}>Anime Donlodah</div>
        </div>
        <nav class={styles.titleBarNav}>
          <div class={styles.titlebarButton} id="titlebar-minimize" onClick={() => appWindow.minimize()}>
            <Minimize />
          </div>
          <div class={styles.titlebarButton} id="titlebar-maximize" onClick={() => appWindow.toggleMaximize()}>
            <Maximize />
          </div>
          <div class={`${styles.titlebarButton} ${styles.closeBtn}`} id="titlebar-close" onClick={() => appWindow.close()}>
            <Close />
          </div>
        </nav>
      </div>
    );
}

export default TitleBar;