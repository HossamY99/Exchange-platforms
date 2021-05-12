import datetime

from marshmallow import fields

from settings import db, ma, bcrypt


class Transaction(db.Model):
    def __init__(self, usd_amount, lbp_amount, usd_to_lbp, user_id, added_date=datetime.datetime.now()):
        super(Transaction, self).__init__(usd_amount=usd_amount, lbp_amount=lbp_amount, usd_to_lbp=usd_to_lbp,
                                          user_id=user_id, added_date=added_date)

    id = db.Column(db.Integer, primary_key=True)
    usd_amount = db.Column(db.Float, unique=False, nullable=False)
    lbp_amount = db.Column(db.Float, unique=False, nullable=False)
    usd_to_lbp = db.Column(db.Boolean, unique=False, nullable=False)
    added_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)


class TransactionSchema(ma.Schema):
    class Meta:
        fields = ("id", "usd_amount", "lbp_amount", "usd_to_lbp", "added_date", "user_id")
        model = Transaction


class User(db.Model):
    def __init__(self, user_name, password):
        super(User, self).__init__(user_name=user_name, usd_balance=0, lbp_balance=0)
        self.hashed_password = bcrypt.generate_password_hash(password)

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(30), unique=True)
    hashed_password = db.Column(db.String(128))
    usd_balance = db.Column(db.Float)
    lbp_balance = db.Column(db.Float)


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "user_name")
        model = User


class Trade(db.Model):
    def __init__(self, usd_amount, usd_to_lbp, user_id, rate, added_date=datetime.datetime.now()):
        super(Trade, self).__init__(usd_amount=usd_amount, usd_to_lbp=usd_to_lbp, user_id=user_id,
                                    added_date=added_date, rate=rate)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    usd_amount = db.Column(db.Float, unique=False, nullable=False)
    rate = db.Column(db.Float)
    usd_to_lbp = db.Column(db.Boolean)
    added_date = db.Column(db.DateTime)


class TradeSchema(ma.Schema):
    class Meta:
        fields = ("id", "user_id", "usd_amount", "rate", "usd_to_lbp", "added_date")
        model = Trade
