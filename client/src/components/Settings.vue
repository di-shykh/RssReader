<template>
  <div class="container">
    <div class="row col-12">
      <h3>Your settings:</h3>
      <div class="w-100"></div>
    </div>
    <form v-on:submit.prevent>
      <div class="row col-12">
        <h5>Font Family</h5>
        <div class="w-100"></div>
        <p> Which font should we use for the body of articles?</p>
        <div class="w-100"></div>
        <div class="container">
          <div class="row">
            <input type="radio" name="fontFamily" id="sansSerif" value="sans-serif" v-model="pickedFontFamily">
            <label for="sansSerif">Sans Serif</label>  
          </div>
          <div class="row">
            <input type="radio" name="fontFamily" id="slabSerif" value="slab-serif" v-model="pickedFontFamily">
            <label for="slabSerif">Slab Serif</label>
          </div>
          <div class="row">
            <input type="radio" name="fontFamily" id="verdana" value="verdana" v-model="pickedFontFamily">
            <label for="verdana">Verdana</label>
          </div>
          <div class="row">
            <input type="radio" name="fontFamily" id="monospace" value="monospace" v-model="pickedFontFamily">
            <label for="monospace">Monospace</label>
          </div>
          <div class="row">
            <input type="radio" name="fontFamily" id="systemUi" value="system-ui" v-model="pickedFontFamily">
            <label for="systemUi">System UI</label>
          </div>
        </div>
      </div>
      <div class="row col-12">
        <h5>Font Size</h5>
        <div class="w-100"></div>
        <p> Which font size should we use for the body of articles?</p>
        <div class="w-100"></div>
        <div class="container">
          <div class="row">
            <input type="radio" name="fontSize" id="small" value="small" v-model="pickedFontSize">
            <label for="small">Small</label>  
          </div>
          <div class="row">
            <input type="radio" name="fontSize" id="medium" value="medium" v-model="pickedFontSize">
            <label for="medium">Medium</label>
          </div>
          <div class="row">
            <input type="radio" name="fontSize" id="large" value="large" v-model="pickedFontSize">
            <label for="large">Large</label>
          </div>
          <div class="row">
            <input type="radio" name="fontSize" id="extraLarge" value="x-large" v-model="pickedFontSize">
            <label for="extraLarge">Extra Large</label>
          </div>
        </div>
      </div>
      <div class="row col-12">
        <div class="container">
          <div class="row">
            <h5>Background Color</h5>
            <div class="w-100"></div>
            <p> Which background color should we use?</p>
            <input type="color" name="bgColor" id="bgColor" v-model="bgColor" @change="changeBgColor()">
          </div>
          <div class="row">
            <h5>Text Color</h5>
            <div class="w-100"></div>
            <p> Which text color should we use?</p>
            <input type="color" name="textColor" id="textColor" v-model="textColor" @change="changeTextColor()">
          </div>
          <div class="row">
            <h5>Sidebar Color</h5>
            <div class="w-100"></div>
            <p> Which color should we use for sidebar?</p>
            <input type="color" name="sidebarColor" id="sidebarColor" v-model="sidebarColor" @change="changeSidebarColor()">
          </div>
          <div class="row">
            <h5>Text Color in Sidebar</h5>
            <div class="w-100"></div>
            <p> Which color should we use for text in sidebar?</p>
            <input type="color" name="sidebarTextColor" id="sidebarTextColor" v-model="sidebarTextColor" @change="changeSidebarTextColor()">
          </div>
        </div>
      </div>
      <button class="btn btn-success" @click="saveSettings()">Save</button>
      <button class="btn btn-info" @click="setDefaultSettings()">Set Default Settings</button>
      <button class="btn btn-light" @click="cancel()">Cancel</button>
    </form>
  </div>
</template>
<script>
export default {
  data(){
    return{
      pickedFontFamily:'sans-serif',
      pickedFontSize:'medium',
      bgColor:'#ffffff',
      textColor:'#000000',
      sidebarColor:'#dbe4ee',
      sidebarTextColor:'#007bff'
    }
  },
  computed: {
    userSettings(){
       return this.$store.getters['settings/settings'];
    },
    pickedFontFamily(){
      return this.userSettings.fontFamily;
    },
    bgColor(){
      return this.userSettings.bgColor;
    },
    sidebarColor(){
      return this.userSettings.sidebarColor;
    },
    sidebarTextColor(){
      return this.userSettings.sidebarTextColor;
    },
    textColor(){
      return this.userSettings.textColor;
    }
  },
  watch: {
    pickedFontFamily(newValue, oldValue){
      if(newValue!==oldValue)
        this.$store.dispatch('settings/setFotnFamily', this.pickedFontFamily);
    },
    pickedFontSize(newValue, oldValue){
      if(newValue!==oldValue)
        this.$store.dispatch('settings/setFotnSize', this.pickedFontSize);
    },
    
  },
  methods:{
    changeBgColor(){
      this.$store.dispatch('settings/setBgColor', this.bgColor);
    },
    changeTextColor(){
      this.$store.dispatch('settings/setTextColor', this.textColor);
    },
    changeSidebarColor(){
      this.$store.dispatch('settings/setSidebarColor', this.sidebarColor);
    },
    changeSidebarTextColor(){
      this.$store.dispatch('settings/setSidebarTextColor', this.sidebarTextColor);
    },
    setDefaultSettings(){
      this.$store.dispatch('settings/setDefaultSettings');
    },
    cancel(){
      this.$store.dispatch('settings/setUserSettings');
    },
    saveSettings(){
      this.$store.dispatch('settings/saveUserSettings');
    }
  }
}
</script>
<style scoped>
input[type='radio'] {
  margin-right: 10px;
}
input[type='color'] {
  margin-left: 10px;
}
button {
  margin: 5px;
}
</style>


