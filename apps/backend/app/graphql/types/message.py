import strawberry


@strawberry.type
class Message:
    id: str
    title: str
    summary: str