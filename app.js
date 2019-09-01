
    //BUDGET CONTROLLER
let budgetController = (function () {
    //Function Constructor for the Expenses that includes the ID, Description, and Value Data
    let Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }
    //Function Constructor for the Income that includes the ID, Description, and Value Data
    let Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }
    // Function to calculate the Total of one type, Income or Expense by grabing the data of the type and running it through a
    // For each Loop wihth the current item and adding the sum with the current value by += 
    let calculateTotal =function (type){
        let sum = 0
        //data.allItems[type] type being 'ex' or 'inc' Look at line 27 to see the array
        data.allItems[type].forEach(function(cur){
            
            sum += cur.value
        })
       //edits our Data.totals for the type 'exp' or 'inc' on line 34  
        data.totals[type] = sum
    }

    //Our data 
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget:  0,
        percentage: -1
    }

    return {
        //Adds item to the budget Controller by grabbing the type "exp" or 'inc' the desc and the value
        addItem: function(type, des, val){
            let newItem

            //Create New ID by grabing the data of the type with the length of all the Items in that totals, 
            //then checking the id and adding 1.
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else{
                ID = 0
            }

            //Create New item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }

            //Push it into our data structure
            data.allItems[type].push(newItem)
            //Return the new element
            return newItem
        },
        //Deletes the Item from our dataStructure used for when we click the X icon.
        deleteItem: function(type, id){
            let ids, index
            
            ids = data.allItems[type].map(function(current) { //Map returns a whole new array. forEach does not 
                return current.id;
            })
            //sets index to the index of the current id
            index = ids.indexOf(id)

            if(index !== -1){
                //splice is used  to remove elements
                //goes into the all items inside of the type 'exp' or 'inc' and removes it.
                //spice takes 2 arguments, Where to start and how many to remove. 
                //In this case we start at the index that we found on line 76 then we removedjust 1 aka being that index.
                data.allItems[type].splice(index, 1)
            }
        },
        //Method to calculate the Budget based on all the totals.
        calculateBudget: function(){

            //calculate total income and expsenses
            //Uses Calculate total from line 17 
            calculateTotal('exp')
            calculateTotal('inc')
            //Calculate the budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp
            // Calculate the percentage of income that we spent 
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }    
            //Expense = 100 and income = 200, spent 50% = 100/200 = .5 * 100

        },
        //Get Budget by returning the data above to use in our Global Controller.
        getBudget: function(){
            return {
                budget: data.budget,
                totatlInc: data.totals.inc,
                totatlExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        //Using for Dev testing 
        testing: function(){
            console.log(data)
        }
    }

})()

    //UI CONTROLLER
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'


    }
    return {
        getInput: function(){

            return {
                type: document.querySelector(DOMstrings.inputType).value,  //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },

        addListItem: function(obj, type){
            let html, newHTML, element
            //Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder with actual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', obj.value)
            //Insert HTML into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)

        },

        deleteListItem: function(selectorID){
            let el = document.getElementById(selectorID);
            //remove child is a cool way to delete from the dom
            el.parentNode.removeChild(el)
        },

        clearFields: function(){
            let fields, fieldsArr
           fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)

            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(function (current, index, array ){
                current.value = '';

            })

            fieldsArr[0].focus()
        },

        displayBudget: function(obj){
            // if (obj.budget > 1) {
            //     console.log('this worked')
            //     document.querySelector(DOMstrings.budgetLabel).textContent = " + " + obj.budget
            // } else if (obj.budget < 0){
            //     document.querySelector(DOMstrings.budgetLabel).textContent = " - " + obj.budget
            // }
            if(obj.budget >= 0 ) {
                document.querySelector(DOMstrings.budgetLabel).textContent =  " + " + obj.budget
                document.querySelector(DOMstrings.budgetLabel).style.color = "#28B9B5";
                
            } else {
                document.querySelector(DOMstrings.budgetLabel).textContent =  obj.budget
                document.querySelector(DOMstrings.budgetLabel).style.color = "#FF5049";
            }
            
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totatlInc
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totatlExp
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },

        getDOMstrings: function(){
            return DOMstrings
        }

    }

})()

    //GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMstrings()
        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13 ){
                ctrlAddItem()
            }
            
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    let updateBudget = function(){
       
        // 1. Calculate the budget 
        budgetCtrl.calculateBudget()
        // 2. Return the Budget 
        let budget = budgetCtrl.getBudget()
        // 5. Display the Budget on the UI 
        UICtrl.displayBudget(budget)
    }

    let ctrlAddItem = function(){
        var input, newItem
        // 1. Get the Field Input data   
        input = UIController.getInput()


        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        // 2. Add Item to the Budget Controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        // 3. Add the item to the UI 
        UICtrl.addListItem(newItem, input.type)
        
        // 3.5 Clear the Fields
        UICtrl.clearFields()

        // 4 Calculate and update budgets 
        updateBudget()
        }
    }

    let ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        if (itemID){

            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            // delete item from data structure
            budgetCtrl.deleteItem(type, ID)
            // delete item from UI
            UICtrl.deleteListItem(itemID)
            //Update and show the new budget
            updateBudget()
        }

    }


    return {
        init: function(){
            setupEventListeners()
        }

    }

})(budgetController, UIController)

controller.init()   //Without this code nothing will ever happen.


