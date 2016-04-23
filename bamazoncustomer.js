//--Variables to get 
var prompt = require ('prompt');
var mysql = require ('mysql');
var pad = require ('pad');
var table = require('gfm-table')

var con = mysql.createConnection({
		host: 'localhost',
		user: 'Adam',
		password: 'zelaway',
		database: 'Bamazon'
	});
	con.connect(function(err) {
		if (err){
			console.log(err)
		}
		//console.log('connected');
		
	});



//---get info from database put in table

// var out = table([   --------------------> Test of gfm-table npm package
//   ['name', 'color', 'count'],
//   ['Manx Loaghtan', 'brown', 1200],
//   ['Merino', 'white', 534],
//   ['Suffolk', 'black', 200]
// ], ['c', 'l', 'r']);--------------------> Test of gfm-table npm package


// console.log('Welcome User! Would You like to like to see what is in the inventory? \nPress (\'Y\') for YES or (\'N\') for NO.');
// prompt.start();


var directions = function(){ // function that gives directions if you enter a wrong value, moves on if you select yes 
	//prompt.start();
	prompt.get(['Y_or_N'], function (error, result){
		if (error){
			throw error;
		}else if (result.Y_or_N.toLowerCase() === 'y'){
			getTableData();
		}else if ((result.Y_or_N.toLowerCase() ==='n') || (result.Y_or_N.toLowerCase() === 'q')){
			functionToQuit();
		}else{
			validateResonse();
			directions();
		}
	})
} 

var getTableData = function(){
	console.log("\nPlease view the list below:\n");
	con.query("Select itemID, ProductName, Price FROM Products where itemID >=1000", function (err,res){
		if (err) {
			throw err;
		} 
		//console.log(res);
		var newArray = [['Item #', 'Product Name', 'Price in ($)']];

		for (i=0; i<res.length; i++){
			newArray.push([res[i].itemID, res[i].ProductName, res[i].Price]);
			}
			newArray.push(['========','===============','============='])
			var out = table(newArray, ['c','l','r']);
			console.log(out);
			console.log('\nWould You like to order from the list? Press (\'Y\') for YES and (\'N\') for NO, or (\'Q\') to QUIT.');
			prompt.get(['Y_or_N'], function (error, result){
				if (error){
					throw error;
				}else if (result.Y_or_N.toLowerCase() === 'y'){
					functionToOrder();  //	allows you to order 
				}else if ((result.Y_or_N.toLowerCase() === 'n') || (result.Y_or_N.toLowerCase() === 'q')){
					functionToQuit();	//	allows you to quit
				}else{
					validateResonse();
					getTableData();
				}
			})
		});
};

var functionToCheckout = function(){ //function to checkout
	var checkoutList = [['Item #', 'Product Name', 'Price in ($)', 'Quantity Chosen', 'Total Cost']]; //variable to store data 


}


var functionToQuit = function(){ //function quits the program in places other than main setup
	console.log('Are you sure you want to Exit? Press (\'Y\') for YES, (\'N\') for NO, or (\'Q\') to QUIT.\n');
	//prompt.start();
	prompt.get(['Y_or_N'], function (error, result){
		if (error){
			throw error;
		}else if ((result.Y_or_N.toLowerCase() === 'y') || (result.Y_or_N.toLowerCase() ==='q')){
			console.log('\nThank you for using Bamazon, I hope you come again. Goodbye!\n');
			con.end(function (err) {});
		}else if (result.Y_or_N.toLowerCase() ==='n'){
			getTableData();
		} else {
		validateResonse();
		functionToQuit();		
		}
	});
};

var validateResonse = function() {
	console.log('\nYou Have entered an invalid response. \nPlease Press (\'Y\') for YES, (\'N\') for NO, or (\'Q\') to QUIT.');

};

var functionToOrder = function (){  //This is function that allows a customer to order, and updates the Quantity in the Database
	console.log('Please select the product by the Item # and then enter the qauntity wanted. Press (\'Q\') to quit anytime.');
	prompt.get(['ItemID', 'Quantity'], function(error, result){
			if (error) {
				throw error;
			}
			var userChoiceId = result.ItemID;
			var userQuantity = result.Quantity;
			var newQuantity;
			con.query("Select ItemID, ProductName, StockQuantity, Price FROM Products where itemID >=1000", function (err,res){
				if (err){
					throw err;
				}
				for(i=0; i < res.length; i++){
					if ((userChoiceId == res[i].ItemID) && (userQuantity <= res[i].StockQuantity)){
						console.log(userChoiceId, userQuantity);
						var price = userQuantity*res[i].Price;
						console.log (price);
						newQuantity = (res[i].StockQuantity - userQuantity);
						console.log(newQuantity)
						con.query('UPDATE Products SET StockQuantity =' + newQuantity + ' WHERE ItemID=' + userChoiceId+ ';');
						console.log("yes");			
					}else if (userChoiceId.toLowerCase() == 'q'){
						functionToQuit();
						break;	
					//}else if (userChoiceId != res[i].ItemID){
						// console.log('\nYou have selected an unknown item. Please Try Again.');
						// getTableData();
						// break;
					}else if ((userChoiceId == res[i].ItemID) && (userQuantity >res[i].StockQuantity) && (userQuantity !=0)){
						console.log('\nThere are not enough ' + res[i].ProductName.toUpperCase() + ' in stock for the amount selected.\nPlease select ' + res[i].StockQuantity + ' or less of this item');
						break;
						getTableData();
					}
			}	
		})
	
	})
}

var orderAgain = function(){
	console.log('Do You want to order more Items? Please Press (\'Y\') for YES or (\'N\') for NO')
	prompt.get(['Y_or_N'], function (err, response){
		if(response.Y_or_N.toLowerCase() ==='y'){
			functionToOrder();
		}else if (response.Y_or_N.toLowerCase() === 'n'){
			functionToCheckout();
		}else {
			functionToQuit();
		}


	})
}

//-----Run Program

console.log('\n\nWelcome User! Would You like to like to see what is in the inventory? \nPress (\'Y\') for YES, (\'N\') for NO, or (\'Q\') to QUIT.\n');
//prompt.start();
directions();

//getTableData();

// var getItemList = function(){
// 	con.query("Select * FROM Products Where price < 10", function (err,res){
// 		if (err) throw err;
// 		console.log(res);
// 	})


// };

// getItemList();



//Function 1 - 	Directions: Please Select from the list to enter tyour order 
				//	List the initail inventory ID's, names, & prices for sale 
				



//Function 2 - Prompts the user to enter the item he wants based on the ID, and then quanutity
// prompt.start();

// prompt.get(['product', 'quantity'], function (err, result){
// 	if (err){
// 		throw err
// 	}else {
// 		console.log (result);


// 	}

// });
	//if there is enough to order 
		//calculate total 
		//decriemnt the total number of inventory base on how many items ordered
		//incrment the cart of items and total 
		//ask customer if they are done with ordering
			// if yes, bring up cart total (this is the end)
			// if no, restart the ordering function with updated list


	//if not enough items to order 
		//alert user "insufficiet quantity, there are only # of items available."
		//ask if they want ot stop ordering or continue ordering
			//if they stop ordering --- stop, thank you for using our program
			//if they continue ordering, start ordering function again
			
