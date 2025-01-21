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
  // create an exercise object along with a userId field
  const exerciseObj = {userId : id, description, duration, date}
  // push that exerciseObj to the exercises[]
  exercises.push(exerciseObj)
  // the following code attempts to associate that exercise object to an existing user
  // search for the user first
  const foundUser = users.find(user => user._id === id)
  // if the user is found add the exercise details as an additional fields to the user object
  if(foundUser){
    Object.assign(foundUser, exerciseObj)
    // return the foundUser object as a json response
    return res.json({
      username : foundUser.username,
      description : exerciseObj.description,
      duration : exerciseObj.duration,
      date : exerciseObj.date,
      _id : foundUser._id
    })
  }
  else{
    return res.status(404).json({message : 'User cant be found'})
  }

})

// GET /api/users/:_id/logs
app.get('/api/users/:_id/logs', (req, res) =>{
  const targetID = req.params._id;
  // find the user first
  const foundUser = users.find(user => user._id === targetID)
  if(!foundUser){
    return res.status(404).json({message : 'User not found'})
  }

  const userExercises = exercises.filter(exercise => exercise.userId === targetID)
  if (userExercises.length === 0) {
    return res.json({
      username: foundUser.username,
      count: 0,
      _id: targetID,
      log: [],
    });
  }
  const exercisesCount = userExercises.length

  // building the response
  const toResponse = {
    username : foundUser.username,
    count : exercisesCount,
    _id : targetID,
    log : userExercises.map(exercise => ({
      description : exercise.description,
      duration : exercise.duration,
      date : new Date(exercise.date).toDateString()
    }))
  }

  return res.json(toResponse)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
