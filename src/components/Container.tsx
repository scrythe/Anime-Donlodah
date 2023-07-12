import styles from "./Container.module.css";
import AnimeList from "./AnimeListSideBar";

function Container() {
  return (
    <section class={styles.container}>
        <AnimeList />
    </section>
  );
}

export default Container;
