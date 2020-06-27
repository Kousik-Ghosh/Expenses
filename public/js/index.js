/* Adding matarial ribble effect and text animation
   to google material design elements
*/
(function() {
    const buttons = document.querySelectorAll('.mdc-button');
    const iconButtons = document.querySelectorAll('.mdc-icon-button');
    const textFields = document.querySelectorAll('.mdc-text-field');
    const fabs = document.querySelectorAll('.mdc-fab');
    const radioButtons = document.querySelectorAll('.mdc-radio');
    const radioButtonsForms = document.querySelectorAll('.mdc-form-field');

    for (const button of buttons) {
        mdc.ripple.MDCRipple.attachTo(button);
    }
    for (const iconButton of iconButtons) {
        mdc.iconButton.MDCIconButtonToggle.attachTo(iconButton);
    }
    for (const textField of textFields) {
        mdc.textField.MDCTextField.attachTo(textField);
    }
    for (const fab of fabs) {
        mdc.ripple.MDCRipple.attachTo(fab);
    }
    for (const radioButton of radioButtons) {
        mdc.radio.MDCRadio.attachTo(radioButton);
    }
    for (const radioButtonsForm of radioButtonsForms) {
        mdc.formField.MDCFormField.attachTo(radioButtonsForm);
    }

    return gMaterial = {
        snackbar: new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'))
    };
})();


/*
  Vanila javascript to handle all user interactions and other stuff.
*/

(function() {
    return uiControl = {
        showLoadingGif: function() {
            document.querySelector(".expenses-loading").style.display = "block";
        },

        hideLoadingGif: function() {
            document.querySelector(".expenses-loading").style.display = "none";
        },

        showNoExpense: function() {
            document.querySelector(".no-expenses").style.display = "block";
        },

        hideNoExpenseText: function() {
            document.querySelector(".no-expenses").style.display = "none";
        }
    }
})();


var appViewPort = document.querySelector(".app-display-port");
var filterExpenses = document.getElementById("filter");
var addExpenseModal = document.getElementById("add-modal");
var expenseNameField = document.getElementById("expense-name");
var expenseAmountField = document.getElementById("expense-amount");
var expenseDateTimeField = document.getElementById("expense-datetime");
var aggregationPeriodTextPlaceholder = document.querySelector(".aggregation-period-text");
var currentFilter = "/filter/today";
var currentFilterText = "Today's expense";

function toggleAppBodyBlur() {
    appViewPort.classList.toggle("active");
}

function showSnackBar(sText) {
    gMaterial.snackbar.labelText = sText;
    gMaterial.snackbar.open();
}

function onAddExpensesFilter() {
    toggleAppBodyBlur();
    filterExpenses.style.display = "block";
}

function onFilterExpensesClose() {
    toggleAppBodyBlur();
    filterExpenses.style.display = "none";
}

function onAddExpenses() {
    expenseNameField.value = "";
    expenseAmountField.value = "";
    expenseDateTimeField.value = moment().format("YYYY-MM-DD[T]HH:mm");
    toggleAppBodyBlur();
    addExpenseModal.style.display = "block";
}

function onAddExpensesClose() {
    toggleAppBodyBlur();
    addExpenseModal.style.display = "none";
}

function setAggregationPeriodText(sText) {
    aggregationPeriodTextPlaceholder.innerHTML = sText;
}

function onFilterExpensesSave() {
    var filters = document.getElementsByName('filter-radios');
    onFilterExpensesClose();
    removeAllExpensesContent();
    uiControl.hideNoExpenseText();
    uiControl.showLoadingGif();
    if (filters[0].checked) {
        currentFilter = "/filter/today";
        currentFilterText = "Today's expense";
        getAllExpenses(getExpenseAPI() + "/filter/today", drawTable);
    } else if (filters[1].checked) {
        currentFilter = "/filter/thismonth";
        currentFilterText = "This Month's expense";
        getAllExpenses(getExpenseAPI() + "/filter/thismonth", drawTable);
    } else {
        currentFilter = "/all";
        currentFilterText = "All expense";
        getAllExpenses(getExpenseAPI() + '/all', drawTable);
    }
}

