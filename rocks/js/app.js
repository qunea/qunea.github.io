function stonesApp() {
  return {
    stones: [],
    selectedPrefs: [],
    selectedTags: [],
    selected: null,
    currentImage: '',
    zoomShow: false,

    async init() {
      const response = await fetch('./data/stones.json');
      this.stones = await response.json();
    },

    prefectures() {
      return [...new Set(this.stones.map(s => s.prefecture))].sort();
    },

    tags() {
      return [...new Set(
        this.stones.flatMap(s => s.tags)
        )].sort();
    }

    filtered() {
      return this.stones
        .filter(s => {
          const matchPref =
            this.selectedPrefs.length === 0 ||
            this.selectedPrefs.includes(s.prefecture);

          const stoneTags = s.tag.split(',').map(t => t.trim());

          const matchTags =
          this.selectedTags.length === 0 ||
          this.selectedTags.some(t => s.tags.includes(t));

          return matchPref && matchTags;
        })
        .sort((a, b) => b.date.localeCompare(a.date));
    },

    open(stone) {
      this.selected = stone;
      this.currentImage = stone.images[0];
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
      lens.style.left = (x - lensSize / 2) + 'px';
      lens.style.top = (y - lensSize / 2) + 'px';

      lens.style.backgroundImage = `url(${this.currentImage})`;
      lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

      lens.style.backgroundPosition =
        `-${x * zoom - lensSize / 2}px -${y * zoom - lensSize / 2}px`;
    }
  };
}