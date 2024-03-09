The SQL seed (stocks_seed.sql):
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL
);

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    ticker_symbol VARCHAR(10) NOT NULL,
    number_of_stocks INT NOT NULL,
    value DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

The Model (note that the 'stocks' table was omitted from the final project)
class User(db.Model):
    __tablename__ = 'users'  
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


#removed due to time constraints..goal was to allow the user to build a stock portfolio
#class Stock(db.Model):
#    __tablename__ = 'stocks'
#    id = db.Column(db.Integer, primary_key=True)
#    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)  
#    ticker_symbol = db.Column(db.String(10), nullable=False)
#    number_of_stocks = db.Column(db.Integer, nullable=False)
#    value = db.Column(db.Numeric(10, 2))
#    timestamp = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())