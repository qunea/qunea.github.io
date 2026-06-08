function stonesApp() {
  return {
    stones: [],
    selectedPrefs: [],
    selectedTags: [],
    selected: null,
    currentImage: '',
    zoomShow: false,

    async init() {
      try {
        const response = await fetch('./data/stones.json');

        if (!response.ok) {
          throw new Error(`JSON読込失敗: ${response.status}`);
        }

        this.stones = await response.json();
        console.log('stones loaded:', this.stones.length);

      } catch (e) {
        console.error(e);
      }
    },

    prefectures() {
      return [...new Set(
        this.stones.map(s => s.prefecture)
      )].sort();
    },

    tags() {
      return [...new Set(
        this.stones.flatMap(s => s.tags)
      )].sort();
    },

    togglePref(pref) {
      if (this.selectedPrefs.includes(pref)) {
        this.selectedPrefs =
          this.selectedPrefs.filter(p => p !== pref);
      } else {
        this.selectedPrefs.push(pref);
      }
    },

    toggleTag(tag) {
      if (this.selectedTags.includes(tag)) {
        this.selectedTags =
          this.selectedTags.filter(t => t !== tag);
      } else {
        this.selectedTags.push(tag);
      }
    },

    filtered() {
      return this.stones
        .filter(s => {

          const matchPref =
            this.selectedPrefs.length === 0 ||
            this.selectedPrefs.includes(s.prefecture);

          const matchTags =
            this.selectedTags.length === 0 ||
            this.selectedTags.some(t => s.tags.includes(t));

          return matchPref && matchTags;
        })
        .sort((a, b) =>
          b.date.localeCompare(a.date)
        );
    },

    open(stone) {
      this.selected = stone;
      this.currentImage = stone.images[0];

      const preload = new Image();
      preload.src = stone.images[0];
    },

    zoomMove(e) {
      const img = this.$refs.mainImg;
      const lens = this.$refs.lens;

      if (!img || !lens) return;

      const rect = img.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lensSize = 200;
      const zoom = 3;

      lens.style.display = 'block';

      lens.style.left =
        (x - lensSize / 2) + 'px';

      lens.style.top =
        (y - lensSize / 2) + 'px';

      lens.style.backgroundImage =
        `url(${this.currentImage})`;

      lens.style.backgroundSize =
        `${img.width * zoom}px ${img.height * zoom}px`;

      lens.style.backgroundPosition =
        `-${x * zoom - lensSize / 2}px -${y * zoom - lensSize / 2}px`;
    }
  };
}