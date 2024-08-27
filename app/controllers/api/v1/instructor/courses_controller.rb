module Api
    module V1
        module Instructor
            class CoursesController < ::InstructorApiController
                before_action :authenticate!
                before_action :set_course, only: %i[show update destroy]

                def index
                    @pagy, @courses = pagy(current_user.partner_courses.recently_updated.includes_cover.includes_partner)
                    @pagination = pagy_metadata(@pagy).extract!(:series, :pages)
                end

                def show
                    authorize @course
                end
            
                def create
                    @course = Course.new(course_params)
                    @course.instructor_id = current_user.id
                    @course.partner_id = current_user.partner_id
                    
                    authorize @course

                    if @course.save
                        render :show, status: :created, location: api_v1_instructor_course_url(id: @course.id, identify: current_user.id)
                    else
                        render json: @course.errors, status: :unprocessable_entity
                    end
                end

                def update
                    authorize @course

                    if @course.update(course_params)
                        render :show, status: :ok, location: api_v1_instructor_course_url(@course)
                    else
                        render json: @course.errors, status: :unprocessable_entity
                    end
                end

                def destroy
                    authorize @course

                    @course.destroy!
                end

                private

                    def set_course
                        @course = Course.find(params[:id]) 
                    end

                    def course_params
                        params.require(:course).permit(:name, :summary, :description, :cover)
                    end

                    def policy
                        @policy ||= Pundit.policy(current_user, @course)
                    end
            end
        end
    end
end