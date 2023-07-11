import styles from "./AnimeListSideBar.module.css";
import { For } from "solid-js";

function AnimeList() {
    let listOfAnimes = ["Black Clover", "Hunter x Hunter", "Assasination Classroom", "Toradora"];
    listOfAnimes.push(...listOfAnimes);
    listOfAnimes.push(...listOfAnimes);
    listOfAnimes.push(...listOfAnimes);
    return (
        <section class={styles.animeListSidebar}>
            <input class={styles.searchInput} placeholder="Search for Animes..." />   
            <For each={listOfAnimes}>
                {(anime) => <button class={styles.animeListItem}>{anime}</button>}
            </For>
        </section>
    );
}

export default AnimeList;