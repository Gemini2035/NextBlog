class SiteNavigationAlreadyExistsError(RuntimeError):
    pass


class SiteNavigationIdsNotFoundError(RuntimeError):
    def __init__(self, navigation_ids: list[int]) -> None:
        self.navigation_ids = navigation_ids
        super().__init__(f"Site navigation ids not found: {navigation_ids}")


class SiteNavigationDeleteFailedError(RuntimeError):
    def __init__(self, navigation_ids: list[int]) -> None:
        self.navigation_ids = navigation_ids
        super().__init__(f"Site navigation delete failed: {navigation_ids}")


class SiteNavigationParentNotFoundError(RuntimeError):
    pass


class SiteNavigationInvalidParentError(RuntimeError):
    pass
