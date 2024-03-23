const http = require('http')
const url = require('url')
const PORT = 3015;

const users = [
    {
        username:'aman',
        password:'123'
    },
    {
        username:'ajay',
        password:'456'
    },
    {
        username:'hardik',
        password:'789'
    }
]

const server = http.createServer((req,res)=>
{
    const parsedUrl = url.parse(req.url,true)
    const {username, password} = url.parsedUrl;
    const valid = users.find(user=>user.username == username && user.password == password)
    if(valid)
    {
        res.end("user is valid");
    }
    else
    {
        res.end("user is not valid")
    }
})
server.listen(PORT,()=>
{
    console.log('server is listening at ${PORT}')
})