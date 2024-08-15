module Api
    module V1
        module Instructor
            class MilestonesController < ::InstructorApiController
                before_action :authenticate!
                before_action :set_course
                before_action :set_milestone, except: [:create]

                def create
                    @milestone = ::Milestone.new(milestone_params)
                    @milestone.course = @course
                    @milestone.instructor = current_user

                    if @milestone.save
                        render @milestone
                    else
                        render json: @milestone.errors, status: :unprocessable_entity
                    end
                end

                def update
                    if @milestone.update(milestone_params)
                        render @milestone
                    else
                        render json: @milestone.errors, status: :unprocessable_entity
                    end
                end

                def destroy
                    @milestone.destroy
                end

                private

                    def set_course
                        @course = Course.find(params[:course_id])
                    end

                    def set_milestone
                        @milestone = Milestone.find(params[:id])
                    end

                    def milestone_params
                        params.require(:milestone).permit(:name)
                    end
            end
        end
    end
end
