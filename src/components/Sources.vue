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
            <th scope="col"><input type="checkbox" id="selectAll" @change="checkAll()" v-model="checked"> <label for="selectAll"> Select All</label></th>
            <th scope="col"><button class="btn btn-light" v-if="flag" @click="rename()"><i class="fas fa-pencil-alt"></i> Rename</button>
            <button class="btn btn-light">Change Category</button>
            <button class="btn btn-light"><i class="fas fa-trash"></i> Unfollow</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in shownSources">
            <th scope="row"><input type="checkbox" :value="source" v-model="checkedSources"><label for="source"></label></th><!--посмотреть почему не работает чекбокс по клику на ячейке-->
            <td><label for="source">{{source}}</label></td><!--посмотреть почему не работает чекбокс по клику на ячейке-->
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
      checked: false,
      flag: true
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
      const checkboxes = document.querySelectorAll(
        'tbody input[type=checkbox]'
      );
      if (this.checked) {
        for (let i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = true;
        }
      } else
        for (let i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = false;
        }
    },
    showSourcesInCategory() {
      this.checked = false;
      this.checkAll();
      if (this.selectedCategory === 'All Your Sources') {
        this.shownSources = [];
        this.sources.map(item => {
          this.shownSources.push(item.source.name);
        });
      } else {
        this.shownSources = this.selectedCategory.category.sources;
      }
    },
    rename() {}
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
</style>

