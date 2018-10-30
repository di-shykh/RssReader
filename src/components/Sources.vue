<template>
  <div class="container">
    <h1 class="row">Organize your sources</h1>
    <h3 class="row">Following {{ sources.length }} sources</h3>
    <div class="row">
      <select 
        v-model="selectedCategory" 
        class="form-control" 
        :required="true" 
        @change="showSourcesInCategory()"
      >
        <option>All Your Sources</option>
        <option 
          v-for="category in categories" 
          :value="category.category.name"
        >{{ category.category.name }}</option>
      </select>
    </div>
    <div class="row">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col"><input 
              id="selectAll" 
              v-model="isCheckAll" 
              type="checkbox" 
              @click="checkAll()"
            > <label for="selectAll"> Select All</label></th>
            <th scope="col"><button 
              v-if="isButRenameShown" 
              class="btn btn-light" 
              @click="findIndexOfSourceForRename()"
            ><i 
              class="material-icons" 
              style="font-size: 20px !important; vertical-align: middle;"
            >edit</i> Rename</button>
              <button 
                class="btn btn-light" 
                @click="showMenu($event)"
              >Change Category</button>
              <div 
                v-show="isDropdownVisible" 
                class="app-dropdown"
              >
                <a 
                  class="dropdown-item app-link" 
                  style="cursor: auto; text-decoration:none;"
                >Transfer sources to:</a>
                <div class="dropdown-divider" />
                <a 
                  v-for="category in categories" 
                  class="dropdown-item" 
                  @click="changeCategory($event)"
                >{{ category.category.name }}</a>
                <div class="dropdown-divider" />
                <a 
                  class="dropdown-item app-link" 
                  @click="isTexboxVisible=true"
                >+ Create new category</a>
                <div 
                  v-show="isTexboxVisible" 
                  class="form-group form-for-new-category"
                >
                  <label for="catName">Category name</label>
                  <input 
                    id="catName" 
                    v-model.trim="newCategoryName" 
                    type="text" 
                    class="form-control" 
                    @keyup.enter="changeCategory($event)"
                  >
                  <button 
                    class="btn btn-success" 
                    disabled 
                    @click.stop.prevent="changeCategory($event)"
                  >Create</button>
                  <button 
                    class="btn btn-light" 
                    @click.stop.prevent="isTexboxVisible=false"
                  >Cancel</button>
                </div>
              </div>
              <button 
                class="btn btn-light" 
                @click="unfollow()"
              ><i 
                class="material-icons" 
                style="font-size: 20px !important; vertical-align: middle;"
              >delete</i> Unfollow</button>
            </th>
          </tr>
        </thead>
        <tbody @click="hideDropdown()">
          <tr v-for="(source,key) in shownSources">
            <th scope="row"><input 
              :id="source"
              v-model="checkedSources" 
              type="checkbox" 
              :value="source" 
              @change="updateCheckAll()"
            ><label :for="source" /></th>
            <td>
              <div v-if="key===indexOfCheckedSource">
                <input 
                  id="newNameInput" 
                  type="text" 
                  class="form-control" 
                  :value="source" 
                  required 
                  @keyup.enter="saveNewSourceName()"
                >
                <button 
                  class="btn btn-success" 
                  @click="saveNewSourceName()"
                >Save</button>
                <button 
                  class="btn btn-default" 
                  @click.stop.prevent="indexOfCheckedSource=-1"
                >Cancel</button>
              </div>
              <label 
                v-else 
                :for="source"
              >{{ source }}</label>                  
            </td>
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
      selectedCategory: 'All Your Sources',
      shownSources: [],
      checkedSources: [],
      isCheckAll: false,
      isButRenameShown: true,
      indexOfCheckedSource: -1,
      newName: '',
      isDropdownVisible: false,
      isTexboxVisible: false,
      newCategoryName: '',
      categoryName: '',
    };
  },
  computed: {
    sources() {
      return this.$store.getters['userSources/sources'];
    },
    categories() {
      return this.$store.getters['userSources/categories'];
    },
  },
  watch: {
    checkedSources() {
      if (this.checkedSources.length > 1) {
        this.isButRenameShown = false;
      } else this.isButRenameShown = true;
    },
    newCategoryName() {
      const menu = document.querySelector('.form-for-new-category');
      const submitButton = menu.querySelector('.btn-success');
      if (this.newCategoryName) {
        submitButton.removeAttribute('disabled');
      }
    },
  },
  created() {
    this.showSourcesInCategory();
  },
  methods: {
    countNumOfSources() {
      return this.sources.length;
    },
    hideDropdown() {
      if (this.isDropdownVisible) this.isDropdownVisible = false;
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.checkedSources = [];
      if (this.isCheckAll) {
        this.checkedSources = Object.values(this.shownSources);
      }
    },
    updateCheckAll() {
      if (this.checkedSources.length === this.shownSources.length) this.isCheckAll = true;
      else this.isCheckAll = false;
    },
    showSourcesInCategory() {
      this.isCheckAll = false;
      this.newName = '';
      if (this.selectedCategory === 'All Your Sources') {
        this.shownSources = [];
        this.sources.map(item => {
          if (item.source.name != null) {
            this.shownSources.push(item.source.name);
          }
        });
      } else {
        this.shownSources = this.sources
          .filter(item => item.source.category == this.selectedCategory)
          .map(item => item.source.name);
      }
    },
    findIndexOfSourceForRename() {
      this.indexOfCheckedSource = this.shownSources.findIndex(el => el === this.checkedSources[0]);
    },
    saveNewSourceName() {
      this.indexOfCheckedSource = -1;
      //:value="source" conflicts with v-model on the same element because the latter already expands to a value binding internally
      this.newName = document.querySelector('#newNameInput').value;
      if (this.newName) {
        const source = this.sources.find(o => o.source.name === this.checkedSources[0]);
        const category = this.findCategory(this.checkedSources[0]);
        if (this.newName && source && category)
          this.$store.dispatch('userSources/saveNewSourceName', {
            sourceKey: source.key,
            category_key: category.key,
            source_name: source.source.name,
            new_name: this.newName,
          });
        this.checkedSources = [];
        this.showSourcesInCategory();
      } else alert('Please, fill out the form!');
    },
    unfollow() {
      this.checkedSources.forEach(element => {
        let source = this.sources.find(o => o.source.name === element);
        const category = this.findCategory(element);
        if (source && category) {
          this.$store.dispatch('userSources/unfollowSource', {
            sourceKey: source.key,
            category_key: category.key,
            source_name: source.source.name,
          });
        }
      });
      this.checkedSources = [];
      this.selectedCategory = 'All Your Sources';
      this.showSourcesInCategory();
    },
    changeCategory(event) {
      if (event.target.innerHTML === 'Create') {
        const newName = this.newCategoryName.trim();
        if (newName) {
          this.categoryName = newName;
          this.$store.dispatch('userSources/createNewCategory', this.categoryName);
        } else alert('Please, enter category name!');
      }
      if (event.target.value) {
        const newName = event.target.value.trim();
        if (newName) {
          this.categoryName = newName;
          this.$store.dispatch('userSources/createNewCategory', this.categoryName);
        } else alert('Please, enter category name!');
      } else this.categoryName = event.target.innerHTML.trim();
      this.checkedSources.forEach(item => {
        let source = this.sources.find(o => o.source.name === item);
        let oldCategory = this.findCategory(source.source.name);
        let newCategory = this.categories.find(item => item.category.name === this.categoryName);

        if (source && oldCategory && newCategory) {
          this.$store.dispatch('userSources/changeCategory', {
            sourceKey: source.key,
            old_category_key: oldCategory.key,
            new_category_key: newCategory.key,
            new_category_name: this.categoryName,
            source_name: source.source.name,
          });
        }
      });
      this.isDropdownVisible = false;
      this.isTexboxVisible = false;
      this.checkedSources = [];
      this.showSourcesInCategory();
    },
    showMenu(event) {
      if (this.checkedSources.length !== 0) {
        this.isDropdownVisible = !this.isDropdownVisible;
        const menu = document.querySelector('div.app-dropdown');
        if (menu) {
          menu.style.left = `${event.screenX}px`;
          menu.style.top = `${event.screenY}px`;
        }
      } else alert('You should choose at list one source to change category.');
    },
    findCategory(element) {
      const category = this.categories.find(category =>
        category.category.sources.some(o => o === element)
      );
      return category;
    },
  },
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
a.dropdown-item {
  cursor: pointer;
}
a.app-link,
a.app-link:hover {
  text-decoration: underline;
  color: green;
  font-weight: bold;
}
div.app-dropdown {
  position: absolute;
  z-index: 1;
  border: solid 2px lightgray;
  border-radius: 5px;
  background-color: white;
}
div.form-for-new-category {
  margin: 5px;
}
</style>
