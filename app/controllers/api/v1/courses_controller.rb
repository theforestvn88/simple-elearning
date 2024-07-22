module Api
  module V1
    class CoursesController < ApiController
      before_action :set_course, only: %i[show update destroy]

      # GET /courses
      # GET /courses.json
      def index
        @courses = Course.all
      end

      # GET /courses/1
      # GET /courses/1.json
      def show; end

      # POST /courses
      # POST /courses.json
      def create
        @course = Course.new(course_params)

        if @course.save
          render :show, status: :created, location: api_v1_course_url(@course)
        else
          render json: @course.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /courses/1
      # PATCH/PUT /courses/1.json
      def update
        if @course.update(course_params)
          render :show, status: :ok, location: api_v1_course_url(@course)
        else
          render json: @course.errors, status: :unprocessable_entity
        end
      end

      # DELETE /courses/1
      # DELETE /courses/1.json
      def destroy
        @course.destroy!
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_course
        @course = Course.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def course_params
        params.require(:course).permit(:name, :summary, :description, :cover)
      end
    end
  end
end
