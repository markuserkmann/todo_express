const express = require('express')
const app = express()
const path = require('path')
const fs = require('node:fs')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', async(req, res) => {
    const TasksFromFile = await ReadDataFromFile()
    res.render('index', {tasks: TasksFromFile})
})

app.post('/getTask', (req, res) => {
    WriteTextToFile(req.body.task)
    res.redirect(303, '/')
})

app.post('/delete-task/*', async(req, res) => {
    let OUrl = req.originalUrl
    let ID = OUrl.replace("/delete-task/", "")
    let doesEXist = await DoesIDEXist(ID)
    if (doesEXist === true) {
        DeleteByID(ID)
    }
    res.redirect(303, '/')
})

function DoesIDEXist(id) {
    return new promise((callback) => {
        fs.readFile(path.join(__dirname, "tasks.json"), "utf8", (err,data) => {
            if (err) {
                console.error("err")
                return
            }

            const tasks = JSON.parse(data)
            const exists = tasks.some(task => task.id === Math.floor(id))

            callback(exists)
        })
    })
}

function DeleteByID (id) {
    fs.readFile(path.join(__dirname, "tasks.json"), "utf8", (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let tasks = JSON.parse(data)

        tasks = tasks.filter(item => item.id !== Math.floor(id) )
        fs.writeFile(path.join(__dirname, "tasks.json"), JSON.stringify(tasks, null, 2), "utf8", err => {
            if (err) {
                console.error(err)
                return
            }
        })
        console.log(tasks)
    })
}

function WriteTextToFile(text) {
    fs.readFile(path.join(__dirname, "tasks.json"), "utf8", (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let tasks = JSON.parse(data)

        const ID = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

        const newTask = {
            id: ID,
            task: text
        }

        tasks.push(newTask)

        fs.writeFile(path.join(__dirname, "tasks.json"), JSON.stringify(tasks, null, 2), "utf8", err => {
            if (err) {
                console.error(err)
                return
            }
        })
        console.log(tasks)
    })
}

function ReadDataFromFile() {
    return new Promise((Callback) => {
        fs.readFile(path.join(__dirname, "tasks.json"), 'utf8', (err,data ) => {
            if (err) {
                console.error(err)
                return
            }
            const Tasks = JSON.parse(data)
            Callback(Tasks)
            return 
        })
    });
};

app.listen(3002, () => {
    console.log("Listening on 3002")
})