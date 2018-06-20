<template>
  <div class="container app-content">
      <div class="row">
          <div class="col-2">
              <img :src="source.sImg" alt="source_icon" v-if="source.sImg" class="img-thumbnail">
          </div>
          <div class="col-10">
              <h2>{{source.sTitle}}</h2> 
              <div>{{source.sDescr}}</div>
              <button class="btn btn-primary float-right" @click="addNewSource($event)">Add</button>
          </div>
      </div>
      <hr>
      <div class="container">
        <div class="row">
          <div v-for="article in articles">
              <div class="col-2">
                  <img :src="article.img" alt="article_icon" v-if="article.img" class="img-thumbnail">
              </div>
              <div class="col-10">
                  <h6>{{article.title}}</h6> 
              </div>
          </div>
          <div v-show="isMenuSourceVisible" class="menu menu-source">
              <ul class="nav flex-column">
                  <li v-for="cat in userCategories" @click="addSource({key:cat.key,name:cat.category.name,sources:cat.category.sources})">{{cat.category.name}}</li>
                  <li class="nav-item" @click="addNewCatecory($event)">+ New category</li>
              </ul>
          </div>
          <div v-show="isMenuCategoryVisible" class="menu menu-category">
              <form>
                  <div class="form-group">
                      <label for="catName">Category name</label>
                      <input type="text" id="catName" class="form-control" v-model="category">
                      <button class="btn btn-success" disabled @click.stop.prevent="createNewCategory">Create</button>
                      <button class="btn btn-light" @click.stop.prevent="isMenuCategoryVisible=false">Cancel</button>
                  </div>
              </form>
          </div>
        </div>
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
      category: ''
    };
  },
  watch: {
    category() {
      const menu = document.querySelector('.menu-category');
      const submitButton = menu.querySelector('.btn-success');
      if (this.category) {
        submitButton.removeAttribute('disabled');
      }
    }
  },
  computed: {
    source() {
      return this.$store.getters['source/source'];
    },
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    articles() {
      return this.source.articles.slice(0, 3);
    },
    userSources() {
      return this.$store.getters['userSources/sources'];
    },
    userCategories() {
      return this.$store.getters['userSources/categories'];
    }
  },
  methods: {
    addNewSource(event) {
      this.isMenuSourceVisible = !this.isMenuSourceVisible;
      const menu = document.querySelector('.menu-source');
      this.x = event.screenX;
      this.y = event.screenY;
      if (menu) {
        menu.style.left = `${this.x - 230}px`;
        menu.style.top = `${this.y - 10}px`;
      }
    },
    addNewCatecory() {
      this.isMenuSourceVisible = false;
      this.isMenuCategoryVisible = !this.isMenuCategoryVisible;
      const menu = document.querySelector('.menu-category');
      if (menu) {
        menu.style.left = `${this.x - 230}px`;
        menu.style.top = `${this.y - 10}px`;
      }
    },
    createNewCategory() {
      if (this.category.trim()) {
        this.$store.dispatch('source/setCurrentCategory', this.category);
        this.isMenuCategoryVisible = false;
        this.$store.dispatch('source/saveCurrentSource');
        this.category = '';
      }
      this.$store.dispatch('userSources/setCurrentSources');
      this.$store.dispatch('userSources/setUserCategories');
      this.isMenuSourceVisible = false;
      this.$router.push('/reader/articles');
    },
    addSource(cat) {
      this.$store.dispatch('source/setCurrentCategory', cat);
      this.$store.dispatch('source/saveCurrentSourceInExistCategory');
      this.isMenuSourceVisible = false;
      this.$store.dispatch('userSources/setCurrentSources');
      this.$store.dispatch('userSources/setUserCategories');
      this.$router.push('/reader/articles');
    }
  }
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
/*.change-position {
  transform: translate(230px, 35px);
  -webkit-transform: translate(230px, 35px);
  -ms-transform: translate(230px, 35px);
}*/
</style>


