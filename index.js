const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// in memory storage
let users = []
let exercises = []

function generateId(){
  let result = ''
  for(let i = 0; i <= 20; i++){
    result += Math.floor(Math.random() * 10 )
  }

  return result
}




app.post('/api/users/', (req, res) => {
  // validate input
  if(!req.body.username){
    return res.status(400).json({ error : 'Username is required'})
  }

  const username = req.body.username;
  const userId = generateId()
  // creating a user object
  const userObj = { _id : userId, username}

  users.push(userObj)

 // 200 reponse along with the user object {"username":"tester 1","_id":"6787b1653746120013275872"}
 res.status(201).json({ _id : userId , username : username ,})
})

app.get('/api/users', (req, res) => {
  // this route should return all user
  if(!users){
    res.json({message : 'There are no current users'})
  }

  res.status(200).json(users)
})


app.post('/api/users/:_id/exercises', (req,res) => {
  let id = req.params._id;
  let description = req.body.description;
  let duration = parseInt(req.body.duration);
  let date = req.body.date

  //have a default value if no date is provide
  // specifies the default date value
  let defaultDate = new Date()
  let formattedDate = defaultDate.toLocaleString('en-us', {
    weekday : 'short',
    month : 'short',
    day : '2-digit',
    year : 'numeric'
  })
  date = date || formattedDate;
  // search for the user first
  const foundUser = users.find(user => user._id === id)
  // if the user is found add the exercise details as an additional fields to the user object
  if(foundUser){
    Object.assign(foundUser, { description , duration, date})
    // return the foundUser object as a json response
    return res.json({
      username : foundUser.username,
      description : foundUser.description,
      duration : foundUser.duration,
      date : foundUser.date,
      _id : foundUser._id
    })
  }
  else{
    return res.status(404).json({message : 'User cant be found'})
  }

})

app.get('/api/users/:_id/logs', (req, res) => {
  // You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
  // search for the user first
  const targetID = req.params._id

  const foundUser = users.find( user => user.id = targetID);
  if(foundUser){
    // return the exercise log of any user matching with the requested id
    return res.json(foundUser)
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
