from flask import request, jsonify, abort
from sqlalchemy.exc import IntegrityError

from models import TransactionSchema, UserSchema, User, TradeSchema, Trade
from settings import app, bcrypt
from .helpers import *

transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
trade_schema = TradeSchema()
trades_schema = TradeSchema(many=True)
user_schema = UserSchema()


@app.route('/transaction', methods=['POST'])
def record_transaction():
    """ Record Transaction
    ---
    post:
      parameters:
      - in: body
        required: True
        schema: InputTransactionSchema
      responses:
        200:
          content:
            application/json:
              schema: TransactionSchema
    """
    usd_amount = request.json["usd_amount"]
    lbp_amount = request.json["lbp_amount"]
    usd_to_lbp = request.json["usd_to_lbp"]
    token = extract_auth_token(request)
    user_id = None if token == 'null' or not token else decode_token(token)
    new_transaction = Transaction(usd_amount=usd_amount, lbp_amount=lbp_amount, usd_to_lbp=usd_to_lbp, user_id=user_id)
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(transaction_schema.dump(new_transaction))


@app.route('/transaction', methods=['GET'])
def get_transactions():
    """ Get User Transactions
    ---
    get:
      parameters:
      - in: headers
        schema: AuthorizationTokenSchema
      responses:
        200:
          content:
            application/json:
              schema: TransactionSchema(many=True)
    """
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    transactions = db.session.query(Transaction).filter_by(user_id=user_id).all()
    return jsonify(transactions_schema.dump(transactions))


@app.route('/exchangeRate', methods=['GET'])
def get_rates():
    """ Get Rates
    ---
    get:
      responses:
        200:
          content:
            application/json:
              schema: RatesSchema
    """
    usd_to_lbp = []
    lbp_to_usd = []
    try:
        transactions = Transaction.query.filter(Transaction.added_date.between(
            datetime.datetime.now() - datetime.timedelta(days=1), datetime.datetime.now())).all()
        for transaction in transactions:
            if transaction.usd_to_lbp:
                usd_to_lbp.append(transaction.lbp_amount / transaction.usd_amount)
            else:
                lbp_to_usd.append(transaction.lbp_amount / transaction.usd_amount)

        response_dict = {
            "usd_to_lbp": round(sum(usd_to_lbp) / len(usd_to_lbp), 2),
            "lbp_to_usd": round(sum(lbp_to_usd) / len(lbp_to_usd), 2)
        }
    except:
        response_dict = {
            "usd_to_lbp": 0,
            "lbp_to_usd": 0
        }
    return jsonify(response_dict)


@app.route('/exchangeRate/graph', methods=['POST'])
def get_rates_graph():
    """ Get Rates Graph Data
    ---
    post:
      parameters:
      - in: body
        required: True
        schema: RatesGraphRequestSchema
      responses:
        200:
          content:
            application/json:
              schema: RatesGraphResponseSchema
    """
    number_of_days_back = request.json["number_of_days_back"]
    buy_rates = db.session.query(Transaction).filter(Transaction.usd_to_lbp == 0, Transaction.added_date.between(
        datetime.datetime.now() - datetime.timedelta(days=number_of_days_back), datetime.datetime.now())).all()
    buy_rates = get_rates_from_transactions(buy_rates)
    buy_rates = fill_data_gaps(buy_rates, number_of_days_back)

    sell_rates = db.session.query(Transaction).filter(Transaction.usd_to_lbp == 1, Transaction.added_date.between(
        datetime.datetime.now() - datetime.timedelta(days=number_of_days_back), datetime.datetime.now())).all()
    sell_rates = get_rates_from_transactions(sell_rates)
    sell_rates = fill_data_gaps(sell_rates, number_of_days_back)

    response_dict = {
        "sell_rates": sell_rates,
        "buy_rates": buy_rates
    }
    return jsonify(response_dict)


