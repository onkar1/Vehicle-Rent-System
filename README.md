# Vehicle Rent System

This is a simple vehicle rental system with two pages:
- **Home Page** (`/`)
- **Booking Page** (`/book-vehicle`)

## Running Locally

### Step 1: Download the Project

Clone or download this repository to your local machine.

---

### Frontend Setup

1. **Open a terminal** and navigate to the frontend directory:
   ```bash
   cd Vehicle-Rent-System-Frontend/
   ```
2. **Install npm packages**:
   ```bash
   npm install
   ```
   > If you encounter errors, use the following command:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Start the frontend environment**:
   ```bash
   npm run dev
   ```

---

### Backend Setup

1. **Open a terminal** and navigate to the backend directory:
   ```bash
   cd Vehicle-Rent-System-Backend/
   ```
2. **Install npm packages**:
   ```bash
   npm install
   ```
   > If you encounter errors, use the following command:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Start the backend environment**:
   ```bash
   npm start
   ```

---

### Setting Up Sequelize Database

1. **Open a web browser**.
2. **Reset the database** by visiting the following URL:
   ```
   http://localhost:8000/resetdb
   ```
   This will create a `database.sqlite` file in the `Vehicle-Rent-System-Backend/src/migrations/` directory.

---

Now your vehicle rental system is ready to use! Navigate to the respective pages to explore the functionality.

Note: If you face any CORS issue update frontend url(link of your frontend site e.g., "http://localhost:5173") at Vehicle-Rent-System-Backend/src/config/SystemConfig.json in allowed_origins_list