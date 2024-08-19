module Api
    module V1
        module Instructor
            class LessonsController < ::InstructorApiController
                before_action :authenticate!
                before_action :set_milestone
                before_action :set_lesson, except: [:create]

                def create
                    @lesson = Lesson.new(lesson_params)
                    @lesson.milestone_id = @milestone.id
                    @lesson.course_id = @milestone.course_id
                    @lesson.instructor_id = current_user.id

                    if @lesson.save
                        render partial: 'api/v1/lessons/lesson', locals: { lesson: @lesson }, status: :created
                    else
                        render json: @lesson.errors, status: :unprocessable_entity
                    end
                end

                def update
                    unless @lesson.update(lesson_params)
                        render json: @lesson.errors, status: :unprocessable_entity
                        # render partial: 'api/v1/lessons/lesson', locals: { lesson: @lesson }, status: :ok
                    # else
                    end
                end

                def destroy
                    @lesson.destroy
                end

                private

                    def set_milestone
                        @milestone = Milestone.find(params[:milestone_id])
                        # TODO: validate milestone
                        # TODO: validate permission
                    end

                    def set_lesson
                        @lesson = Lesson.find(params[:id])
                        # TODO: validate permission
                    end

                    def lesson_params
                        params.require(:lesson).permit(:name, :estimated_minutes)
                    end
            end
        end
    end
end
