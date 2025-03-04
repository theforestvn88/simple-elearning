# All Administrate controllers inherit from this
# `Administrate::ApplicationController`, making it the ideal place to put
# authentication logic or other before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    # right now, just only one root-admin
    http_basic_authenticate_with(
      name: ENV.fetch("ADMIN_NAME"),
      password: ENV.fetch("ADMIN_PASSWORD")
    )

    #
    # TODO Multiple admins?
    #
    # before_action :authenticate_admin

    # def authenticate_admin
    # end

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end
