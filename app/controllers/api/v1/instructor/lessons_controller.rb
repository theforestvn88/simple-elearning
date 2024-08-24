module Api
    module V1
        module Instructor
            class LessonsController < ::InstructorApiController
                before_action :authenticate!
                before_action :set_milestone
                before_action :set_lesson, except: [:create]

                def show
                    authorize @lesson
                end

                def create
                    @lesson = Lesson.new(lesson_params)
                    @lesson.milestone_id = @milestone.id
                    @lesson.course_id = @milestone.course_id
                    @lesson.instructor_id = current_user.id

                    authorize @lesson

                    unless @lesson.save
                        render json: @lesson.errors, status: :unprocessable_entity
                    end
                end

                def update
                    authorize @lesson

                    unless @lesson.update(lesson_params)
                        render json: @lesson.errors, status: :unprocessable_entity
                    end
                end

                def destroy
                    authorize @lesson

                    @lesson.destroy
                end

                private

                    def set_milestone
                        @milestone = Milestone.find(params[:milestone_id])
                        # TODO: validate milestone/course
                    end

                    def set_lesson
                        @lesson = Lesson.find(params[:id])
                    end

                    def lesson_params
                        params.require(:lesson).permit(:name, :estimated_minutes, :content)
                    end

                    def policy
                        @policy ||= Pundit.policy(current_user, @lesson)
                    end
            end
        end
    end
end
