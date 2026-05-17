import strawberry

from app.graphql.mutations.message import MessageMutation
from app.graphql.queries.health import HealthQuery


@strawberry.type
class Query(HealthQuery):
    pass


@strawberry.type
class Mutation(MessageMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)