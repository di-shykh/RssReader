<template>
  <div class="container">
    <h1 class="row">Organize your sources</h1>
    <h3 class="row">Following {{sources.length}} sources</h3>
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
            <th scope="col"><button class="btn btn-light" v-if="flag" @click="rename()"><i class="material-icons" style="font-size: 20px !important; vertical-align: middle;">edit</i> Rename</button>
            <button class="btn btn-light" @click="showMenu($event)">Change Category</button>
            <div class="app-dropdown" v-show="isDropdownVisible">
              <a class="dropdown-item app-link" style="cursor: auto; text-decoration:none;">Transfer sources to:</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" v-for="category in categories" @click="changeCategory($event)">{{category.category.name}}</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item app-link" @click="isTexboxVisible=true">+ Create new category</a>
              <div v-show="isTexboxVisible" class="form-group form-for-new-category">
                <label for="catName">Category name</label>
                <input type="text" id="catName" class="form-control" v-model="newCategoryName">
                <button class="btn btn-success" disabled @click.stop.prevent="changeCategory($event)">Create</button>
                <button class="btn btn-light" @click.stop.prevent="isTexboxVisible=false">Cancel</button>
              </div>
          </div>
            <button class="btn btn-light" @click="unfollow()"><i class="material-icons" style="font-size: 20px !important; vertical-align: middle;">delete</i> Unfollow</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source,key) in shownSources">
            <th scope="row"><input type="checkbox" :value="source" v-model="checkedSources" @change='updateCheckAll()'><label for="source"></label></th><!--посмотреть почему не работает чекбокс по клику на ячейке-->
              <td>
                <div v-if="key===indexOfCheckedSource">
                  <input type="text" class="form-control" :value="source" id="newNameInput" required v-on:keyup.enter="saveNewSourceName()">
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
      selectedCategory: 'All Your Sources',
      shownSources: [],
      checkedSources: [],
      isCheckAll: false,
      flag: true,
      indexOfCheckedSource: -1,
      newName: '',
      isDropdownVisible: false,
      isTexboxVisible:false,
      newCategoryName:'',
      categoryName:''
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
    },
    newCategoryName() {
      const menu = document.querySelector('.form-for-new-category');
      const submitButton = menu.querySelector('.btn-success');
      if (this.newCategoryName) {
        submitButton.removeAttribute('disabled');
      }
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
          if(typeof item.source.name!== undefined){
            this.shownSources.push(item.source.name);
          }
        });
      } else {
        if(this.selectedCategory.category.sources!==undefined)
          this.shownSources = this.selectedCategory.category.sources.filter((item)=> {
            return item !== undefined})
        }
    },
    rename() {
      this.indexOfCheckedSource = this.shownSources.findIndex(
        el => el === this.checkedSources[0]
      );
    },
    saveNewSourceName() {
      //после второго изменения значения пропадает выбранная категория и не изменяется значение
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
        this.checkedSources = [];
        this.showSourcesInCategory();
      } else alert('Please, fill the form!');
    },
    unfollow(){
      this.checkedSources.forEach(element => {
        let source = this.sources.find(
          o => o.source.name === element
        );
        let category = this.categories.find(o =>
          o.category.sources.includes(element)
        );
        let sourceIdInCategory = category.category.sources.findIndex(el => el === element
        );
        if(source && category && typeof sourceIdInCategory !== 'undefined'){
          this.$store.dispatch('userSources/ufollowSource', {
            source_key: source.key,
            category_key: category.key,
            sourceIdInCategory: sourceIdInCategory
          }); 
        };
      });
      this.checkedSources = [];
      this.selectedCategory = 'All Your Sources';
      this.showSourcesInCategory();
    },
    changeCategory(event){
      if(event.target.innerHTML === 'Create'){
        this.categoryName=this.newCategoryName;
        this.$store.dispatch('userSources/createNewCategory',this.categoryName);
      }
      else    
        this.categoryName = event.target.innerHTML;
      this.checkedSources.forEach(item => {
        let source = this.sources.find(o => o.source.name === item);
        let oldCategory = this.categories.find(o =>
          o.category.sources.includes(item)
        );
        let sourceIdInOldCategory = oldCategory.category.sources.findIndex(el => el === item);    
        let newCategory = this.categories.find(o => o.category.name === this.categoryName);
        
        if(source && oldCategory && typeof sourceIdInOldCategory !== 'undefined' && newCategory){
          this.$store.dispatch('userSources/changeCategory', {
            source_key: source.key,
            old_category_key: oldCategory.key,
            sourceIdInOldCategory: sourceIdInOldCategory,
            new_category_key: newCategory.key,
            new_category_name:this.categoryName,
            source_name:source.source.name
          });
        }
      });
      this.isDropdownVisible = false;
      this.showSourcesInCategory();
    },
    showMenu(event){
      if(this.checkedSources.length !== 0){
        this.isDropdownVisible = !this.isDropdownVisible;
        const menu = document.querySelector('div.app-dropdown');
        if (menu) {
          menu.style.left = `${event.screenX}px`;
          menu.style.top = `${event.screenY}px`;
        }
      }
      else alert('You should choose at list one source to change category.');
    }
  },
  created(){
    this.showSourcesInCategory();
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

