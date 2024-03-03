from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_app(app):
    """Initialize the SQLAlchemy instance with the Flask app."""
    db.init_app(app)

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

