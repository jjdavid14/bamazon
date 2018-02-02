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

	displayTable();
});

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
		startCustomer();
	});
}

// Prompts user with available options as Customer
function startCustomer() {
	inquirer
		.prompt([{
			name: "productToBuy",
			type: "input",
			message: "Enter the ID of the product you would like to buy: "
		},
		{
			name: "quantity",
			type: "input",
			message: "Enter the amount of this product would you like: "
		}
	])
		.then(function(answer) {
			buyProduct(answer.productToBuy, answer.quantity);
		});
}

// Display the total price for item(s) if available
function buyProduct(id, amount) {
	var query = "SELECT * FROM products WHERE ?";
	connection.query(query, {item_id: id}, function(err, res) {
		if(err) {
			console.log("ID is invalid!");
			throw err;
		}

		// Check if the product is in stock
		if(res[0].stock_quantity <= 0) {
			console.log("\nInsufficient quantity!");
		} else {
			console.log("\nYour total cost is: $" + (parseFloat(amount) * parseFloat(res[0].price)));
			var updateQuery = "UPDATE products SET ? WHERE ?";
			connection.query(updateQuery,
			 [
			 	{
			 		stock_quantity: res[0].stock_quantity - amount
			 	},
			 	{
			 		item_id: id
			 	}
			 ],
			 function(err, res) {
			 	if(err) {
			 		throw err;
			 	}
			 });
		}
		displayTable();
	});
}