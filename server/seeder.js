const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Transaction = require('./models/Transaction');
const Fine = require('./models/Fine');

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/library-management-system');
    console.log('MongoDB Connected to Seeder');

    // Wipe DB
    await User.deleteMany();
    await Book.deleteMany();
    await Transaction.deleteMany();
    await Fine.deleteMany();

    console.log('Old Data Destroyed');

    // Create 10 Users
    let users = [];
    for (let i = 1; i <= 10; i++) {
        users.push(new User({
            name: `User ${i}`,
            email: `user${i}@lms.com`,
            password: 'password123',
            role: i === 1 ? 'admin' : 'user'
        }));
    }
    const createdUsers = await User.insertMany(users);
    console.log('10 Users Seeded. Make sure to use login user1@lms.com and password123 as admin!');

    // Create 10 Books
    const categories = ['Fiction', 'Science', 'History', 'Technology', 'Art'];
    let books = [];
    for (let i = 1; i <= 10; i++) {
        books.push(new Book({
            title: `Book Title ${i}`,
            author: `Author ${i}`,
            category: categories[i % 5],
            totalCopies: 5,
            availableCopies: 5
        }));
    }
    const createdBooks = await Book.insertMany(books);
    console.log('10 Books Seeded');

    // Create 10 Transactions
    let transactions = [];
    let today = new Date();
    for (let i = 0; i < 10; i++) {
        const isReturned = i % 2 === 0;
        
        let issueDate = new Date();
        issueDate.setDate(today.getDate() - (i + 10)); // 10-20 days ago
        let dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 7); // 7 day period
        
        // Let's make some overdue depending on the date!
        let returnDate = isReturned ? new Date(dueDate) : null;
        if(isReturned) {
            returnDate.setDate(returnDate.getDate() + (i%3)); // Some returned late
        }

        transactions.push(new Transaction({
            user: createdUsers[i]._id,
            book: createdBooks[i]._id,
            issueDate,
            dueDate,
            returnDate,
            status: isReturned ? 'returned' : 'issued'
        }));
        
        // Update available copies
        if (!isReturned) {
            await Book.findByIdAndUpdate(createdBooks[i]._id, { availableCopies: 4 });
        }
    }
    const createdTxns = await Transaction.insertMany(transactions);
    console.log('10 Transactions Seeded');

    // Create 10 Fines
    let fines = [];
    for (let i = 0; i < 10; i++) {
        fines.push(new Fine({
            user: createdUsers[i]._id,
            transaction: createdTxns[i]._id,
            amount: (i + 1) * 10,
            status: i % 2 === 0 ? 'paid' : 'unpaid'
        }));
    }
    await Fine.insertMany(fines);
    console.log('10 Fines Seeded');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
