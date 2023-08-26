const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


var todayItems = [];
var workItems =[] ;

app.get("/", (req, res) => {
  res.render("list.ejs",{
    listTitle : "today",
    entryItems : todayItems 
  });
});

app.get("/work", (req, res) => {
  res.render("list.ejs",{
    listTitle : "work",
    entryItems : workItems 
  });
});


app.post("/", (req, res) => {
  if (req.body.button=== "today"){
    todayItems.push(req.body.newitem);
    res.redirect("/");
  }
  else{
    workItems.push(req.body.newitem);
    res.redirect("/work");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// let checkbox = document.getElementById("check-box");
// checkbox.addEventListener( "change", () => {
//     if ( checkbox.checked ) {
//         this.addClass("strike")
//     } else {
//         //
//     }
// });
