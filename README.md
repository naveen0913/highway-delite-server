# Node.js Project with MySQL Database

This guide provides steps to run the Node.js project and connect it to a MySQL database.

## Prerequisites

1. **Node.js**: Ensure that Node.js is installed. You can download it from [Node.js official website](https://nodejs.org/).
2. **MySQL**: Ensure that MySQL is installed and running. You can download it from [MySQL official website](https://www.mysql.com/).
3. **Package Manager**: Use `npm` (comes with Node.js) 
4. **Code Editor**: Use a code editor like VS Code for making changes.

---

## Steps to Run the Project

### 1. Clone the Repository
```bash
# Replace <repository-url> with the URL of your repository
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:
```env
PORT=5000
STATUS_CODE_BAD_REQUEST=400
STATUS_CODE_SUCCESS=200
STATUS_CODE_CREATED=201
STATUS_CODE_INTERNAL_ERROR=500
STATUS_CODE_UNAUTHORIZED=401
STATUS_CODE_NOT_FOUND=404
JWT_SECRET_KEY=your-secret-key

MYSQL_DATABASE=db-name
MYSQL_USER=db-user
MYSQL_PASSWORD=db-password
MYSQL_HOST=localhost
MYSQL_PORT=3306

EMAIL=your mail
EMAIL_PASSWORD=your google accont app passowrds (link : https://myaccount.google.com/apppasswords)
EMAIL_PORT=465
EMAIL_HOST=smtp.gmail.com
```

### 4. Create MySQL Database

1. Log in to your MySQL server:
   ```bash
   mysql -u root -p
   ```
2. Create a database:
   ```sql
   CREATE DATABASE your_database_name;
   ```
3. Exit MySQL:
   ```bash
   exit
   ```

### 5. Run the Project

Start the server:
```bash
npm start
```
The server will start on the port specified in the `.env` file (default is 3000).

### 6. Verify the Connection

- Check your console for any errors.
- Use a REST client like Postman or your browser to test the API endpoints.

---

```
