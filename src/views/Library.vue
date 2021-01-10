<template>
  <div class="hello">
    <!--
    <div class="grid">

    </div>
    -->
    <b-carousel
      style="{

      }"
      v-bind:interval="paused ? 0 : 3500"
      controls
      indicators
      id="carousel"
      no-hover-pause
      v-model="carouselIndex"
      ref="carousel"
    >
      <b-carousel-slide
        class="crisp"
        img-height="auto"
        img-width="10px"
        v-for="entry in existingInfoData"
        v-bind:key="entry.md5"
        background="black"
        v-bind:caption="entry.title"
        v-bind:text="entry.ckey"
        v-bind:id="entry.md5"
      >
        <template v-slot:img>
          <img v-bind:src="entry.dataUrl" v-bind:alt="entry.title" />
        </template>

        <router-link v-slot="{ href }" v-bind:to="`/${entry.md5}.png`">
          <b-link class="mx-2" v-bind:href="href">Pause/Permalink</b-link>
        </router-link>

        <b-link class="mx-2" v-on:click="download(entry.dataUrl, entry.md5)"
          >Download</b-link
        >
      </b-carousel-slide>
    </b-carousel>

    <div class="d-flex flex-wrap justify-content-center">
      <b-card
        class="m-1"
        v-for="entry in existingInfoData"
        v-bind:key="entry.md5"
      >
        <b-card-header>
          <b-card-img
            v-bind:alt="entry.title"
            top
            v-bind:src="entry.dataUrl"
            v-bind:style="{
              height: '20vh',
              width: 'auto'
            }"
          />
        </b-card-header>
        <b-card-title>
          {{ entry.title }}
        </b-card-title>
        <b-card-sub-title>
          {{ entry.ckey }}
        </b-card-sub-title>
        <b-card-footer>
          <router-link v-slot="{ href }" v-bind:to="`/${entry.md5}.png`">
            <b-link class="mx-2" v-bind:href="href">Select/Permalink</b-link>
          </router-link>

          <b-link class="mx-2" v-on:click="download(entry.dataUrl, entry.md5)"
            >Download</b-link
          >
        </b-card-footer>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { forceDownload } from "@/download";

@Component
export default class Library extends Vue {
  //Data
  // noinspection JSMismatchedCollectionQueryUpdate
  private infoData: Record<string, Entry> = {};
  private carouselIndex = 0;
  private initialCarouselIndex = 0;
  private paused = false;

  get existingInfoData() {
    return Object.values(this.infoData).filter(val => val.dataUrl != null);
  }

  mounted() {
    this.refresh();

    this.$watch("carouselIndex", (newVal: number) => {
      if (newVal != this.initialCarouselIndex && this.paused) {
        this.paused = false;
      }
    });
    this.$watch("$route.params.id", (newVal: string) => {
      this.goto(newVal);
    });
  }

  goto(id: string) {
    const found = this.existingInfoData.findIndex(val => {
      return val.md5 + ".png" === id;
    });
    if (found > 0) {
      this.carouselIndex = found;
      this.initialCarouselIndex = found;
      this.paused = true;
    } else {
      this.carouselIndex = Math.floor(
        Math.random() * this.existingInfoData.length
      );
    }
  }

  async refresh() {
    const info = await fetch("https://cdn.yogstation.net/paintings/.info.json");
    const infoData = (await info.json()).public as Info[];

    const obj = this.infoData;
    const work: Promise<void>[] = [];
    infoData.forEach(val => {
      const url = `https://cdn.yogstation.net/paintings/${val.md5}.png`;
      const newObj = Object.assign({ dataUrl: null }, val) as Entry;
      const promise = fetch(url)
        .then(response => response.blob())
        .then(blob => {
          newObj.dataUrl = URL.createObjectURL(blob);
          Vue.set(obj, val.md5 + ".png", newObj);
        });
      work.push(promise);
    });

    await Promise.all(work);

    this.$nextTick(() => {
      this.goto(this.$route.params.id);
    });
  }

  download(dataUrl: string, filename: string) {
    forceDownload(dataUrl, filename);
  }
}
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
img {
  height: 80vmin;
  width: auto;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.4);
  font-weight: bold;
}
@media (max-width: 500px) {
  .carousel-caption,
  .carousel-indicators {
    display: none;
  }
}
.carousel-caption > h3 {
  font-weight: bolder;
}
.carousel-caption > a {
  color: white;
  text-decoration: underline;
}
</style>