function removeAllExpensesContent() {
    var cards = document.querySelectorAll(".expenses-card");
    document.querySelector(".aggregation-period-text").innerHTML = "";
    document.querySelector(".aggregation-period-value").innerHTML = "";
    for (const card of cards) {
        card.style.display = "none";
    }
}

function getExpenseAPI() {
    return "/expenses";
}

function onAddExpensesSave() {
    var xhr = new XMLHttpRequest();
    var expenseName = document.getElementById("expense-name").value;
    var expenseAmount = document.getElementById("expense-amount").value;
    var expenseDateTime = document.getElementById("expense-datetime").value.replace('T', ' ') + ":00";
    if (expenseName && expenseAmount) {
        onAddExpensesClose();
        removeAllExpensesContent();
        uiControl.hideNoExpenseText();
        uiControl.showLoadingGif();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                showSnackBar("New Expense Saved");
                getAllExpenses(getExpenseAPI() + currentFilter, drawTable);
            }
        };
        xhr.onerror = function(e) {
            showSnackBar("Oops, Something went wrong. Try Again.");
        };
        xhr.ontimeout = function(e) {
            showSnackBar("Oops, Something went wrong. Try Again.");
        };
        xhr.open("POST", getExpenseAPI() + '/create', true);
        xhr.timeout = 8000;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            expenseName: expenseName,
            expenseAmount: expenseAmount,
            expenseDateTime: expenseDateTime
        }));
    }
}

function onDelete(expenseUuid) {
    var xhr = new XMLHttpRequest();
    removeAllExpensesContent();
    uiControl.showLoadingGif();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showSnackBar("Expense Deleted");
            getAllExpenses(getExpenseAPI() + currentFilter, drawTable);
        }
    };
    xhr.onerror = function(e) {
        showSnackBar("Oops, Something went wrong. Try Again.");
    };
    xhr.ontimeout = function(e) {
        showSnackBar("Oops, Something went wrong. Try Again.");
    };
    xhr.open("DELETE", getExpenseAPI() + "/" + expenseUuid, true);
    xhr.timeout = 8000;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

function drawTable(expenses) {
    var appBody = document.querySelector(".app-body");
    var totalExpensePlaceholder = document.querySelector(".aggregation-period-value");
    var expenseCard = document.querySelector(".expenses-card");
    var totalExpense = 0;
    uiControl.hideLoadingGif();
    if (!expenses || expenses.length == 0) {
        uiControl.showNoExpense();
    } else {
        uiControl.hideNoExpenseText();
    }
    for (var i = 0; i < expenses.length; i++) {
        var newExpenseCard = expenseCard.cloneNode(true);
        newExpenseCard.style.display = "block";
        newExpenseCard.getRootNode().getElementsByClassName("expenses-name-text").item(0).innerText = expenses[i].f_expense_name;
        newExpenseCard.getRootNode().getElementsByClassName("expenses-price-value").item(0).innerText = expenses[i].f_expense_cost;
        newExpenseCard.getRootNode().getElementsByClassName("expenses-date-value").item(0).innerHTML = moment(expenses[i].f_expense_date_time).format("Do MMM YY") + " &#xb7; " + moment(expenses[i].f_expense_date_time).format("dddd");
        newExpenseCard.getRootNode().getElementsByClassName("expenses-time-value").item(0).innerText = moment(expenses[i].f_expense_date_time).format('LT');
        newExpenseCard.getRootNode().getElementsByClassName("expenses-delete-icon").item(0).getElementsByClassName("cc-expenses-delete")[0].value = expenses[i].f_expense_uuid;
        newExpenseCard.getRootNode().getElementsByClassName("expenses-delete-icon").item(0).getElementsByClassName("cc-expenses-delete")[1].value = expenses[i].f_expense_uuid;
        appBody.appendChild(newExpenseCard);
        totalExpense += expenses[i].f_expense_cost;
    }
    setAggregationPeriodText(currentFilterText);
    totalExpensePlaceholder.innerHTML = "&#8377;" + totalExpense.toFixed(2);
}

(function getAllExpenses(uRL, callback) {
    fetch(uRL).then(function(response) {
        return response.json()
    }).then(callback).catch(function(error) {
        console.log('Request failed', error)
    });
    window.getAllExpenses = getAllExpenses;
})(getExpenseAPI() + "/filter/today", drawTable);