@app.route('/exchangeRate/insights', methods=['GET'])
def get_rates_insights():
    """ Get Rates Insights
    ---
    get:
      responses:
        200:
          content:
            application/json:
              schema: RatesInsightsResponseSchema
    """
    days = int(request.args.get('days'))
    buy_rates = db.session.query(Transaction).filter(Transaction.usd_to_lbp == 0, Transaction.added_date.between(
        datetime.datetime.now() - datetime.timedelta(days=days), datetime.datetime.now())).all()
    buy_rates = get_rates_from_transactions(buy_rates)
    sell_rates = db.session.query(Transaction).filter(Transaction.usd_to_lbp == 1, Transaction.added_date.between(
        datetime.datetime.now() - datetime.timedelta(days=days), datetime.datetime.now())).all()
    sell_rates = get_rates_from_transactions(sell_rates)

    response_dict = {
        "biggest_selling_rate": (round(max(sell_rates)[0], 2), max(sell_rates)[1]) if sell_rates else 0,
        "smallest_selling_rate": (round(min(sell_rates)[0], 2), min(sell_rates)[1]) if sell_rates else 0,
        "biggest_buying_rate": (round(max(buy_rates)[0], 2), max(buy_rates)[1]) if buy_rates else 0,
        "smallest_buying_rate": (round(min(buy_rates)[0], 2), min(buy_rates)[1]) if buy_rates else 0
    }
    return jsonify(response_dict)


@app.route('/transactions/insights', methods=['GET'])
def get_transactions_insights():
    """ Get Transactions Insights
    ---
    get:
      responses:
        200:
          content:
            application/json:
              schema: TransactionsInsightsResponseSchema
    """
    days = int(request.args.get('days'))
    buying_transaction_smallest_rate = smallest_transaction(0, days)
    buying_transaction_biggest_rate = biggest_transaction(0, days)
    selling_transaction_biggest_rate = biggest_transaction(1, days)
    selling_transaction_smallest_rate = smallest_transaction(1, days)

    subquery = db.session.query(func.max(Transaction.usd_amount))
    largest_transaction = db.session.query(Transaction).filter(Transaction.usd_amount == subquery).first()

    response_dict = {
        "selling_transaction_biggest_rate": transaction_schema.dump(selling_transaction_biggest_rate),
        "selling_transaction_smallest_rate": transaction_schema.dump(selling_transaction_smallest_rate),
        "buying_transaction_biggest_rate": transaction_schema.dump(buying_transaction_biggest_rate),
        "buying_transaction_smallest_rate": transaction_schema.dump(buying_transaction_smallest_rate),
        "largest_transaction": transaction_schema.dump(largest_transaction)
    }
    return jsonify(response_dict)


