module Api
    module V1
        module Instructor
            class CoursesController < ::InstructorApiController
                before_action :authenticate!
                before_action :set_course, only: %i[show update destroy]

                def index
                    @pagy, @courses = pagy(Course.all)
                    @pagination = pagy_metadata(@pagy).extract!(:series, :pages)
                end

                def show; end
            
                def create
                    @course = Course.new(course_params)
                    @course.instructor = current_user

                    if @course.save
                        render :show, status: :created, location: api_v1_course_url(@course)
                    else
                        render json: @course.errors, status: :unprocessable_entity
                    end
                end

                def update
                    if @course.update(course_params)
                        render :show, status: :ok, location: api_v1_course_url(@course)
                    else
                        render json: @course.errors, status: :unprocessable_entity
                    end
                end

                def destroy
                    @course.destroy!
                end

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
end