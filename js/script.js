if(!localStorage.getItem('tasks')){
    const defaultTask = {"title": "title"}
    localStorage.setItem('tasks', JSON.stringify([defaultTask]))
    let tasksList = JSON.parse(localStorage.getItem('tasks'))
    tasksList.pop()
    localStorage.setItem('tasks', JSON.stringify(tasksList))
}
const app = Vue.createApp({
    data(){
        return {
            listOfAllTasks: [],
            currentTask: {},
            taskIndex: null,

            inputTitle: '',
            textArea: '',
            selectedCategory: 0,
            selectedColor: 'none',

            categoryCreationName: 'Create New',
            outputCategoryName: 'Create New',

            readOnlyInput: undefined,
            readOnlyComent: undefined,
            readOnlyCategory: undefined,

            isTaskCreationVisible: false,
            isInformationVisible: false,
            isCategoryCreationVisible: false,
            isCollapseVisible: false,

            borderDangerTitle: false,
            borderDangerCategory: false
        }
    },
    created() {
        const dataLocalStorage = localStorage.getItem('tasks')
        if(dataLocalStorage) {
            this.listOfAllTasks = JSON.parse(localStorage.getItem('tasks'))
        }
        this.loadAllTasks()
    },
    watch: {
        isCategoryCreationVisible(value) {
            if(value && this.categoryCreationName == 'Create New') {
                this.categoryCreationName = ''
            } 
        },
        currentTask(value) {
            this.readOnlyInput = value.title
            this.readOnlyComent = value.coment
            this.readOnlyCategory = value.category
            this.selectedColor = value.color
        },
        isCollapseVisible(){
            this.collapseClasses
        }
    },
    computed: {
        inputStyle() {
            return this.borderDangerTitle ? ['form-control', 'border-danger'] : ['form-control']
        },
        inputCategoryStyle() {
            return this.borderDangerCategory ? ['form-control', 'mb-2', 'border-danger'] : ['form-control', 'mb-2']
        },
        textColoration(){
            switch (this.selectedColor) {
                case 'primary':
                    return "text-primary"
                case 'success':
                    return "text-success"
                case 'danger':
                    return "text-danger"
                case 'secondary':
                    return "text-secondary"   
            }
        }
    },
    methods: {
        // All the "toggle" functions are responsible for closing or opening a specific container
        toggleTaskCreationVisibility() {
            this.resetAllInputs()
            this.isTaskCreationVisible = !this.isTaskCreationVisible
        },
        toggleInformationVisibility() {
            this.isInformationVisible = !this.isInformationVisible
        },
        toggleCategoryCreationVisibility() {
            this.isCategoryCreationVisible = !this.isCategoryCreationVisible
        },
        toggleCollapseVisibility(){
            this.isCollapseVisible = !this.isCollapseVisible
        },

        // the "resetAllInputs" is responsible to set all the inputs back to their source state
        resetAllInputs(){
            this.borderDangerTitle = false
            this.borderDangerCategory = false
            this.inputTitle = ''
            this.textArea = ''
            this.selectedCategory = 0
            this.selectedColor = 'none'
            this.isCollapseVisible = !this.isCollapseVisible
            this.categoryCreationName = 'Create New'
        },
        loadAllTasks() {
            this.listOfAllTasks = JSON.parse(localStorage.getItem('tasks'))
        },
        removeTask(index) {
            this.listOfAllTasks.splice(index, 1)
            JSON.parse(localStorage.setItem('tasks', JSON.stringify(this.listOfAllTasks)))
        },
        cancelCategoryChange() {
            this.categoryCreationName = 'Create New'
            this.selectedCategory = 0
            this.readOnlyCategory = 0
            this.borderDangerCategory = false
            this.toggleCategoryCreationVisibility()  
        },
        saveCategory() {
            if(this.categoryCreationName.length == 0) {
                this.borderDangerCategory = true
            } else {
                this.borderDangerCategory = false
                this.toggleCategoryCreationVisibility()
            }
        },
        onCategoryChange() {
            if (this.selectedCategory == 5 || this.readOnlyCategory == 5) {
                this.toggleCategoryCreationVisibility()
            }
        },
        verifyBeforeCreate() {
            if(this.inputTitle.length == 0 ) {
                this.borderDangerTitle = true
            } else {
                this.borderDangerTitle = false
                this.createTask()
            }
        },
        createTask() {
            const title = this.inputTitle
            const coment = this.textArea
            const category = this.selectedCategory
            const categoryText = this.categoryCreationName
            const color = this.selectedColor
            var obj = {}
            if(coment.length > 0) {
                obj = {
                    "title": title,
                    "coment": coment,
                    "category": category,
                    "categoryText": categoryText,
                    "color": color
                }
            } else {
                obj = {
                    "title": title,
                    "category": category,
                    "categoryText": categoryText,
                    "color": color
                }    
            }
            this.addTaskToStorage(obj)
        },
        addTaskToStorage(object) {
            if(localStorage.getItem('tasks').length == 0) {
                localStorage.setItem('tasks', JSON.stringify([object]))
                this.loadAllTasks()
            } else{
                let tasks = JSON.parse(localStorage.getItem('tasks')) || []
                if(tasks) {
                    tasks.push(object)
                    localStorage.setItem('tasks', JSON.stringify(tasks))
                    this.loadAllTasks()
                } 
            }
            this.toggleTaskCreationVisibility()
        },
        taskInformations(index) {
            this.currentTask = this.listOfAllTasks[index]
            this.taskIndex = index
            if(this.currentTask.categoryText){
                this.outputCategoryName = this.currentTask.categoryText
            }else{
                this.outputCategoryName = 'Create New'
            }
            this.isInformationVisible = true
        },
        verifyChanges() {
            const title = this.readOnlyInput
            const coment = this.readOnlyComent
            const category = this.readOnlyCategory
            const categoryText = this.categoryCreationName
            const color = this.selectedColor
            if(title.length == 0){
                this.borderDangerTitle = true
            } else{
                const obj = {"title": title, "coment": coment, "category": category, "categoryText": categoryText, "color": color}
                this.listOfAllTasks[this.taskIndex] = obj
                localStorage.setItem('tasks', JSON.stringify(this.listOfAllTasks))
                this.loadAllTasks()
                this.toggleInformationVisibility()  
                this.borderDangerTitle = false
            }
        },
        bgColor(value){
            switch (value.color) {
                case 'primary':
                    return "list-group-item-primary"
                case 'success':
                    return "list-group-item-success"
                case 'danger':
                    return "list-group-item-danger"
                case 'secondary':
                    return "list-group-item-secondary"   
            }
        },
        
    }
})
app.mount('#myApp')
