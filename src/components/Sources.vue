<template>
  <div class="container">
    <h1 class="row">Organize your sources</h1>
    <h3 class="row">Following {{countNumOfSources()}} sources</h3>
    <div class="row">
      <select class="form-control" v-model="selectedCategory" v-on:change="showSourcesInCategory()">
        <option selected="selected">All Your Sources</option>
        <option v-for="category in categories" v-bind:value="category">{{category.category.name}}</option>
      </select>
    </div>
    <div class="row">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" id="selectAll" @click="checkAll()" v-model="isCheckAll"> <label for="selectAll"> Select All</label></th>
            <th scope="col"><button class="btn btn-light" v-if="flag" @click="rename()"><i class="fas fa-pencil-alt"></i> Rename</button>
            <button class="btn btn-light">Change Category</button>
            <button class="btn btn-light"><i class="fas fa-trash"></i> Unfollow</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source,key) in shownSources">
            <th scope="row"><input type="checkbox" :value="source" v-model="checkedSources" @change='updateCheckAll()'><label for="source"></label></th><!--посмотреть почему не работает чекбокс по клику на ячейке-->
              <td>
                <div v-if="key===indexOfCheckedSource">
                  <input type="text" class="form-control" :value="source" id="newNameInput" required >
                  <button class="btn btn-success" @click="saveNewSourceName()">Save</button>
                  <button class="btn btn-default" @click.stop.prevent="indexOfCheckedSource=-1">Cancel</button>
                </div>
                <label v-else for="source">{{source}}</label>                  
              </td><!--посмотреть почему не работает чекбокс по клику на ячейке-->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedCategory: '',
      shownSources: [],
      checkedSources: [],
      isCheckAll: false,
      flag: true,
      indexOfCheckedSource: -1,
      newName: ''
    };
  },
  computed: {
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    categories() {
      return this.$store.getters['userSources/categories'];
    }
  },
  watch: {
    checkedSources() {
      if (this.checkedSources.length > 1) {
        this.flag = false;
      } else this.flag = true;
    }
  },
  methods: {
    countNumOfSources() {
      return this.sources.length;
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.checkedSources = [];
      if (this.isCheckAll) {
        for (const key in this.shownSources) {
          this.checkedSources.push(this.shownSources[key]);
        }
      }
    },
    updateCheckAll() {
      if (this.checkedSources.length === this.shownSources.length)
        this.isCheckAll = true;
      else this.isCheckAll = false;
    },
    showSourcesInCategory() {
      this.isCheckAll = false;
      this.newName = '';
      if (this.selectedCategory === 'All Your Sources') {
        this.shownSources = [];
        this.sources.map(item => {
          this.shownSources.push(item.source.name);
        });
      } else {
        this.shownSources = this.selectedCategory.category.sources;
      }
    },
    rename() {
      this.indexOfCheckedSource = this.shownSources.findIndex(
        el => el === this.checkedSources[0]
      );
    },
    saveNewSourceName() {
      this.indexOfCheckedSource = -1;
      //:value="source" conflicts with v-model on the same element because the latter already expands to a value binding internally
      this.newName = document.querySelector('#newNameInput').value;
      if (this.newName) {
        const source = this.sources.find(
          o => o.source.name === this.checkedSources[0]
        );
        const category = this.categories.find(o =>
          o.category.sources.includes(this.checkedSources[0])
        );
        const sourceIdInCategory = category.category.sources.findIndex(
          el => el === this.checkedSources[0]
        );
        this.$store.dispatch('userSources/saveNewSourceName', {
          source_key: source.key,
          category_key: category.key,
          sourceIdInCategory: sourceIdInCategory,
          newName: this.newName
        });
        this.categories = this.$store.getters['userSources/categories'];
        this.sources = this.$store.getters['userSources/sources'];
      } else alert('Please, fill the form!');
    }
  }
};
</script>
<style scoped>
h3 {
  color: gray;
}
.row {
  margin-bottom: 10px;
}
.form-control {
  margin-bottom: 10px;
}
</style>

