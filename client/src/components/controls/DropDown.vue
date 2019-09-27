
  
<template>
    <div class="btn-group noselect">
        <div 
            v-if="value !== void 0"
            class="dropdown-c-toggle"
            @click="toggleMenu()" 
        >
          {{ getValueName(value) }}
          <span class="caret"></span>
        </div>

        <div 
            v-if="value === void 0"
            class="dropdown-c-toggle" 
            @click="toggleMenu()" 
        >
          {{ placeholder }}
          <span class="caret"></span>
        </div>

        <div 
            class="dropdown-c-menu" 
            v-if="isExpanded"
        >
            <div 
                v-for="(option, index) in options"
                :key="'dd'+ index + option.value"
            >
                <a 
                    href="javascript:void(0)" 
                    @click="select(option.value)"
                >
                    {{ option.name }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            options: {
                type: Array,
                required: true
            },

            value: {
                required: true
            },

            placeholder: {
                type: String,
                default: 'Please select'
            }
        },

        data() {
            return {
                isExpanded: false
            }
        },
        
        methods: {
            select(value) {
                this.isExpanded = false;
                this.$emit('change', value);
            },

            toggleMenu() {
                console.log(this.isExpanded)
                this.isExpanded = !this.isExpanded;
            },

            getValueName(value) {
                let name = value;

                if(Array.isArray(this.options))
                    name = this.options.find(el => el.value == value).name;
                return name;
            }
        }
    }
</script>

<style scoped>
.btn-group {
    min-width: 160px;
    font-size: 12px;
    position: relative;
    display: inline-block;
    vertical-align: middle;

    border: 1px solid #039ba8;
    border-radius: 4px;
    color: #039ba8;
}

.btn-group:hover {
    text-decoration: none;
    color: #04b4c4;
}

.dropdown-c-toggle {

    min-width: 160px;
    padding: 6px 12px;
    padding-bottom: 5px;
    text-transform: none;

    border: 0;
    background-size: 0 2px, 100% 1px;
    background-repeat: no-repeat;
    background-position: center bottom, center calc(100% - 1px);
    background-color: transparent;
    transition: background 0s ease-out;
    float: none;
    box-shadow: none;
    border-radius: 0;
}

.dropdown-c-toggle:hover {
    cursor: pointer;
}

.dropdown-c-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    font-size: 12px;
    text-align: left;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
}

.dropdown-c-menu > div > a {
    padding: 10px 30px;
    display: block;
    clear: both;
    font-weight: normal;
    line-height: 1.6;
    color: #333333;
    white-space: nowrap;
    text-decoration: none;
}

.dropdown-c-menu > div > a:hover {
    background: #efefef;
    color: #409FCB;
}

.dropdown-c-menu > div {
    overflow: hidden;
    width: 100%;
    position: relative;
    margin: 0;
}

.caret {
    display: relative;
    width: 0;
    position: relative;
    top: 7px;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid \9;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    float: right;
}

</style>

