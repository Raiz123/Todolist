const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require('lodash');
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin_user:test123@cluster0.2j79bm2.mongodb.net/todolistDB");
//create a schema
const itemSchema = {
  name: String,
};
//create mongoose mmodel
const Item = mongoose.model("Item", itemSchema);

const work = mongoose.model("workitem", itemSchema);

const item1 = new Item({
  name: "welcome to your todolist",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<--Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];
//dynamic route
const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);
//dynamic route up .

app.get("/", async (req, res) => {
  let items = await Item.find({});

  if (items.length == 0) {
    Item.insertMany(defaultItems);
    res.redirect("/");
  } else {
    res.render("list.ejs", {
      listTitle: "today",
      entryItems: items,
    });
  }
});

app.get("/work", async (req, res) => {
  let items = await work.find({});

  if (items.length == 0) {
    work.insertMany(defaultItems);
    res.redirect("/");
  } else {
    res.render("list.ejs", {
      listTitle: "work",
      entryItems: items,
    });
  }
});
//custom routes ..
app.get("/:customListName", async (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  const foundList = await List.findOne({ name: customListName });
  if (!foundList) {
    //create a new list
    const list = new List({
      name: customListName,
      items: defaultItems,
    });
    list.save();
    res.redirect("/" + customListName);
  } else {
    //show an existing list

    res.render("list.ejs", {
      listTitle: foundList.name,
      entryItems: foundList.items,
    });
  }
});

app.post("/", async (req, res) => {
  //button is the name given by us to element button .
  const listName = req.body.button;
  const itemName = req.body.newitem;
  if (listName === "today") {
    const item4 = new Item({
      name: itemName,
    });
    item4.save();
    res.redirect("/");
  } else if (listName === "work") {
    const item4 = new work({
      name: itemName,
    });
    item4.save();
    res.redirect("/work");
  } else {
    const item4 = new Item({
      name: itemName,
    });
    const foundList = await List.findOne({ name: listName });
    foundList.items.push(item4);
    foundList.save();
    res.redirect("/" + listName);
  }
});

app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "today") {
    await Item.deleteOne({ _id: checkedItemId });
    res.redirect("/");
  } else if (listName === "work") {
    await work.deleteOne({ _id: checkedItemId });
    res.redirect("/work");
  } else {
    await List.findOneAndUpdate(
      {
        name: listName,
      },
      {
        $pull: { items: { _id: checkedItemId } },
      }
    );
    res.redirect("/" + listName);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