@app.route('/user', methods=['POST'])
def create_user():
    """ Create User
    ---
    post:
      parameters:
      - in: body
        required: True
        schema: UserRequestSchema
      responses:
        200:
          content:
            application/json:
              schema: UserSchema
    """
    try:
        user_name = request.json["user_name"]
        password = request.json["password"]
        new_user = User(user_name=user_name, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(user_schema.dump(new_user))
    except IntegrityError:
        return abort(409)


@app.route('/authentication', methods=['POST'])
def authenticate_user():
    """ Authenticate User
    ---
    post:
      parameters:
      - in: body
        required: True
        schema: UserRequestSchema
      responses:
        200:
          content:
            application/json:
              schema: TokenSchema
    """
    user_name = request.json["user_name"] or abort(400)
    password = request.json["password"] or abort(400)
    user = db.session.query(User).filter_by(user_name=user_name).first()
    if user:
        if bcrypt.check_password_hash(user.hashed_password, password):
            return jsonify({"token": create_token(user.id)})
    abort(403)


@app.route('/user/balance', methods=['GET'])
def get_balance():
    """ Get User's Balance
    ---
    get:
      parameters:
      - in: headers
        schema: AuthorizationTokenSchema
      - in: body
        required: True
        schema: AuthorizationTokenSchema
      responses:
        200:
          content:
            application/json:
              schema: BalanceResponseSchema
    """
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    user = db.session.query(User).filter_by(id=user_id).first()
    return jsonify({"usd_balance": user.usd_balance, "lbp_balance": user.lbp_balance})


@app.route('/user/balance', methods=['PUT'])
def update_balance():
    """ Update User's Balance
    ---
    put:
      parameters:
      - in: headers
        schema: AuthorizationTokenSchema
      - in: body
        required: True
        schema: UpdateBalanceSchema
      responses:
        200:
          content:
            application/json:
              schema: BalanceResponseSchema
    """
    lbp_amount = request.json["lbp_amount"]
    usd_amount = request.json["usd_amount"]
    increase = request.json["increase"]
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    user = db.session.query(User).filter_by(id=user_id).first()
    if increase:
        user.lbp_balance += lbp_amount
        user.usd_balance += usd_amount
    elif user.lbp_balance < lbp_amount or user.usd_balance < usd_amount:
        return jsonify({"errormsg": "Can not Withdraw, not enough funds." })
    else:
        user.lbp_balance -= lbp_amount
        user.usd_balance -= usd_amount
    db.session.commit()
    return jsonify({"usd_balance": user.usd_balance, "lbp_balance": user.lbp_balance})


@app.route('/trades', methods=['POST'])
def add_trade():
    """ Add trade
    ---
    post:
      parameters:
      - in: headers
        schema: AuthorizationTokenSchema
      - in: body
        required: True
        schema: TradeRequestSchema
      responses:
        200:
          content:
            application/json:
              schema: TradeResponseSchema
    """
    usd_amount = request.json["usd_amount"]
    rate = request.json["rate"]
    usd_to_lbp = request.json["usd_to_lbp"]
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    user = db.session.query(User).filter_by(id=user_id).first()
    if usd_to_lbp:
        if user.usd_balance < usd_amount:
            abort(409)
    else:
        if user.lbp_balance < usd_amount * rate:
            abort(409)
    if usd_to_lbp:
        user.usd_balance -= usd_amount
    else:
        user.lbp_balance -= usd_amount * rate
    new_trade = Trade(usd_amount=usd_amount, usd_to_lbp=usd_to_lbp, user_id=user_id, rate=rate)
    db.session.add(new_trade)
    db.session.commit()
    return jsonify(trade_schema.dump(new_trade))


@app.route('/trades', methods=['GET'])
def get_trades():
    """ Get All Trades
    ---
    get:
      parameters:
      responses:
        200:
          content:
            application/json:
              schema: TradeSchema(many=True)
    """
    trades = db.session.query(Trade).all()
    return jsonify(trades_schema.dump(trades))


@app.route('/makeTrade', methods=['POST'])
def make_trade():
    """ Exchange money between two users
    ---
    post:
      parameters:
      - in: headers
        schema: AuthorizationTokenSchema
      - in: body
        required: True
        schema: MakeTradeRequestSchema
      responses:
        200:
          content:
            application/json:
              schema: BalanceResponseSchema
    """
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    user = db.session.query(User).filter_by(id=user_id).first()
    trade_id = request.json["trade_id"]
    trade = db.session.query(Trade).filter_by(id=trade_id).first()
    trade_user = db.session.query(User).filter_by(id=trade.user_id).first()
    if user_id == trade.user_id:
        return jsonify({"errormsg": "Can not confrim own trades"})
    if trade.usd_to_lbp:
        if user.lbp_balance < trade.usd_amount * trade.rate:
            return jsonify({"errormsg": "Not enough LL funds"})
        trade_user.lbp_balance += trade.usd_amount * trade.rate
        user.usd_balance += trade.usd_amount
        user.lbp_balance -= trade.usd_amount * trade.rate
    else:
        if user.usd_balance < trade.usd_amount:
            return jsonify({"errormsg": "Not enough $ funds"})
        trade_user.usd_balance += trade.usd_amount
        user.usd_balance -= trade.usd_amount
        user.lbp_balance += trade.usd_amount * trade.rate
    db.session.delete(trade)
    db.session.commit()
    return jsonify({"usd_balance": user.usd_balance, "lbp_balance": user.lbp_balance})


@app.route('/yourtrades', methods=['POST'])
def get_your_trades():
    """ Get All Trades
    ---
    get:
      parameters:
      responses:
        200:
          content:
            application/json:
              schema: TradeSchema(many=True)
    """
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    trades = db.session.query(Trade).filter_by(user_id=user_id).all()
    return jsonify(trades_schema.dump(trades))


@app.route('/cancelTrade', methods=['POST'])
def cancel_trade():
    """ Delete Trade
    ---
    post:
      parameters:
      - in: headers
        schema: AuthorizationTokenSchema
      - in: body
        required: True
        schema: MakeTradeRequestSchema
      responses:
        200:
          content:
            application/json:
              schema: BalanceResponseSchema
    """
    token = extract_auth_token(request)
    user_id = decode_token(token) if token else abort(403)
    user = db.session.query(User).filter_by(id=user_id).first()
    trade_id = request.json["trade_id"]
    trade = db.session.query(Trade).filter_by(id=trade_id).first()
    if trade.usd_to_lbp:
        user.usd_balance += trade.usd_amount
    else:
        user.lbp_balance += trade.usd_amount * trade.rate
    db.session.delete(trade)
    db.session.commit()
    return jsonify({"usd_balance": user.usd_balance, "lbp_balance": user.lbp_balance})
