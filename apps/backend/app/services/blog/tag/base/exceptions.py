class BlogTagAlreadyExistsError(RuntimeError):
    def __init__(self, duplicated_tags: list[dict[str, object]]) -> None:
        self.duplicated_tags = duplicated_tags
        super().__init__("Blog tag already exists")


class BlogTagIdsNotFoundError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Blog tag ids not found: {tag_ids}")


class BlogTagDeleteFailedError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Blog tag delete failed: {tag_ids}")


class InvalidBlogTagIdsError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Invalid blog tag ids: {tag_ids}")
