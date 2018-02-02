DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bottled Waters", "Food", 3.99, 10),
("Ice Cream", "Food", 1.99, 10),
("Toothbrush", "Personal", 0.99, 10),
("Toothpaste", "Peronal", 1.59, 10),
("Shoes", "Clothing", 29.99, 10),
("T-Shirt", "Clothing", 19.99, 10),
("Chair", "Home", 55.99, 10),
("Table", "Home", 69.99, 10),
("Chew Toy", "Pets", 14.99, 10),
("Dog Food", "Pets", 24.99, 10);