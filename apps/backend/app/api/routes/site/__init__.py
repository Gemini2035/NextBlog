from . import home_init as home_init_routes
from . import site_init as site_init_routes
from . import site_config_categories as site_config_category_routes
from . import site_navigation as site_navigation_routes
from . import site_settings as site_setting_routes
from . import static_content as static_content_routes
from . import static_content_categories as static_content_category_routes

__all__ = [
    "site_config_category_routes",
    "home_init_routes",
    "site_init_routes",
    "site_navigation_routes",
    "site_setting_routes",
    "static_content_routes",
    "static_content_category_routes",
]
