#ADD API KEY ON LINES 114 AND 127

from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from models import init_app, User, db
from datetime import datetime, timedelta
import requests

app = Flask(__name__)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/stocks'
app.config["SECRET_KEY"] = "blah"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SQLALCHEMY_ECHO'] = True

init_app(app)

bcrypt = Bcrypt(app)

def connect_db():
    """Connect to the SQLAlchemy database and create tables."""
    db.create_all()

with app.app_context():
    connect_db()

@app.route("/")
def homepage():
    """Show homepage links."""
    return render_template("home.html")

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response

    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        expires = timedelta(days=1)
        access_token = create_access_token(identity=user.id, expires_delta=expires)
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname
        }
        return jsonify({'access_token': access_token, 'user': user_data}), 200  
    else:
        return jsonify({'error': 'Invalid username or password'}), 401



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    if not username or not password or not email or not firstname or not lastname:
        return jsonify({'error': 'All fields are required'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_password, email=email, firstname=firstname, lastname=lastname)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return jsonify({'access_token': access_token}), 200

@app.route('/user_details', methods=['GET', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', headers=['Content-Type', 'Authorization'])
@jwt_required()
def user_details():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname
        }
        return jsonify(user_data), 200
    else:
        return jsonify({'error': 'User not found'}), 404

#ADD API KEY HERE
@app.route('/search', methods=['GET'])
@jwt_required()
def search():
    search_query = request.args.get('q')
    external_api_url = f'https://finnhub.io/api/v1/quote?symbol={search_query}&token=<API KEY HERE>'
    try:
        response = requests.get(external_api_url)
        response.raise_for_status()
        search_results = response.json()
        return jsonify(search_results), 200
    except requests.RequestException as e:
        return jsonify({'error': f'Failed to fetch data: {str(e)}'}), 500

#ADD API KEY HERE
@app.route('/news', methods=['GET'])
# Removed @jwt_required() to make this route public...tried to avoid making this public but it didn't make the cut
def news():
    external_api_url = f'https://finnhub.io/api/v1/news?category=general&token=<API KEY HERE>'
    try:
        response = requests.get(external_api_url)
        response.raise_for_status()
        search_results = response.json()
        return jsonify(search_results), 200
    except requests.RequestException as e:
        return jsonify({'error': f'Failed to fetch data: {str(e)}'}), 500
if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(debug=True)


#EXTERNAL API CALL STUFF:
#EXTERNAL API: https://finnhub.io/docs/api/
#FOR TICKET SYMBOL JSON: https://finnhub.io/api/v1/search?q=apple&token=api KEY HERE
#FOR GENERAL COMPANY INFO: https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=api KEY HERE




