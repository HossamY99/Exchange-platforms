import datetime
import random
from collections import defaultdict

import jwt

from sqlalchemy import func
from models import Transaction
from settings import db, SECRET_KEY


def dump_data(days_back, transactions_per_day):
    """
    Dumps data into transactions table
    :param days_back: Int to specify the date range to go back to
    :param transactions_per_day: Int to specify the number of transactions to add per day
    """
    for days in range(days_back, -1, -1):
        for i in range(transactions_per_day):
            date = datetime.datetime.now() - datetime.timedelta(days=days)
            usd_amount = random.randint(1, 10000)
            rate = random.randint(10000, 15000)
            usd_to_lbp = usd_amount % 2
            lbp_amount = usd_amount * rate
            new_transaction = Transaction(usd_amount=usd_amount, lbp_amount=lbp_amount, usd_to_lbp=usd_to_lbp,
                                          added_date=date, user_id=None)
            db.session.add(new_transaction)
            db.session.commit()


def fill_data_gaps(rates_list, days_back):
    """
    If we don't have a rate for a specific day, we fill it with the rate of the closest day
    :param rates_list: List of tuples (rate, date) sorted by date
    :param days_back: Number of days back needed
    :return: List of tuples (rate, date) without data gaps
    """
    new_list = []
    if len(rates_list) == 0:
        return []
    if rates_list[0][1] != datetime.datetime.now().date() - datetime.timedelta(days=days_back - 1):
        rates_list.insert(0, (rates_list[0][0], datetime.datetime.now().date() - datetime.timedelta(days=days_back - 1)))
    for i in range(len(rates_list) - 1):
        new_list.append(rates_list[i])
        days_missing = rates_list[i + 1][1] - rates_list[i][1]
        if days_missing.days > 1:
            for j in range(1, days_missing.days):
                new_list.append((rates_list[i][0], rates_list[i][1] + datetime.timedelta(days=j)))
    new_list.append(rates_list[len(rates_list) - 1])
    if rates_list[len(rates_list) - 1][1] != datetime.datetime.now().date():
        new_list.append((rates_list[len(rates_list) - 1][0], datetime.datetime.now().date()))
    return new_list


def biggest_transaction(lbp_to_usd, days):
    """
    :param lbp_to_usd: boolean to specify the type of the transaction
    :param days: number of days to look back to
    :return: the transaction with the biggest rate
    """
    subquery = db.session.query(func.max(Transaction.lbp_amount / Transaction.usd_amount)).filter(
        Transaction.usd_to_lbp == lbp_to_usd,  Transaction.added_date.between(
        datetime.datetime.now() - datetime.timedelta(days=days), datetime.datetime.now()))
    return db.session.query(Transaction).filter(
        Transaction.lbp_amount / Transaction.usd_amount == subquery).first()


def smallest_transaction(lbp_to_usd, days):
    """
    :param lbp_to_usd: boolean to specify the type of the transaction
    :param days: number of days to look back to
    :return: the transaction with the smallest rate
    """
    subquery = db.session.query(func.min(Transaction.lbp_amount / Transaction.usd_amount)).filter(
        Transaction.usd_to_lbp == lbp_to_usd,  Transaction.added_date.between(
        datetime.datetime.now() - datetime.timedelta(days=days), datetime.datetime.now()))
    return db.session.query(Transaction).filter(
        Transaction.lbp_amount / Transaction.usd_amount == subquery).first()


def group_transactions(transactions):
    """
    Group transactions by date
    :param transactions: transactions list
    :return: sorted transactions dict with their date as key
    """
    transactions_dict = defaultdict(list)
    for transaction in transactions:
        transactions_dict[transaction.added_date.date()].append(transaction)
    return {k: transactions_dict[k] for k in sorted(transactions_dict)}


def transactions_to_rates(rates_dict):
    """
    :param rates_dict: dict of lists of transactions grouped by date
    :return: list of tuples containing the rate for each given day
    """
    rates_dates_list = []
    for date, transaction_list in rates_dict.items():
        rates_list = list(map(lambda x: x.lbp_amount / x.usd_amount, transaction_list))
        rates_dates_list.append((sum(rates_list) / len(rates_list), date))
    return rates_dates_list


def get_rates_from_transactions(transactions):
    """
    :param transactions: Transactions List
    :return rates: list of tuples containing the rate for each given day
    """
    transactions = group_transactions(transactions)
    rates = transactions_to_rates(transactions)
    return rates


def create_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm='HS256'
    )


def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None


def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, 'HS256')
    return payload['sub']

# dump_data(20, 3)