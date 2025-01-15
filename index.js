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
const users = []

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




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
