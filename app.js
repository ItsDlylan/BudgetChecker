
    //BUDGET CONTROLLER
let budgetController = (function () {
    //Function Constructor for the Expenses that includes the ID, Description, and Value Data
    let Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }
    Expense.prototype.calcPercentage = function(totatlIncome){
        if(totatlIncome > 0){
        this.percentage = Math.round((this.value / totatlIncome) * 100)
        } else{
            this.precentage = -1
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc)
            })
        },
        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage()
            })
            return allPerc  //Allperc is an array with all the items with their percentages
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'


    }

    let formatNumber = function(num,type){
        let numSplit


        num = Math.abs(num)
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0]

        if(int.length > 3 ){
            //substring allows us to take only a part of string 
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, int.length) //Input 2310 = 2,300
        }


        dec = numSplit[1]

        
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec
    }

    let nodeListForEach = function(list,callback){
        for (var i = 0; i < list.length; i++){
            callback(list[i], i)
        }
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder with actual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type))
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
            let type
            obj.budget > 0 ? type = 'inc' : type = 'exp'

            if(obj.budget >= 0 ) {
                document.querySelector(DOMstrings.budgetLabel).textContent =  formatNumber(obj.budget, type)
                document.querySelector(DOMstrings.budgetLabel).style.color = "##54dad6";
                
            } else {
                document.querySelector(DOMstrings.budgetLabel).textContent =  formatNumber(obj.budget, type)
                document.querySelector(DOMstrings.budgetLabel).style.color = "#FF5049";
            }
            
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totatlInc, 'inc')
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totatlExp, 'exp')
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        displayPercentages: function(percentages) {
            
            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            


            nodeListForEach( fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },

        displayMonth: function(){
            let year, month, day, now

            now = new Date()

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            
            month = now.getMonth() 
            
            year = now.getFullYear()
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + year
        },

        changeType: function(){

            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            )


            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus')
            })

            document.querySelector(DOMstrings.addButton).classList.toggle('red');

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

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
    }


    let updateBudget = function(){
       
        // 1. Calculate the budget 
        budgetCtrl.calculateBudget()
        // 2. Return the Budget 
        let budget = budgetCtrl.getBudget()
        // 5. Display the Budget on the UI 
        UICtrl.displayBudget(budget)
    }

    let updatePercentages  = function(){

        //1. calculate percentages
        budgetCtrl.calculatePercentages()
        //2. read from budget controller
        let percentages = budgetCtrl.getPercentages()
        //3. Update uI with new percentages
        UICtrl.displayPercentages(percentages)
        console.log(percentages)
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

        // 6. Calculate and update percentages
        updatePercentages()
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
            console.log('Application has started.')
            UICtrl.displayMonth()
            UICtrl.displayBudget({
                budget: 0,
                totatlInc: 0,
                totatlExp: 0,
                percentage: -1,
            })
            setupEventListeners()

        }

    }

})(budgetController, UIController)

controller.init()   //Without this code nothing will ever happen.


