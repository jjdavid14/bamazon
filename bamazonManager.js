// Set up the dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// Set up connection to MySQL
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

// Connect to database
connection.connect(function(err) {
	// If theres an error, throw
	if(err) {
		throw err;
	}

	startManager();
});

// Prompts user with available options as Manager
function startManager() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Menu:",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          displayTable();
          break;

        case "View Low Inventory":
          displayLow();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addNew();
          break;
      }
    });
}

// List every available item: the item IDs, names, prices, and quantities.
function displayTable() {
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res) {
		if(err) {
			throw err;
		}

		var table = new Table({
			head: ["ID",
			 "Product Name",
			 "Department Name",
			 "Price",
			 "Quantity"
			 ],
			 colWidths: [5, 20, 20, 10, 10]
		});

		for (var i = 0; i < res.length; i++) {
	     table.push(
	     	[
	     		res[i].item_id,
	     		res[i].product_name,
	     		res[i].department_name,
	     		res[i].price,
	     		res[i].stock_quantity
	     	]
	     );
	    }

		console.log(table.toString());
		startManager();
	});
}

// List all items with an inventory count lower than five.
function displayLow() {
	var query = "SELECT * FROM products WHERE stock_quantity < 5";
	connection.query(query, function(err, res) {
		if(err) {
			throw err;
		}

		var table = new Table({
			head: ["ID",
			 "Product Name",
			 "Department Name",
			 "Price",
			 "Quantity"
			 ],
			 colWidths: [5, 20, 20, 10, 10]
		});

		for (var i = 0; i < res.length; i++) {
	     table.push(
	     	[
	     		res[i].item_id,
	     		res[i].product_name,
	     		res[i].department_name,
	     		res[i].price,
	     		res[i].stock_quantity
	     	]
	     );
	    }

		console.log(table.toString());
		startManager();
	});
}

// Display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
	inquirer
		.prompt([{
			name: "productToRestock",
			type: "input",
			message: "Enter the ID of the product you would like to incease its inventory: "
		},
		{
			name: "quantity",
			type: "input",
			message: "Enter the amount of this product you would like to add: "
		}
	])
		.then(function(answer) {
			var query = "UPDATE products SET ? WHERE ?";
			connection.query(query,
			 [
			 	{
			 		stock_quantity: parseInt(answer.quantity)
			 	},
			 	{
			 		item_id: answer.productToRestock
			 	}
			 ],
			 function(err, res) {
			 	if(err) {
			 		throw err;
			 	}
			 	startManager();
			 });
		});
}

// Allow the manager to add a completely new product to the store.
function addNew() {
	inquirer
		.prompt([{
			name: "name",
			type: "input",
			message: "Enter the name of the new product you would like to add: "
		},
		{
			name: "department",
			type: "input",
			message: "Enter the name of the department this product belongs to: "
		},
		{
			name: "price",
			type: "input",
			message: "Enter the price of this product: "
		},
		{
			name: "quantity",
			type: "input",
			message: "Enter the amount of this product you would like to add: "
		}
	])
		.then(function(answer) {
			var query = "INSERT INTO products SET ?";
			connection.query(query,
			 {
			 	product_name: answer.name,
				department_name: answer.department,
				price: parseFloat(answer.price),
				stock_quantity: parseInt(answer.quantity)
			 },
			 function(err, res) {
			 	if(err) {
			 		throw err;
			 	}
			 });
			startManager();
		});
}