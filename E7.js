const bodyParser = require('body-parser');
const { request } = require('express');
const express = require('express'); 
const Joi = require('joi');
const path = require("path");
var app = express();
require('./prod.js')(app);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
//var server = http.createServer(app);
app.use(express.json());

const courses = [
    { id: 1, name: 'course1',code:"cse321",desc:"" },
];
const Students = [
    { id: 1, name: 'Bassem',code:"1600384" },
];



app.get('/', (req, res) => {
    res.send("Ahlan");
});

app.get('/api/students', (req, res) => {
    res.send(Students);
});
app.get('/api/students/:id', (req, res) => {
    const student = Students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(student);
});

app.post('/api/students', function(req,res){
    const result = validateStudent(req.body)
    if (result.error) {
     res.status(400).send(result.error.details[0].message);
     return;
     }
     const student = {
         id: Students.length + 1,
         name: req.body.name ,// assuming that request body there's a name property
         code:req.body.code,
     };
    Students.push(student)
    console.log(req.body)
    console.log(Students)
    res.send(student);
   });
 
app.put('/api/students/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const student = Students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    // validate 
    // If not valid, return 400 bad request
    const { error } = validateStudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // Update the course 
    // Return the updated course
    student.name = req.body.name;
    student.code=req.body.code
    res.send(student);
});

app.delete('/api/students/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const student = Students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    // Delete
    const index = courses.indexOf(student);
    Students.splice(index, 1);

    // Return the same course
    res.send(`${student} IsDeleted  `);
});


app.get('/api/courses', (req, res) => {
    res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(course);
});

app.post('/api/courses', function(req,res){
    const result = validateCourse(req.body)
    if (result.error) {
     res.status(400).send(result.error.details[0].message);
     return;
     }
     const course = {
         id: courses.length + 1,
         name: req.body.name ,// assuming that request body there's a name property
         code:req.body.code,
         desc:req.body.desc
     };
    courses.push(course)
    console.log(req.body)
    console.log(courses)
    res.send(course);
   });
 
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(`${course} IsDeleted  `);
});



app.get('/web/students/create', function(req,res){
    res.sendFile(path.join(__dirname,'./Student.html'));
  });
app.post('/addStudent', function(req,res){
  
    const result = validateStudent(req.body); 
    if (result.error) {
     res.status(400).send(result.error.details[0].message);
     return;
     }
     const student = {
         id: Students.length + 1,
         name: req.body.name ,// assuming that request body there's a name property
         code:req.body.code,
     };
    Students.push(student)
    console.log(req.body)
    console.log(Students)
    res.sendFile(path.join(__dirname,'./StudentAdd.html'));
   });
   

app.get('/web/courses/create', function(req,res){
    res.sendFile(path.join(__dirname,'./Course.htm'));
  });
app.post('/addCourse', function(req,res){
   const result = validateCourse(req.body)
   if (result.error) {
    res.status(400).send("error =>"+result.error.details[0].message);
    return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name ,// assuming that request body there's a name property
        code:req.body.code,
        desc:req.body.desc
    };
   courses.push(course)
   console.log(req.body)
   console.log(courses)
   res.sendFile(path.join(__dirname,'./CourseAdd.htm'));
  });
  
app.post('/web/courses/create', function(req,res){
console.log(req.url)  
console.log(req.body)
});
const port = process.env.PORT || 3000;
app.listen(port /*PortNumber*/, () => console.log(`Listeneing on port ${port}......`) );
  
function validateCourse(course){
    const schema = Joi.object({ 
        name: Joi.string().min(3).required(),
        code : Joi.string().pattern(new RegExp('^[a-zA-Z]{3}[0-9]{3}$')).required(),
        desc : Joi.string().max(200).allow('')
    });
 return   schema.validate(course)
}
 
function validateStudent(student){
    const schema = Joi.object({ 
        name: Joi.string().pattern(new RegExp("[A-Za-z_']+")).required(),
        code : Joi.string().length(7).required()
    });
    
 return   schema.validate(student)
}