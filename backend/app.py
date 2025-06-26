from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb+srv://test:test@venkatesh.nvutauw.mongodb.net/?retryWrites=true&w=majority")
db = client['user_db']
users = db['users']

# Health check route
@app.route('/')
def home():
    return "Backend is running!"

# Register
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if users.find_one({"email": data['email']}):
        return jsonify({"message": "Email already exists!"}), 400

    hashed_password = generate_password_hash(data['password'])

    user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    users.insert_one(user)
    return jsonify({"message": "Registered successfully!"})

# Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({"email": data['email']})
    if user and check_password_hash(user["password"], data["password"]):
        return jsonify({
            "message": "Login successful!",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "createdAt": user["createdAt"]
            }
        })
    return jsonify({"message": "Invalid email or password!"}), 401

if __name__ == '__main__':
    app.run(debug=True)
