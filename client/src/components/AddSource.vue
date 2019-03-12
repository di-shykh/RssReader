<template>
  <div class="container app-content">
    <div 
      v-for="source in source" 
      class="row block"
    >
      <div class="row">
        <div class="col-2">
          <img 
            v-if="source.img" 
            :src="source.img" 
            alt="source_icon" 
            class="img-thumbnail"
          >
        </div>
        <div class="col-10">
          <h2>{{ source.name }}</h2>
          <div>{{ source.description }}</div>
          <button 
            id="add" 
            class="btn btn-primary float-right" 
            @click="addNewSource(source)"
          >Add</button>
        </div>
      </div>
      <div class="container">
        <div class="row block-of-articles">
          <div v-for="article in articles(source)">
            <div class="col-2">
              <img 
                v-if="article.img" 
                :src="article.img" 
                alt="article_icon" 
                class="img-thumbnail"
              >
            </div>
            <div class="col-10">
              <h6>{{ article.title }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-show="isMenuSourceVisible" 
      class="menu menu-source"
    >
      <ul class="nav flex-column">
        <li
          v-for="cat in userCategories"
          @click="addSource({key:cat.key, name:cat.category.name, sources:cat.category.sources})"
        >{{ cat.category.name }}</li>
        <li 
          class="nav-item" 
          @click="addNewCatecory($event)"
        >+ New category</li>
      </ul>
    </div>
    <div 
      v-show="isMenuCategoryVisible" 
      class="menu menu-category"
    >
      <form>
        <div class="form-group">
          <label for="catName">Category name</label>
          <input 
            id="catName" 
            v-model="category" 
            type="text" 
            class="form-control"
          >
          <button 
            class="btn btn-success" 
            disabled 
            @click.stop.prevent="createNewCategory"
          >Create</button>
          <button 
            class="btn btn-light" 
            @click.stop.prevent="isMenuCategoryVisible=false"
          >Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMenuSourceVisible: false,
      isMenuCategoryVisible: false,
      x: null,
      y: null,
      category: '',
      currentSource: {},
    };
  },
  computed: {
    source() {
      return this.$store.getters['source/source'];
    },
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    userSources() {
      return this.$store.getters['userSources/sources'];
    },
    userCategories() {
      return this.$store.getters['userSources/categories'];
    },
  },
  watch: {
    category() {
      const menu = document.querySelector('.menu-category');
      const submitButton = menu.querySelector('.btn-success');
      if (this.category) {
        submitButton.removeAttribute('disabled');
      }
    },
  },
  methods: {
    addNewSource(source) {
      this.currentSource = source;
      let isSourceExists = false;
      this.userSources.some(item => {
        if (item.source.rssLink == this.currentSource.rssLink) {
          alert('This source already exists!');
          isSourceExists = true;
        }
      });
      if (!isSourceExists) {
        this.isMenuSourceVisible = !this.isMenuSourceVisible;
        const menu = document.querySelector('.menu-source');
        this.setCoordinatsOfPopUpMenu(menu);
      }
    },
    articles(source) {
      return source.articles.slice(0, 3);
    },
    addNewCatecory() {
      this.isMenuSourceVisible = false;
      this.isMenuCategoryVisible = !this.isMenuCategoryVisible;
      const menu = document.querySelector('.menu-category');
      this.setCoordinatsOfPopUpMenu(menu);
    },
    setCoordinatsOfPopUpMenu(menu) {
      const buttonAdd = document.querySelector('#add');
      const rec = buttonAdd.getBoundingClientRect();
      this.x = rec.left + window.scrollX;
      this.y = rec.top + window.scrollY;
      if (menu) {
        menu.style.left = `${this.x - 200}px`;
        menu.style.top = `${this.y + 50}px`;
      }
    },
    createNewCategory() {
      let isSourceExists = false;
      this.userSources.some(item => {
        if (item.source.rssLink == this.currentSource.rssLink) {
          alert('This source already exists!');
          isSourceExists = true;
        }
      });
      if (!isSourceExists) {
        if (this.category.trim()) {
          const category = this.category.trim();
          this.isMenuCategoryVisible = false;
          this.currentSource.category = category;
          this.$store.dispatch('source/saveCurrentSourceInNewCategory', this.currentSource);
          this.category = '';
        }
        this.$store.dispatch('userSources/setCurrentSources');
        this.$store.dispatch('userSources/setUserCategories');
        this.isMenuSourceVisible = false;
        this.$router.push('/reader/articles');
      }
      this.isMenuSourceVisible = false;
    },
    addSource(cat) {
      //check if source is already in db
      let isSourceExists = false;
      this.userSources.find(item => {
        if (item.source.rssLink == this.currentSource.rssLink) {
          alert('This source already exists!');
          isSourceExists = true;
        }
      });
      if (!isSourceExists) {
        this.currentSource.category = cat.name;
        this.$store.dispatch('source/saveCurrentSourceInExistCategory', {
          source: this.currentSource,
          category_key: cat.key,
        });
        this.isMenuSourceVisible = false;
        this.$store.dispatch('userSources/setCurrentSources');
        this.$store.dispatch('userSources/setUserCategories');
        this.$router.push('/reader/articles');
      }
      this.isMenuSourceVisible = false;
    },
  },
};
</script>
<style scoped>
.menu {
  border: 1px solid #808080;
  -webkit-box-shadow: 0px 1px 1px #808080;
  -moz-box-shadow: 0px 1px 1px #808080;
  box-shadow: 0px 1px 1px #808080;
  border-radius: 2px;
  width: 250px;
  padding: 10px;
  padding-right: 20px;
  box-sizing: border-box;
  position: absolute;
  background: white;
}
.menu::before,
.menu::after {
  content: '';
  position: absolute;
  left: 200px;
  top: -20px;
  border: 10px solid transparent;
  border-bottom: 10px solid #808080;
}
.menu::after {
  border-bottom: 10px solid white;
  top: -19px;
}
.menu.menu-source li {
  cursor: pointer;
}
.menu.menu-source li:hover {
  text-decoration: underline;
}
.menu.menu-category button {
  margin-top: 10px;
}
.block {
  border: solid 1px #808080;
  border-radius: 5px;
  margin: 10px auto;
}
.block-of-articles {
  border-top: solid 1px #808080;
  margin-top: 10px;
}
</style>
