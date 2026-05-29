class PostTagAlreadyExistsError(RuntimeError):
    def __init__(self, duplicated_tags: list[dict[str, object]]) -> None:
        self.duplicated_tags = duplicated_tags
        super().__init__("Post tag already exists")


class PostTagIdsNotFoundError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Post tag ids not found: {tag_ids}")


class PostTagDeleteFailedError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Post tag delete failed: {tag_ids}")


class InvalidPostTagIdsError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Invalid post tag ids: {tag_ids}")
