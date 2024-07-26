module Admin
  class InstructorsController < Admin::ApplicationController
    def create
      instructor_params = params.require(:instructor).permit(:email, :name)
      result = ::InstructorCreateService.new.call(email: instructor_params[:email], name: instructor_params[:name])

      respond_to do |format|
        if result.success
          format.html { redirect_to admin_instructor_url(result.instructor) }
        else
          format.html { render :new, status: :unprocessable_entity, locals: { page: Administrate::Page::Form.new(dashboard, result.instructor) } }
        end
      end
    end
  end
end
