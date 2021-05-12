import json

from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin
from marshmallow import Schema, fields

from app.app import *

spec = APISpec(
    title="Exchange API",
    version="1.0.0",
    openapi_version="3.0.2",
    plugins=[FlaskPlugin(), MarshmallowPlugin()],
)


class InputTransactionSchema(Schema):
    usd_amount = fields.Float(required=True)
    lbp_amount = fields.Float(required=True)
    usd_to_lbp = fields.Boolean(required=True)


class TokenSchema(Schema):
    token = fields.String()


class AuthorizationTokenSchema(Schema):
    Authorization = fields.String(required=True)


class RatesSchema(Schema):
    lbp_to_usd = fields.Float()
    usd_to_lbp = fields.Float()


class RatesGraphRequestSchema(Schema):
    days = fields.String(required=True)


class RatesGraphResponseSchema(Schema):
    buy_rates = fields.List(fields.List(fields.Float))
    sell_rates = fields.List(fields.List(fields.Float))


class RatesInsightsResponseSchema(Schema):
    biggest_selling_rate = fields.List(fields.Float)
    smallest_selling_rate = fields.List(fields.Float)
    biggest_buying_rate = fields.List(fields.Float)
    smallest_buying_rate = fields.List(fields.Float)


class TransactionsInsightsResponseSchema(Schema):
    selling_transaction_biggest_rate = fields.Nested(TransactionSchema)
    selling_transaction_smallest_rate = fields.Nested(TransactionSchema)
    buying_transaction_biggest_rate = fields.Nested(TransactionSchema)
    buying_transaction_smallest_rate = fields.Nested(TransactionSchema)
    largest_transaction = fields.Nested(TransactionSchema)


class UserRequestSchema(Schema):
    user_name = fields.String(required=True)
    password = fields.String(required=True)


class UpdateBalanceSchema(Schema):
    lbp_amount = fields.Float()
    usd_amount = fields.Float()
    increase = fields.Boolean()


class BalanceResponseSchema(Schema):
    usd_balance = fields.Float()
    lbp_balance = fields.Float()


class TradeRequestSchema(Schema):
    rate = fields.Float(required=True)
    usd_amount = fields.Float(required=True)
    usd_to_lbp = fields.Boolean(required=True)


class TradeResponseSchema(Schema):
    buyer_user_name = fields.Str()
    seller_user_name = fields.Str()
    buy_usd = fields.Boolean()
    lbp_amount = fields.Float()
    usd_amount = fields.Float()


class MakeTradeRequestSchema(Schema):
    trade_id = fields.Integer(required=True)


spec.components.schema("User", schema=UserSchema)
spec.components.schema("Transaction", schema=TransactionSchema)

spec.components.schema("InputTransaction", schema=InputTransactionSchema)
spec.components.schema("Token", schema=TokenSchema)
spec.components.schema("AuthorizationToken", schema=AuthorizationTokenSchema)
spec.components.schema("Rates", schema=RatesSchema)
spec.components.schema("RatesGraphRequest", schema=RatesGraphRequestSchema)
spec.components.schema("RatesGraphResponse", schema=RatesGraphResponseSchema)
spec.components.schema("RatesInsightsResponse", schema=RatesInsightsResponseSchema)
spec.components.schema("TransactionsInsightsResponse", schema=TransactionsInsightsResponseSchema)
spec.components.schema("UserRequest", schema=UserRequestSchema)
spec.components.schema("UpdateBalanceSchema", schema=UpdateBalanceSchema)
spec.components.schema("BalanceResponseSchema", schema=BalanceResponseSchema)
spec.components.schema("TradeRequestSchema", schema=TradeRequestSchema)
spec.components.schema("TradeResponseSchema", schema=TradeResponseSchema)
spec.components.schema("MakeTradeRequestSchema", schema=MakeTradeRequestSchema)

with app.test_request_context():
    spec.path(view=get_rates)
    spec.path(view=get_rates)
    spec.path(view=record_transaction)
    spec.path(view=get_transactions)
    spec.path(view=create_user)
    spec.path(view=authenticate_user)
    spec.path(view=get_rates_graph)
    spec.path(view=get_rates_insights)
    spec.path(view=get_transactions_insights)
    spec.path(view=update_balance)
    spec.path(view=get_balance)
    spec.path(view=add_trade)
    spec.path(view=make_trade)

with open('documentation/swagger.json', 'w') as file:
    json.dump(spec.to_dict(), file)
