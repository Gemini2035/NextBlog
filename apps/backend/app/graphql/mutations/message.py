from uuid import uuid4

import strawberry

from app.graphql.types.message import Message


@strawberry.input
class CreateMessageInput:
    title: str
    content: str


@strawberry.type
class MessageMutation:
    @strawberry.mutation
    def create_message(self, payload: CreateMessageInput) -> Message:
        return Message(
            id=str(uuid4()),
            title=payload.title,
            summary=payload.content[:80],
        )