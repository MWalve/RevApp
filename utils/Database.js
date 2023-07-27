import * as SQLite from 'expo-sqlite';

//create the database
const db = SQLite.openDatabase('mydatabase.db');

//create the 'users' table for storing the information
const createTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)',
            [],
            () => {
                console.log('Table created successfully');
            },
            (_, error) => {
                console.error('Error creating table:', error);
            }
        );
    });
};

// Function to handle user registration and insert user data into the 'users' table
export const registerUser = (username, password) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (_, results) => {
          console.log('Registration successful!', results);
        },
        (_, error) => {
          console.error('Error during registration:', error);
        }
      );
    });
  };
  
  // Function to handle user login and check user credentials in the 'users' table
  export const loginUser = (username, password, onSuccess, onError) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (_, results) => {
          if (results.rows.length > 0) {
            console.log('Login successful!');
            onSuccess(); // Call the success callback on successful login
          } else {
            console.log('Login failed. Invalid credentials.');
            onError(); // Call the error callback on login failure
          }
        },
        (_, error) => {
          console.error('Error during login:', error);
          onError(); // Call the error callback on login failure
        }
      );
    });
  };