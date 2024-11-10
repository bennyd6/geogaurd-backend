const express=require('express')
const connectToMongo=require('./db')

const app=express()
const cors=require('cors')
const port = 3000

connectToMongo();
app.use(express.json());
app.use(cors())
app.use('/api/auth',require('./routes/auth'))
app.use('/citizen', require('./routes/citizen'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})