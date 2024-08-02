module Api
  module V1
    class CoursesController < ApiController
      before_action :set_course, only: %i[show]

      def query
        @pagy, @courses = pagy(Course.includes_cover.includes_partner.all)
        @pagination = pagy_metadata(@pagy).extract!(:series, :pages)
      end

      def show; end

      private

      def set_course
        @course = Course.find(params[:id])
      end

      def course_params
        params.require(:course).permit(:name, :summary, :description, :cover)
      end
    end
  end
end
