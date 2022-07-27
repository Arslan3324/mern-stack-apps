const express = require('express')
const bodyParser = require('body-parser')
const {
    v4: uuidv4
} = require('uuid');
const {
    urlencoded
} = require('body-parser')
const app = express()
const ejs = require("ejs")

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(urlencoded({
    extended: true
}))



var budget = 0;
var listOfExpense = []
var balance = 0;
var expense = 0;



var editTitle = " "
var editAmount = " "


app.get("/", (req, res) => {
    res.render("index", {
        budget,
        balance,
        expense,
        editTitle,
        editAmount,
        listOfExpense

    })
})

app.post('/budget', async (req, res) => {
    getbudget = req.body.budget
    budget = Number(budget) + Number(getbudget);
    balance = budget
    console.log(budget)
    res.redirect("/", )
})
var reamount = 0
app.post('/expense', async (req, res) => {
    const {
        inputExpense,
        inputExpenseAmount
    } = req.body
    reamount = inputExpenseAmount
    expense = Number(inputExpenseAmount) + Number(expense)
    balance = balance - inputExpenseAmount

    var id = uuidv4();

    listOfExpense = [...listOfExpense, [
        id,
        inputExpense,
        inputExpenseAmount
    ]]
    console.log(listOfExpense)
    res.redirect("/", )
})

app.patch('/delete', (req, res) => {

    const id = req.body._id
    var arrSize = listOfExpense.length
    balance = balance + Number(listOfExpense[arrSize - 1][2])
    expense = expense - Number(listOfExpense[arrSize - 1][2])
    var newList = listOfExpense
    for (var i = 0; i <= newList.length - 1; i++) {
        if (newList[i][0] == id) {
            newList[i].splice(0, 3);
        }
    }
    let temp = []
    listOfExpense.forEach(element => {
        if (element != '') {
            temp.push(element)
        }
    });

    listOfExpense = temp;
    // console.log("2: ", id)
    // console.log("List of expense: ", listOfExpense);
    // console.log("Size: ==>", arrSize)
    res.redirect("/", )
})

app.patch('/update', (req, res) => {

    let id = req.body._id
    let title = req.body._name
    let amounbt = req.body._amount
    var arrSize = listOfExpense.length

    listOfExpense[arrSize - 1][1] = title;
    listOfExpense[arrSize - 1][2] = amounbt
    var newamount = reamount - amounbt
    var newamount2 = amounbt - reamount

    balance = balance + Number(newamount)
    expense = expense - Number(newamount)

    console.log("newamount: ", newamount)
    console.log("Update ID: ", id)
    console.log("Update Name: ", title)
    console.log("Update Amount: ", amounbt)
    res.redirect("/", )
})
app.listen(3010, function () {
    console.log('Server is listening at port 3010')
})